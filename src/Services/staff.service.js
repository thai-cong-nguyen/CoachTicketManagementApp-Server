require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { hashPassword } = require("../Services/auth.service");
const { getAllTrips } = require("../Services/trip.service");
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
const getAllStaffs = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const fLimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * fLimit;
    queries.limit = fLimit;
    if (order) queries.order = order;
    const staffs = await db.Staff.findAndCountAll({
      where: {
        ...query,
      },
      ...queries,
      include: [
        {
          model: db.UserAccount,
          as: "UserAccountData",
          where: {
            roleId: "2",
          },
          attributes: { exclude: ["password"] },
        },
      ],
    });
    return apiReturns.success(200, "Get All Staffs Successfully", staffs);
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const deleteStaff = async (rawData) => {
  try {
    const { staffId } = rawData.params;
    await db.Staff.destroy({ where: { id: staffId } });
    return apiReturns.success(200, "Delete Staff Successfully");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const createNewStaff = async (rawData) => {
  try {
    const {
      userName,
      password,
      fullName,
      email,
      phoneNumber,
      positionId,
      gender,
    } = rawData.body;
    const file = rawData.file;
    if (!userName || !password || !fullName || !phoneNumber) {
      throw new Error("Information is not enough for creating");
    }
    const isUserAccountExisted = await db.UserAccount.findOne({
      where: { userName: userName },
    });
    if (isUserAccountExisted) {
      throw new Error("User name is existed");
    }
    const isStaffExisted = await db.Staff.findOne({
      where: {
        [Op.or]: { email: email, phoneNumber: phoneNumber },
      },
    });
    if (isStaffExisted) {
      throw new Error(`Staff already exists`);
    }
    let info = {
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      positionId: positionId,
      gender: gender,
    };
    let account = {
      userName: userName,
      password: await hashPassword(password),
    };
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
      account.avatar = downloadURL;
    }
    await db.Sequelize.Transaction(async (tx) => {
      const userAccount = await db.UserAccount.create(
        {
          ...account,
          roleId: "2",
        },
        { transaction: tx }
      );
      if (!userAccount) {
        throw new Error("Can not create user account");
      }
      const staff = await db.Staff.create(info, { transaction: tx });
    });
    return apiReturns.success(200, "Create Staff Successfully");
  } catch (error) {
    console.error(error);
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
  deleteStaff,
  getWorkOfStaff,
};
