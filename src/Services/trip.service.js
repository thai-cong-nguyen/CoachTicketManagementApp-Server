require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op, fn, col, literal, where } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { countNumberOfPassengerByScheduleId } = require("./schedule.service");
const { shuttleRouteForShuttle } = require("../Services/shuttle.service");
const { listServiceNameForCoach } = require("../Services/coach.service");

const getAllTrips = async ({
  page,
  limit,
  order,
  from,
  to,
  startPlace,
  arrivalPlace,
  departureTime,
  roundTime,
  roundTrip,
  seats,
  popular,
  ...query
}) => {
  try {
    // Queries for pagination and ordering when getting trips.
    const queries = {
      raw: true,
      nest: true,
      limit: +limit || +process.env.PAGINATION_LIMIT,
      offset:
        (!page || +page <= 1 ? 0 : +page - 1) *
        (+limit || +process.env.PAGINATION_LIMIT),
    };
    if (order && order.trim() !== "") {
      const arrayOrder = order.split(",");
      queries.order = [[arrayOrder[0], arrayOrder[1]]]; // 'ASC' for ascending, 'DESC' for descending
    } else {
      queries.order = [["id", "ASC"]];
    }
    let roundTripQuery = {};
    // Add conditions for "from" and "to" places.
    if (from) {
      query["$RouteData.departurePlace$"] = from;
      if (roundTrip === "true")
        roundTripQuery["$RouteData.arrivalPlace$"] = from;
    }
    if (to) {
      query["$RouteData.arrivalPlace$"] = to;
      if (roundTrip === "true")
        roundTripQuery["$RouteData.departurePlace$"] = to;
    }
    query[Op.and] = [];
    if (startPlace) {
      query[Op.and].push({
        "$StartPlaceData.placeName$": startPlace,
      });
    }
    if (arrivalPlace) {
      query[Op.and].push({
        "$ArrivalPlaceData.placeName$": arrivalPlace,
      });
    }
    // Add conditions for departure time (ignoring time).
    let suggestedTrips = null;
    if (departureTime) {
      query.departureTime = {
        [Op.and]: [
          literal(
            `date_trunc('day', "departureTime") = '${new Date(
              departureTime
            ).toISOString()}'::timestamp`
          ),
        ],
      };
      const targetDepartureTime = new Date(departureTime).toISOString();
      suggestedTrips = await db.Schedule.findAndCountAll({
        where: {
          departureTime: {
            [Op.gte]: new Date().toISOString(),
          },
        },
        order: [
          [
            fn(
              "ABS",
              literal(
                `EXTRACT('epoch' from AGE("departureTime", '${targetDepartureTime}'))`
              )
            ),
            "ASC",
          ],
        ],
        limit: 5,
        include: [
          {
            model: db.Coach,
            as: "CoachData",
            include: [
              {
                model: db.CoachType,
                as: "CoachTypeData",
              },
            ],
          },
          {
            model: db.Route,
            as: "RouteData",
          },
          {
            model: db.Staff,
            as: "DriverData",
            attributes: ["id", "fullName", "phoneNumber", "gender"],
          },
          {
            model: db.Staff,
            as: "CoachAssistantData",
            attributes: ["id", "fullName", "phoneNumber", "gender"],
          },
          {
            model: db.Places,
            as: "StartPlaceData",
          },
          {
            model: db.Places,
            as: "ArrivalPlaceData",
          },
        ],
      });
      suggestedTrips.rows.map(async (trip) => {
        const serviceCoachSuggestedTrip = await db.CoachService.findAll({
          where: { coachId: trip.coachId },
          include: [
            {
              model: db.Service,
              as: "ServiceData",
              attribute: ["serviceName"],
            },
          ],
        });
        const serviceSuggestedTrip = serviceCoachSuggestedTrip.map(
          (service) => service.ServiceData.serviceName
        );
        trip.ServiceData = serviceSuggestedTrip;
      });
    }

    // Merging related table in db to search trips.
    const trips = await db.Schedule.findAndCountAll({
      where: query,
      ...queries,
      include: [
        {
          model: db.Coach,
          as: "CoachData",
          include: [
            {
              model: db.CoachType,
              as: "CoachTypeData",
            },
          ],
        },
        {
          model: db.Route,
          as: "RouteData",
        },
        {
          model: db.Staff,
          as: "DriverData",
          attributes: ["id", "fullName", "phoneNumber", "gender"],
        },
        {
          model: db.Staff,
          as: "CoachAssistantData",
          attributes: ["id", "fullName", "phoneNumber", "gender"],
        },
        {
          model: db.Places,
          as: "StartPlaceData",
        },
        {
          model: db.Places,
          as: "ArrivalPlaceData",
        },
      ],
    });
    let finalTrips = null;
    if (trips.count > 0) {
      // Calculating the remaining slot seats && Adding service in Coach and Seats Data and Shuttle Data for each trips.
      await Promise.all(
        trips.rows.map(async (data) => {
          data.ShuttleData = (
            await shuttleRouteForShuttle(
              await db.Shuttle.findAndCountAll({
                where: { scheduleId: data.id },
              })
            )
          ).rows;
          const serviceTrip = await listServiceNameForCoach(data.coachId);
          const reservations = await db.Reservation.findAndCountAll({
            where: {
              scheduleId: data.id,
            },
            attributes: ["seatNumber"],
          });
          const seatsData = reservations.rows.map(
            (reservation) => reservation.seatNumber
          );
          const remainingSlot = Math.max(
            0,
            data.CoachData.capacity - reservations.count
          );
          data.remainingSlot = remainingSlot;
          data.ServiceData = serviceTrip;
          data.SeatsData = seatsData;
        })
      );

      // Check if the remaining slots are still available for demanding passenger.
      const tripsWithEnoughSeats = seats
        ? trips.rows.filter((data) => data.remainingSlot >= seats)
        : trips.rows;

      // Check if the trip has round trips
      let filteredTrips = null;
      if (roundTrip === "true") {
        filteredTrips = await Promise.all(
          tripsWithEnoughSeats.map(async (data) => {
            roundTripQuery["$StartPlaceData.placeName$"] =
              data.ArrivalPlaceData.placeName;
            roundTripQuery["$ArrivalPlaceData.placeName$"] =
              data.StartPlaceData.placeName;
            roundTripQuery["$RouteData.arrivalPlace$"] =
              data.RouteData.departurePlace;
            roundTripQuery["$RouteData.departurePlace$"] =
              data.RouteData.arrivalPlace;
            roundTime
              ? (roundTripQuery.departureTime = {
                  [Op.gt]: data.arrivalTime,
                  [Op.and]: [
                    literal(
                      `date_trunc('day', "departureTime") = '${new Date(
                        roundTime
                      ).toISOString()}'::timestamp`
                    ),
                  ],
                })
              : (roundTripQuery.departureTime = { [Op.gt]: data.arrivalTime });
            const isRoundTrip = await db.Schedule.findAndCountAll({
              where: {
                ...roundTripQuery,
              },
              ...queries,
              include: [
                {
                  model: db.Coach,
                  as: "CoachData",
                  include: [
                    {
                      model: db.CoachType,
                      as: "CoachTypeData",
                    },
                  ],
                },
                {
                  model: db.Route,
                  as: "RouteData",
                },
                {
                  model: db.Staff,
                  as: "DriverData",
                  attributes: ["id", "fullName", "phoneNumber", "gender"],
                },
                {
                  model: db.Staff,
                  as: "CoachAssistantData",
                  attributes: ["id", "fullName", "phoneNumber", "gender"],
                },
                {
                  model: db.Places,
                  as: "StartPlaceData",
                },
                {
                  model: db.Places,
                  as: "ArrivalPlaceData",
                },
              ],
            });
            data.roundTrip = [];
            if (isRoundTrip.count > 0) {
              await Promise.all(
                isRoundTrip.rows.map(async (trip) => {
                  const serviceRoundTrip = await listServiceNameForCoach(
                    trip.coachId
                  );
                  const reservations = await db.Reservation.findAndCountAll({
                    where: {
                      scheduleId: trip.id,
                    },
                    attributes: ["seatNumber"],
                  });
                  const seatsDataRoundTrip = reservations.rows.map(
                    (reservation) => reservation.seatNumber
                  );
                  const remainingSlot = Math.max(
                    0,
                    trip.CoachData.capacity - reservations.count
                  );
                  trip.remainingSlot = remainingSlot;
                  trip.SeatsData = seatsDataRoundTrip;
                  trip.ServiceData = serviceRoundTrip;
                  data.roundTrip.push(trip);
                })
              );
            }
            if (popular) {
              return data;
            }
            return isRoundTrip.count > 0 ? data : null;
          })
        );
      }
      // Remove null values (trips without a round trip)
      finalTrips =
        roundTrip === "true"
          ? filteredTrips.filter((trip) => trip !== null)
          : tripsWithEnoughSeats;
    }

    return apiReturns.success(
      200,
      "Get Successfully",
      finalTrips
        ? {
            count: finalTrips.length,
            rows: finalTrips,
            suggestedTrips: suggestedTrips,
          }
        : {
            count: 0,
            rows: [],
            suggestedTrips: suggestedTrips,
          }
    );
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const getSeatTrip = async (rawData) => {
  try {
    const scheduleId = rawData.params.id;
    const reservations = await db.Reservation.findAll({
      where: { scheduleId: scheduleId },
      attributes: ["seatNumber"],
    });
    const seats = await reservations.reduce((acc, curr) => {
      acc.push(curr.seatNumber);
      return acc;
    }, []);
    return apiReturns.success(200, "Get Successfully", seats);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getPopularTrip = async (rawData) => {
  try {
    let allTrips = await db.Schedule.findAndCountAll({
      where: {
        departureTime: {
          [Op.gte]: new Date().toISOString(),
        },
      },
      attributes: ["id"],
    });
    let mostOfPassenger = 0;
    let scheduleId = null;
    await allTrips.rows.sort(async (before, after) => {
      const beforePassengers = await countNumberOfPassengerByScheduleId(
        before.id
      );
      const afterPassengers = await countNumberOfPassengerByScheduleId(
        after.id
      );
      return beforePassengers == afterPassengers
        ? 0
        : beforePassengers > afterPassengers
        ? -1
        : 1;
    });
    const sliceTrips = allTrips.rows.slice(0, 5);
    let res = [];
    await Promise.all(
      sliceTrips.map(async (trip) => {
        const response = await getAllTrips({
          popular: "true",
          roundTrip: "true",
          id: trip.id,
        });
        res = [...res, ...response.data.rows];
      })
    );
    return apiReturns.success(200, "Get successfully", {
      count: res.length,
      rows: res,
    });
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = { getAllTrips, getSeatTrip, getPopularTrip };
