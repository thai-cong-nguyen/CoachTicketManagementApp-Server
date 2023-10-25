require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const createNewCoach = async (rawData) => {
  try {
    const data = rawData.body;
    await db.Coach.create(data);
    return apiReturns.success(200, "Create new Coach Successful");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getAllCoaches = async ({ page, limit, order, ...query }) => {
  try {
    // Order And Queries
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = [order];
    const coaches = await db.Coach.findAndCountAll({
      where: query,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      ...queries,
    });
    return apiReturns.success(200, "Get Coaches Successfully", coaches);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = { createNewCoach, getAllCoaches };
