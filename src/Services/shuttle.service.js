require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { deleteShuttleRouteById } = require("./shuttleRoute.service");

const getAllShuttle = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    const shuttles = await db.Shuttle.findAndCountAll({
      where: query,
      ...queries,
      include: [
        {
          model: db.Coach,
          as: "CoachData",
        },
        {
          model: db.Schedule,
          as: "ScheduleData",
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
          as: "DeparturePlaceData",
        },
        {
          model: db.Places,
          as: "ArrivalPlaceData",
        },
      ],
    });
    return apiReturns.success(200, "Get Successfully", shuttles);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const createNewShuttle = async (rawData) => {
  try {
    const data = rawData.body;
    const shuttle = await db.Shuttle.create(data);
    return apiReturns.success(200, "Create Successfully", shuttle);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const updateShuttle = async (rawData) => {
  try {
    const id = rawData.params.id;
    const data = rawData.body;
    const shuttle = await db.Shuttle.update(data, { where: { id: id } });
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const deleteShuttleById = async (id) => {
  const { count, rows } = await db.ShuttleRoute.findAndCountAll({
    where: { shuttleId: id },
  });
  if (count > 0) {
    await Promise.all(
      rows.map(async ({ id }) => {
        await deleteShuttleRouteById(id);
      })
    );
  }
  await db.Shuttle.destroy({ where: { id } });
};

const deleteShuttle = async (rawData) => {
  try {
    const id = rawData.params.id;
    await deleteShuttleById(id);
    return apiReturns.success(200, "Delete Successfully");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllShuttle,
  createNewShuttle,
  updateShuttle,
  deleteShuttleById,
  deleteShuttle,
};
