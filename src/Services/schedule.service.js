require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { deleteReservationById } = require("./reservation.service");
const { deleteRatingById } = require("./rating.service");
const { deleteShuttleById } = require("./shuttle.service");
const { deleteStaffReportById } = require("./staffReport.service");

const getAllSchedules = async ({
  page,
  limit,
  order,
  startPlaceName,
  arrivalPlaceName,
  ...query
}) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    if (startPlaceName) query["$StartPlaceData.placeName$"] = startPlaceName;
    if (arrivalPlaceName)
      query["$ArrivalPlaceData.placeName$"] = arrivalPlaceName;
    const schedules = await db.Schedule.findAndCountAll({
      where: query,
      ...queries,
      include: [
        {
          model: db.Coach,
          as: "CoachData",
        },
        {
          model: db.Route,
          as: "RouteData",
        },
        {
          model: db.Staff,
          as: "DriverData",
        },
        {
          model: db.Staff,
          as: "CoachAssistantData",
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
    return apiReturns.success(200, "Get Schedules Successfully", schedules);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

const createNewSchedule = async (rawData) => {
  try {
    const scheduleData = rawData.body;
    await db.Schedule.create(scheduleData);
    return apiReturns.success(200, "Create a new Schedule Successfully");
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

const updateSchedule = async (rawData) => {
  try {
    const updateData = rawData.body;
    const { id } = rawData.params;
    await db.Schedule.update(updateData, { where: { id: id } });
    return apiReturns.success(200, "Update Schedule Successfully");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const deleteScheduleById = async (id) => {
  const [ratings, reservations, shuttles, staffReports] = await Promise.all([
    db.Rating.findAndCountAll({ where: { scheduleId: id } }),
    db.Reservation.findAndCountAll({ where: { scheduleId: id } }),
    db.Shuttle.findAndCountAll({ where: { scheduleId: id } }),
    db.StaffReport.findAndCountAll({ where: { scheduleId: id } }),
  ]);

  await Promise.all([
    ...ratings.rows.map((rating) => deleteRatingById(rating.id)),
    ...reservations.rows.map((reservation) =>
      deleteReservationById(reservation.id)
    ),
    ...shuttles.rows.map((shuttle) => deleteShuttleById(shuttle.id)),
    ...staffReports.rows.map((staffReport) =>
      deleteStaffReportById(staffReport.id)
    ),
  ]);
};

const deleteSchedule = async (rawData) => {
  try {
    const { id } = rawData.params;
    const reservations = await db.Reservation.findAndCountAll({
      where: { scheduleId: id },
    });
    if (reservations.rows > 0) {
      await Promise.all(
        reservations.map(async (reservation) => {
          await deleteReservation(reservation.id);
        })
      );
    }
    await db.Schedule.destroy({ where: { id: id } });
    return apiReturns.success(200, "Delete Schedule Successfully");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllSchedules,
  createNewSchedule,
  deleteScheduleById,
  deleteSchedule,
  updateSchedule,
};
