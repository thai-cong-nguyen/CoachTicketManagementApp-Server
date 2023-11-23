require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getAllTrips = async ({ page, limit, order, from, to, ...query }) => {
  try {
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
    if (from) query["$StartPlaceData.placeName"] = from;
    if (to) query["$ArrivalPlace.placeName"] = to;
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
    await Promise.all(
      trips.rows.map(async (data) => {
        const reservations = await db.Reservation.findAndCountAll({
          where: {
            scheduleId: data.id,
          },
        });
        const capacity = data.CoachData.capacity;
        const remainingSlot = Math.max(0, capacity - reservations.count);
        // reservations.count <= capacity ? capacity - reservations.count : 0;
        data.remainingSlot = remainingSlot;
      })
    );
    return apiReturns.success(200, "Get Successfully", trips);
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
