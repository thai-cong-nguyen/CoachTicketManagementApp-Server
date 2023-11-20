require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { deleteScheduleById } = require("./schedule.service");

const getAllRoutes = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    const routes = await db.Route.findAndCountAll({
      where: query,
      attributes: { exclude: ["password"] },
      ...queries,
    });
    return apiReturns.success(200, "Get Successfully", routes);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const createNewRoute = async (rawData) => {
  try {
    const { places, ...data } = rawData.body;
    const route = await db.Route.create(data);
    await Promise.all(
      places.map(async (place) => {
        await db.Places.create({
          routeId: route.id,
          placeName: place.startPlace,
          isPickUpPlace: "1",
          placeLat: place.placeLat ? place.placeLat : null,
          placeLng: place.placeLng ? place.placeLng : null,
        });
        await db.Places.create({
          routeId: route.id,
          placeName: place.endPlace,
          isPickUpPlace: "0",
          placeLat: place.placeLat ? place.placeLat : null,
          placeLng: place.placeLng ? place.placeLng : null,
        });
      })
    );
    return apiReturns.success(200, "Create a new route successfully", route);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const updateRoute = async (rawData) => {
  try {
    const { routeId } = rawData.params;
    const { ...updateData } = rawData.body;
    const isUpdated = await db.Route.update(updateData, {
      where: { id: routeId },
    });
    if (!isUpdated) {
      return apiReturns.error(400, "Route update failed");
    }
    const updatedRoute = await db.Route.findOne({ where: { id: routeId } });
    return apiReturns.success(200, "Update Route Successful", updatedRoute);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const deleteRouteById = async (id) => {
  await deleteScheduleById(i);
  const schedules = await db.Schedule.findAndCountAll();
  await db.Route.destroy({ where: { id: id } });
};

const deleteRoute = async (rawData) => {
  try {
    const { routeId } = rawData.params;
    await deleteRouteById(routeId);
    return apiReturns.success(200, "Delete Route Successful");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllRoutes,
  createNewRoute,
  updateRoute,
  deleteRoute,
  deleteRouteById,
};
