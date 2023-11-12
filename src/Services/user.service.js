require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { hashPassword } = require("../Services/auth.service");

const getAllUserAccounts = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    const users = await db.UserAccount.findAndCountAll({
      where: query,
      attributes: { exclude: ["password"] },
      ...queries,
    });
    if (users.rows <= 0) return apiReturns.error(401, "User Account not found");
    return apiReturns.success(200, "Get Successfully", users);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(500, "Something went wrong");
  }
};

const getCurrentUserAccount = async (rawData) => {
  try {
    const { id } = rawData.user;
    const user = await db.UserAccount.findOne({
      where: { id: id },
      attributes: { exclude: ["password"] },
    });
    return user
      ? apiReturns.success(200, "Get Current User Account Successfully", user)
      : apiReturns.validation("Can not get current user account");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(500, "Something went wrong");
  }
};

const deleteUserAccountById = async (rawData) => {
  try {
    await db.sequelize.transaction(async (t) => {
      const passengerId = await db.Passenger.findOne({
        where: { userId: rawData.params.id },
        attributes: { includes: ["id"] },
      });
      await db.Passenger.destroy(
        { where: { id: passengerId.id } },
        { transaction: t }
      );
      await db.UserAccount.destroy(
        { where: { id: rawData.params.id } },
        { transaction: t }
      );
    });
    return apiReturns.success(200, "Delete User Account Successfully");
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(500, error.message);
  }
};

const updateUserAccount = async (rawData) => {
  try {
    const { userName, avatar } = rawData.body;
    const userId = rawData.params.id;
    await db.sequelize.transaction(async (t) => {
      const checkNewUser = await db.UserAccount.findOne(
        {
          where: { userName: userName },
        },
        { transaction: t }
      );
      if (checkNewUser) {
        return apiReturns.validation("User name is already existed");
      }
      const oldUser = await db.UserAccount.findOne({
        where: { id: userId },
      });
      await db.UserAccount.update(
        {
          userName: userName ? userName : oldUser.userName,
          avatar: avatar ? avatar : oldUser.avatar,
        },
        {
          where: {
            id: userId,
          },
        },
        { transaction: t }
      );
    });
    return apiReturns.success(200, "Updated User Account Successfully");
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(500, error.message);
  }
};

const changePasswordCurrentUserAccount = async (rawData) => {
  try {
    const userId = rawData.user.id;
    const user = await db.UserAccount.findOne({
      where: { id: userId },
      attributes: { include: ["id", "password"] },
    });
    if (!user) {
      return apiReturns.validation("Some thing went wrong");
    }
    const password = rawData.body.password;
    await db.UserAccount.update(
      { password: await hashPassword(password) },
      { where: { id: user.id } }
    );
    return apiReturns.success(200, "Change Password Successfully");
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(500, error.message);
  }
};

module.exports = {
  getAllUserAccounts,
  getCurrentUserAccount,
  deleteUserAccountById,
  updateUserAccount,
  changePasswordCurrentUserAccount,
};
