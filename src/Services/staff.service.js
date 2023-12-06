require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { hashPassword } = require("../Services/auth.service");

const getAllStaffs = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const fLimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * fLimit;
    queries.limit = fLimit;
    if (order) queries.order = order;
    const staffs = await db.UserAccount.findAndCountAll({
      where: {
        ...query,
        roleId: "2",
      },
      attributes: { exclude: ["password"] },
      includes: [{ model: db.Staff, as: "StaffData" }],
      ...queries,
    });
    return apiReturns.success(200, "Get All Staffs Successfully", staffs);
  } catch (error) {
    console.error(error);
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
    const { userName, password, fullName, email, phoneNumber } = rawData.body;
    const isStaffExisted = await db.Staff.findOne({
      where: {
        [Op.or]: { userName: userName, email: email, phoneNumber: phoneNumber },
      },
    });
    if (isStaffExisted) {
      throw new Error(`Staff already exists`);
    }
    const staff = await db.Staff.create({
      userName,
      password: await hashPassword(password),
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
    });
    return apiReturns.success(200, "Create Staff Successfully", staff);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getWorkOfStaff = async (rawData) => {};

module.exports = { getAllStaffs, createNewStaff, updateStaff, deleteStaff };
