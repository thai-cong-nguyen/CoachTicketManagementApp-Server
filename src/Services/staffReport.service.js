require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getAllStaffReports = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    const staffReports = await db.StaffReport.findAndCountAll({
      where: query,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      ...queries,
    });
    return apiReturns.success(200, "Get Successfully", staffReports);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

const createNewStaffReport = async (rawData) => {
  try {
    const data = rawData.body;
    const staffReport = await db.StaffReport.create(data);
    return apiReturns.success(200, "Create Successfully", staffReport);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

const deleteStaffReport = async (rawData) => {
  try {
    const id = rawData.params.id;
    const staffReport = await db.StaffReport.findOne({ where: { id: id } });
    if (!staffReport) {
      return apiReturns.error(404, "Report does not exist");
    }
    await db.StaffReport.destroy({ where: { id: id } });
    return apiReturns.success(200, "Delete Successfully");
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllStaffReports,
  createNewStaffReport,
  deleteStaffReport,
};
