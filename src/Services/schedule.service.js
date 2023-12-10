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
    await Promise.all(
      schedules.rows.map(async (schedule) => {
        const shuttleRoutes = await db.ShuttleRoutes.findAll({
          include: [
            {
              model: db.Shuttle,
              as: "ShuttleData",
              where: { scheduleId: schedule.id },
              include: [
                { model: db.Coach, as: "CoachData" },
                { model: db.Staff, as: "DriverData" },
                { model: db.Staff, as: "CoachAssistantData" },
              ],
            },
          ],
        });
        schedule.ShuttleRoutesData = shuttleRoutes;
      })
    );
    return apiReturns.success(200, "Get Schedules Successfully", schedules);
  } catch (error) {
    console.log(error);
    return apiReturns.error(400, error.message);
  }
};

const createNewSchedule = async (rawData) => {
  try {
    const { shuttles, ...scheduleData } = rawData.body;
    await db.sequelize.transaction(async (tx) => {
      const schedule = await db.Schedule.create(scheduleData, {
        transaction: tx,
      });
      if (!schedule) {
        throw new Error("Can not create schedule");
      }
      if (scheduleData.driverId) {
        await db.Staff.update(
          { status: false },
          { where: { id: scheduleData.driverId }, transaction: tx }
        );
      }
      if (scheduleData.coachAssistantId) {
        await db.Staff.update(
          { status: false },
          { where: { id: scheduleData.coachAssistantId }, transaction: tx }
        );
      }
      if (shuttles) {
        await Promise.all(
          shuttles.map(
            async ({
              departureTime,
              departurePlace,
              departurePlaceLat,
              departurePlaceLng,
              ...shuttleInfo
            }) => {
              const shuttle = await db.Shuttle.create(
                { ...shuttleInfo, scheduleId: schedule.id },
                { transaction: tx }
              );
              const shuttleRoute = await db.ShuttleRoutes.create(
                {
                  shuttleId: shuttle.id,
                  departureTime: departureTime,
                  departurePlace: departurePlace,
                  departurePlaceLat: departurePlaceLat,
                  departurePlaceLng: departurePlaceLng,
                },
                { transaction: tx }
              );
            }
          )
        );
      }
    });
    return apiReturns.success(200, "Create a new Schedule Successfully");
  } catch (error) {
    console.log(error);
    return apiReturns.error(400, error.message);
  }
};

const updateSchedule = async (rawData) => {
  try {
    const { shuttleInfo, ...updateData } = rawData.body;
    const { scheduleId } = rawData.params;
    await db.sequelize.transaction(async (tx) => {
      const schedule = await db.Schedule.findByPk(scheduleId);
      if (!schedule) {
        throw new Error("Can not find schedule");
      }
      const shuttles = await db.Shuttle.findAll({
        where: { scheduleId: scheduleId },
      });
      if (shuttleInfo) {
        if (shuttles) {
          await Promise.all(
            shuttles.map(async (data) => {
              await db.Shuttle.destroy({
                where: { id: data.id },
                transaction: tx,
              });
            })
          );
        }
        await Promise.all(
          shuttleInfo.map(
            async ({
              departureTime,
              departurePlace,
              departurePlaceLat,
              departurePlaceLng,
              ...data
            }) => {
              const shuttle = await db.Shuttle.create(
                { scheduleId: scheduleId, ...data },
                {
                  transaction: tx,
                }
              );
              await db.ShuttleRoutes.create(
                {
                  shuttleId: shuttle.id,
                  departureTime: departureTime,
                  departurePlace: departurePlace,
                  departurePlaceLat: departurePlaceLat,
                  departurePlaceLng: departurePlaceLng,
                },
                { transaction: tx }
              );
            }
          )
        );
      } else {
        await Promise.all(
          shuttles.map(async (data) => {
            await db.Shuttle.destroy({
              where: { id: data.id },
              transaction: tx,
            });
          })
        );
      }
      await db.Schedule.update(updateData, {
        where: { id: scheduleId },
        transaction: tx,
      });
      const updatedSchedule = await db.Schedule.findByPk(scheduleId);
      if (updatedSchedule.driverId !== schedule.driverId) {
        await db.Staff.update(
          { status: false },
          { where: { id: updatedSchedule.driverId }, transaction: tx }
        );
        await db.Staff.update(
          { status: true },
          { where: { id: schedule.driverId }, transaction: tx }
        );
      }
      if (updatedSchedule.coachAssistantId !== schedule.coachAssistantId) {
        await db.Staff.update(
          { status: false },
          { where: { id: updatedSchedule.coachAssistantId }, transaction: tx }
        );
        await db.Staff.update(
          { status: true },
          { where: { id: schedule.coachAssistantId }, transaction: tx }
        );
      }
    });
    return apiReturns.success(200, "Update Schedule Successfully");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const deleteSchedule = async (rawData) => {
  try {
    const { scheduleId } = rawData.params;
    const schedule = await db.Schedule.findByPk(scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }
    await db.sequelize.transaction(async (tx) => {
      await db.Schedule.destroy({ where: { id: scheduleId }, transaction: tx });
      await db.Staff.update(
        { status: true },
        { where: { id: schedule.driverId }, transaction: tx }
      );
      await db.Staff.update(
        { status: true },
        { where: { id: schedule.coachAssistantId }, transaction: tx }
      );
    });
    return apiReturns.success(200, "Delete Schedule Successfully");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const countNumberOfPassengerByScheduleId = async (
  scheduleId,
  transaction = null
) => {
  const reservations = await db.Reservation.findAndCountAll({
    where: { scheduleId: scheduleId },
    transaction: transaction ? transaction : null,
  });
  return reservations ? reservations.count : 0;
};

const remainingSlotOfSchedule = async (
  scheduleId,
  coachId,
  transaction = null
) => {
  const numberOfPassenger = await countNumberOfPassengerByScheduleId(
    scheduleId,
    transaction
  );
  const coach = await db.Coach.findByPk(coachId, {
    transaction: transaction ? transaction : null,
  });
  return coach
    ? coach.capacity - numberOfPassenger > 0
      ? coach.capacity - numberOfPassenger
      : 0
    : 0;
};

const finishedSchedule = async (rawData) => {
  try {
    const { scheduleId } = rawData.params;
    await db.sequelize.transaction(async (tx) => {
      console.log("Transaction started");
      try {
        const schedule = await db.Schedule.findByPk(scheduleId);
        if (!schedule) {
          throw new Error("Schedule not found");
        }
        await db.Schedule.update(
          { status: "1" },
          { where: { id: scheduleId }, transaction: tx }
        );
        await db.Staff.update(
          { status: true },
          { where: { id: schedule.driverId }, transaction: tx }
        );
        await db.Staff.update(
          { status: true },
          { where: { id: schedule.coachAssistantId }, transaction: tx }
        );
      } catch (error) {
        console.error("Error in transaction:", error);
        throw new Error("Error in transaction: " + error.message);
      }
      console.log("Transaction commit");
    });
    return apiReturns.success(200, "Schedule Finished Successfully");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllSchedules,
  createNewSchedule,
  deleteSchedule,
  updateSchedule,
  countNumberOfPassengerByScheduleId,
  remainingSlotOfSchedule,
  finishedSchedule,
};
