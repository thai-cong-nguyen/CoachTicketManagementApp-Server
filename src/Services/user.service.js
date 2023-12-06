require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { renameKeyRedis } = require("./redis.service");
const { hashPassword, checkPassword } = require("../Services/auth.service");
const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../Configs/firebase.config");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

initializeApp(firebaseConfig);

const storage = getStorage();

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
    const userAccounts = await Promise.all(
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
        }
        return null;
      }, [])
    );
    const results = userAccounts.filter((user) => user !== null);
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
    const { fullName, email, phoneNumber, userName, address, positionId } =
      rawData.body;
    const file = await rawData.file;
    const userId = rawData.params.userId;
    let updatedInfo = {};
    let updatedAccount = {};
    if (fullName) updatedInfo.fullName = fullName;
    if (email) updatedInfo.email = email;
    if (phoneNumber) updatedInfo.phoneNumber = phoneNumber;
    if (address) updatedInfo.address = address;
    if (userName) {
      const user = await db.UserAccount.findOne({
        where: { userName: userName },
      });
      if (user) {
        return apiReturns.validation("User name is already in use");
      }
      updatedAccount.userName = userName;
    }
    // update avatar user account
    if (file) {
      const dateTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/ho_chi_minh",
      });
      const storageRef = ref(
        storage,
        `images/${file.originalname + "       " + dateTime}`
      );
      const metaData = {
        contentType: file.mimetype,
        cacheControl: "public, max-age=31536000",
      };
      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metaData
      );
      const downloadURL = await getDownloadURL(snapshot.ref);
      updatedAccount.avatar = downloadURL;
    }
    await db.sequelize.transaction(async (t) => {
      await db.UserAccount.update(
        updatedAccount,
        { where: { id: userId } },
        { transaction: t }
      );
      if (rawData.user.role.id === "1") {
        await db.Passenger.update(
          updatedInfo,
          { where: { userId: userId } },
          { transaction: t }
        );
      } else if (rawData.user.role.id === "2") {
        if (positionId) updatedInfo.positionId = positionId;
        await db.Staff.update(
          updatedInfo,
          { where: { userId: userId } },
          { transaction: t }
        );
      }
      if (userName)
        renameKeyRedis({ oldKey: rawData.user.userName, newKey: userName });
    });

    return apiReturns.success(200, "Updated User Account Successfully");
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(500, error.message);
  }
};

const changePasswordCurrentUserAccount = async (rawData) => {
  try {
    const { oldPassword, newPassword } = rawData.body;
    const userId = rawData.user.userId;
    const user = await db.UserAccount.findOne({
      where: { id: userId },
      attributes: { include: ["id", "password"] },
    });
    if (!user) {
      throw new Error("Can not find user");
    }
    if (oldPassword === newPassword) {
      throw new Error("New password could not be same with old password");
    }
    const isCorrectPassword = await checkPassword(oldPassword, user.password);
    if (!isCorrectPassword) {
      throw new Error("Old password is incorrect");
    }
    await db.UserAccount.update(
      { password: await hashPassword(newPassword) },
      { where: { id: userId } }
    );
    return apiReturns.success(200, "Changed Password Successfully");
  } catch (error) {
    console.log(error);
    return apiReturns.error(400, error.message);
  }
};

const updateRewardPoint = async (rawData) => {
  try {
    const changedPoint = rawData.body.point;
    const userId = rawData.user.userId;
    const userAccount = await db.UserAccount.findByPk(userId);
    // Different current user and not be admin user
    if (!userAccount) {
      throw new Error("Can not find user account");
    }
    await db.sequelize.transaction(async (t) => {
      if (userAccount.rewardPoint + changedPoint >= 0) {
        await db.UserAccount.update(
          { rewardPoint: userAccount.rewardPoint + changedPoint },
          { where: { id: userId }, transaction: t }
        );
      } else {
        throw new Error(apiReturns.error(400, "Not have enough reward points"));
      }
    });
    return apiReturns.success(200, "Change Reward Point Successfully");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllUserAccounts,
  getCurrentUserAccount,
  deleteUserAccountById,
  updateUserAccountById,
  changePasswordCurrentUserAccount,
  updateRewardPoint,
};
