require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op, fn, col } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getAllTrips = async ({
  page,
  limit,
  order,
  from,
  to,
  departureTime,
  roundTime,
  roundTrip,
  seats,
  ...query
}) => {
  try {
    // Queries for pagination and ordering when getting trips.
    const queries = {
      raw: true,
      nest: true,
      limit: +limit || +process.env.PAGINATION_LIMIT,
      offset:
        !page || +page <= 1
          ? 0
          : +page - 1 * (+limit || +process.env.PAGINATION_LIMIT),
      order: order || undefined,
    };

    // Add conditions for "from" and "to" places.
    if (from) query["$StartPlaceData.placeName$"] = from;
    if (to) query["$ArrivalPlace.placeName$"] = to;

    // Add conditions for departure time (ignoring time).
    if (departureTime)
      query.departureTime = {
        [Op.and]: [
          fn("date", col("departureTime")),
          {
            [Op.eq]: new Date(departureTime),
          },
        ],
      };

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
    let resultGetTrips = null;
    if (trips.count > 0) {
      // Calculating the remaining slot seats for each trips.
      await Promise.all(
        trips.rows.map(async (data) => {
          const countedReservations = await db.Reservation.count({
            where: {
              scheduleId: data.id,
            },
          });
          const remainingSlot = Math.max(
            0,
            data.CoachData.capacity - countedReservations
          );
          data.remainingSlot = remainingSlot;
        })
      );

      // Check if the remaining slots are still available for demanding passenger.
      const tripsWithEnoughSeats = seats
        ? trips.rows.filter((data) => data.remainingSlot >= seats)
        : trips.rows;

      // Check if the trip has round trips
      resultGetTrips = roundTrip
        ? tripsWithEnoughSeats.filter(async (data) => {
            const isRoundTrip = await db.Reservation.findOne({
              where: {
                "$StartPlaceData.placeName$": to,
                "$EndPlaceData.placeName$": from,
              },
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
            return isRoundTrip;
          })
        : tripsWithEnoughSeats;
    }

    return apiReturns.success(
      200,
      "Get Successfully",
      resultGetTrips
        ? {
            count: trips.count,
            rows: resultGetTrips,
          }
        : {}
    );
  } catch (error) {
    console.error(error.message);
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

const countNumberOfPassengerByScheduleId = async (scheduleId) => {
  const reservations = await db.Reservation.findAndCountAll({
    where: { scheduleId: scheduleId },
  });
  return reservations ? reservations.count : 0;
};

const getPopularTrip = async (rawData) => {
  try {
    const data = rawData.body;
    let allTrips = await db.Schedule.findAndCountAll({
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
    return apiReturns.success(200, "Get successfully", allTrips);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = { getAllTrips, getSeatTrip, getPopularTrip };
