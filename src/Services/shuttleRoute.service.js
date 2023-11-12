require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { deleteShuttlePassengerById } = require("./shuttlePassenger.service");

const getAllShuttleRoutes = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    const shuttleRoutes = await db.ShuttleRoute.findAndCountAll({
      where: query,
      ...queries,
      include: [
        {
          model: db.Shuttle,
          as: "ShuttleData",
        },
        {
          model: db.Places,
          as: "DeparturePlaceData",
        },
      ],
    });
    return apiReturns.success(200, "Get Successfully", shuttleRoutes);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const updateShuttleRoute = async (rawData) => {
  try {
    const id = rawData.params.id;
    const data = rawData.body;
    const shuttleRoute = await db.ShuttleRoute.update(data, {
      where: { id: id },
    });
    return apiReturns.success(200, "Update Successfully", shuttleRoute);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const deleteShuttleRouteById = async (id) => {
  const { count, rows } = await db.ShuttlePassenger.findOne({
    where: { shuttleRoute: id },
  });
  if (count > 0) {
    await Promise.all(
      rows.map(async ({ id }) => {
        await deleteShuttlePassengerById(id);
      })
    );
  }
  await db.ShuttleRoute.destroy({ where: { id } });
};

const deleteShuttleRoute = async (rawData) => {
  try {
    const id = rawData.params.id;
    await deleteShuttleRouteById(id);
    return apiReturns.success(200, "Delete Successfully");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllShuttleRoutes,
  updateShuttleRoute,
  deleteShuttleRoute,
  deleteShuttleRouteById,
};
