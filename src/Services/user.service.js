require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { renameKeyRedis } = require("./redis.service");
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
    if (users.count <= 0)
      return apiReturns.error(401, "User Account not found");
    const results = await Promise.all(
      users.rows.map(async (user) => {
        if (user.roleId === "1") {
          return await db.Passenger.findOne({
            where: { userId: user.id },
            include: {
              model: db.UserAccount,
              as: "UserAccountData",
              attributes: { exclude: ["password"] },
            },
          });
        } else if (user.roleId === "2") {
          return await db.Staff.findOne({
            where: { userId: user.id },
            include: {
              model: db.UserAccount,
              as: "UserAccountData",
              attributes: { exclude: ["password"] },
            },
          });
        } else return user;
      })
    );
    return apiReturns.success(200, "Get Successfully", results);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(500, "Something went wrong");
  }
};

const getCurrentUserAccount = async (rawData) => {
  try {
    const userData = rawData.user;
    console.log(userData);
    let userAccount = null;
    if (userData.role.id === "1") {
      userAccount = await db.Passenger.findOne({
        where: {
          userId: userData.userId,
        },
        include: [
          {
            model: db.UserAccount,
            as: "UserAccountData",
            attributes: { exclude: ["password"] },
          },
        ],
      });
    } else if (userData.role.id === "2") {
      userAccount = await db.Staff.findOne({
        where: {
          userId: userData.userId,
        },
        include: [
          {
            model: db.UserAccount,
            as: "UserAccountData",
            attributes: { exclude: ["password"] },
          },
        ],
      });
    } else {
      userAccount = await db.UserAccount.findByPk(userData.userId);
    }
    return apiReturns.success(
      200,
      "Get Current UserAccount Successfully",
      userAccount
    );
  } catch (error) {
    console.error(error);
    return apiReturns.error(500, "Something went wrong");
  }
};

const deleteUserAccountById = async (rawData) => {
  try {
    await db.sequelize.transaction(async (t) => {
      const passengerId = await db.Passenger.findOne({
        where: { userId: rawData.params.userId },
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

const updateUserAccountById = async (rawData) => {
  try {
    const { fullName, email, phoneNumber, userName, avatar } = rawData.body;
    const userId = rawData.params.userId;
    // await db.sequelize.transaction(async (t) => {
    //   const checkNewUser = await db.UserAccount.findOne(
    //     {
    //       where: { userName: userName },
    //     },
    //     { transaction: t }
    //   );
    //   if (checkNewUser) {
    //     return apiReturns.validation("User name is already existed");
    //   }
    //   const oldUser = await db.UserAccount.findOne({
    //     where: { id: userId },
    //   });
    //   await db.UserAccount.update(
    //     {
    //       userName: userName ? userName : oldUser.userName,
    //       avatar: avatar ? avatar : oldUser.avatar,
    //     },
    //     {
    //       where: {
    //         id: userId,
    //       },
    //     },
    //     { transaction: t }
    //   );
    // });
    let updatedInfo = {};
    let updatedAccount = {};
    if (fullName) updatedInfo.fullName = fullName;
    if (email) updatedInfo.email = email;
    if (phoneNumber) updatedInfo.phoneNumber = phoneNumber;
    if (avatar) updatedAccount.avatar = avatar;
    if (userName) {
      const user = await db.UserAccount.findOne({
        where: { userName: userName },
      });
      if (user) {
        return apiReturns.validation("User name is already in use");
      }
      renameKeyRedis({ oldKey: rawData.user.userName, newKey: userName });
      updatedAccount.userName = userName;
    }
    await db.UserAccount.update(updatedAccount, { where: { id: userId } });
    if (rawData.user.role.id === "1") {
      await db.Passenger.update(updatedInfo, { where: { userId: userId } });
    } else if (rawData.user.role.id === "2") {
      await db.Staff.update(updatedInfo, { where: { userId: userId } });
    }
    return apiReturns.success(200, "Updated User Account Successfully");
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(500, error.message);
  }
};

const changePasswordCurrentUserAccount = async (rawData) => {
  try {
    const userId = rawData.user.userId;
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
  updateUserAccountById,
  changePasswordCurrentUserAccount,
};
