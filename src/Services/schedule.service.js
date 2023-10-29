require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getAllSchedules = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    const schedules = await db.Schedule.findAndCountAll({
      where: query,
      ...queries,
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

const deleteSchedule = async (rawData) => {
  try {
    const { id } = rawData.params;
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
  deleteSchedule,
  updateSchedule,
};
