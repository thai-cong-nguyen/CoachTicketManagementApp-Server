require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { hashPassword } = require("../Services/auth.service");
const { getAllTrips } = require("../Services/trip.service");

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
    const { userName, password, fullName, email, phoneNumber, positionId } =
      rawData.body;
    const isStaffExisted = await db.Staff.findOne({
      where: {
        [Op.or]: { userName: userName, email: email, phoneNumber: phoneNumber },
      },
    });
    if (isStaffExisted) {
      throw new Error(`Staff already exists`);
    }
    await db.Sequelize.Transaction(async (tx) => {
      const userAccount = await db.UserAccount.create({
        userName,
        password: await hashPassword(password),
        roleId: "2",
      });
      if (!userAccount) {
        throw new Error("Can not create user account");
      }
      const staff = await db.Staff.create({
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        userId: userAccount.id,
        positionId,
      });
    });
    return apiReturns.success(200, "Create Staff Successfully");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getWorkOfStaff = async (rawData) => {
  try {
    const { userId } = rawData.user;
    const staff = await db.Staff.findOne({ where: { userId: userId } });
    if (!staff) {
      throw new Error("No staff found");
    }
    const query = {
      [Op.or]: {
        driverId: staff.id,
        coachAssistantId: staff.id,
      },
    };
    const currentTrips = await getAllTrips({ ...query, status: "0" });
    const historyTrips = await getAllTrips({ ...query, status: "1" });
    console.log(currentTrips);
    const result = {
      currentTrips: currentTrips.data.rows,
      historyTrips: historyTrips.data.rows,
    };
    return apiReturns.success(200, "Get Work of Staff Successfully", result);
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllStaffs,
  createNewStaff,
  updateStaff,
  deleteStaff,
  getWorkOfStaff,
};
