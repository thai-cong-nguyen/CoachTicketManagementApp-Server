require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getAllFromPlaces = async ({ page, limit, order, routeId, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const fLimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * fLimit;
    queries.limit = fLimit;
    if (order && order.trim() !== "") {
      const arrayOrder = order.split(",");
      queries.order = [[arrayOrder[0], arrayOrder[1]]]; // 'ASC' for ascending, 'DESC' for descending
    } else {
      queries.order = [["id", "ASC"]];
    }
    if (routeId) query.routeId = routeId;
    query.isPickUpPlace = "1";
    const places = await db.Places.findAndCountAll({
      where: query,
      ...queries,
      include: [{ model: db.Route, as: "RouteData" }],
    });
    return apiReturns.success(200, "Get Successfully", places);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getAllToPlaces = async ({ page, limit, order, routeId, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const fLimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * fLimit;
    queries.limit = fLimit;
    if (order && order.trim() !== "") {
      const arrayOrder = order.split(",");
      queries.order = [[arrayOrder[0], arrayOrder[1]]]; // 'ASC' for ascending, 'DESC' for descending
    } else {
      queries.order = [["id", "ASC"]];
    }
    if (routeId) query.routeId = routeId;
    query.isPickUpPlace = "0";
    const places = await db.Places.findAndCountAll({
      where: query,
      ...queries,
      include: [{ model: db.Route, as: "RouteData" }],
    });
    return apiReturns.success(200, "Get Successfully", places);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getPlaceWithQuery = async ({ page, limit, order, routeId, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const fLimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * fLimit;
    queries.limit = fLimit;
    if (order && order.trim() !== "") {
      const arrayOrder = order.split(",");
      queries.order = [[arrayOrder[0], arrayOrder[1]]]; // 'ASC' for ascending, 'DESC' for descending
    } else {
      queries.order = [["id", "ASC"]];
    }
    if (routeId) query.routeId = routeId;
    const res = await db.Places.findAndCountAll({
      where: query,
      ...queries,
      include: [{ model: db.Route, as: "RouteData" }],
    });
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = { getAllFromPlaces, getAllToPlaces, getPlaceWithQuery };
