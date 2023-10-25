require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getAllTrips = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    const trips = await db.Schedule.findAndCountAll({
      where: query,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      ...queries,
      include: [
        {
          model: db.Coach,
          as: "CoachData",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: db.CoachType,
              as: "CoachTypeData",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
        {
          model: db.Route,
          as: "RouteData",
          attributes: { exclude: ["createdAt", "updatedAt"] },
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
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: db.Places,
          as: "ArrivalPlaceData",
          attributes: { exclude: ["createdAt", "updatedAt"] },
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
        console.log(reservations);
        const capacity = data.CoachData.capacity;
        const remainingSlot =
          reservations.count <= capacity ? capacity - reservations.count : 0;
        // let seats = [];
        // reservations.rows.map(async (reservation) => {
        //   seats.push(reservation.seatNumber);
        // });
        // data.seats = seats;
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

module.exports = { getAllTrips, getSeatTrip };
