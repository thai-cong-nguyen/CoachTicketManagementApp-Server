require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getAllStaffs = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    const staff = await db.Staff.findAndCountAll({
      where: queries,
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
      ...queries,
    });
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const updateStaff = async (rawData) => {
  try {
    const data = rawData.body;
    const { id } = rawData.params;
    const staff = await db.Staff.update({ data }, { where: { id: id } });
    if (staff) {
      return apiReturns.success(200, "Update Staff Successfully", staff);
    }
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const deleteStaff = async (rawData) => {
  try {
    const { id } = rawData.params;
    await db.Staff.destroy({ where: { id: id } });
    return apiReturns.success(200, "Delete Staff Successfully");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const createNewStaff = async (rawData) => {
  try {
    const data = rawData.body;
    const staff = await db.Staff.create(data);
    return apiReturns.success(200, "Create Staff Successfully", staff);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = { getAllStaffs, createNewStaff, updateStaff, deleteStaff };
