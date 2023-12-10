require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const shuttleRouteForShuttle = async (shuttles) => {
  if (!shuttles) return [];
  await Promise.all(
    shuttles.rows.map(async (shuttle) => {
      const shuttleRoute = await db.ShuttleRoutes.findAll({
        where: { shuttleId: shuttle.id },
      });
      shuttle.ShuttleRouteData = shuttleRoute;
    })
  );
  return shuttles;
};

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
      ],
    });
    const res = await shuttleRouteForShuttle(shuttles);
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const deleteShuttle = async (rawData) => {
  try {
    const shuttleId = rawData.params.shuttleId;
    const shuttle = await db.Shuttle.findByPk(shuttleId);
    if (!shuttle) {
      throw new Error("Shuttle is not available");
    }
    await db.Shuttle.destroy({ where: { id: shuttleId } });
    return apiReturns.success(200, "Delete Successfully");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  shuttleRouteForShuttle,
  getAllShuttle,
  createNewShuttle,
  updateShuttle,
  deleteShuttle,
};
