require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getAllShuttleRoutes = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    const shuttleRoutes = await db.ShuttleRoutes.findAndCountAll({
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

const createNewShuttleRoute = async (rawData) => {
  try {
    const {
      shuttleId,
      departureTime,
      departurePlace,
      status,
      departurePlaceLat,
      departurePlaceLng,
    } = rawData.body;
    const shuttle = await db.Shuttle.findByPk(shuttleId);
    if (!shuttle) {
      throw new Error("Shuttle is not existed");
    }
    const place = await db.Places.findByPk(departurePlace);
    if (!place) {
      throw new Error("Departure Place is not existed");
    }
    await db.ShuttleRoutes.create({
      shuttleId,
      departureTime,
      status,
      departurePlace,
      departurePlaceLat,
      departurePlaceLng,
    });
    return apiReturns.success(200, "Created new Shuttle Route Successfully");
  } catch (error) {
    console.log(error);
    return apiReturns.error(400, error.message);
  }
};

const updateShuttleRoute = async (rawData) => {
  try {
    const id = rawData.params.id;
    const data = rawData.body;
    const shuttleRoute = await db.ShuttleRoutes.update(data, {
      where: { id: id },
    });
    return apiReturns.success(200, "Update Successfully", shuttleRoute);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const deleteShuttleRoute = async (rawData) => {
  try {
    const shuttleRouteId = rawData.params.shuttleRouteId;
    const shuttleRoute = await db.ShuttleRoutes.findByPk(shuttleRouteId);
    if (!shuttleRoute) {
      throw new Error("Shuttle Route is not existed");
    }
    await db.ShuttleRoutes.destroy({ where: { id: shuttleRouteId } });
    return apiReturns.success(200, "Delete Successfully");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllShuttleRoutes,
  createNewShuttleRoute,
  updateShuttleRoute,
  deleteShuttleRoute,
};
