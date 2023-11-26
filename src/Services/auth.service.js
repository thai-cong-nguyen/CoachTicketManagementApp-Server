require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { getRolesUser, getPositionsStaff } = require("../Services/jwt.service");
const { createJWT } = require("../Services/jwt.service");
const { notAuthError } = require("../Middlewares/handleErrors.middleware");
const { setRedis, getRedis, delRedis } = require("../Services/redis.service");
const jwt = require("jsonwebtoken");

const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;
const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN;
const JWT_EXPIRES_IN_ACCESS_TOKEN = process.env.JWT_EXPIRES_IN_ACCESS_TOKEN;
const JWT_EXPIRES_IN_REFRESH_TOKEN = process.env.JWT_EXPIRES_IN_REFRESH_TOKEN;
const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

const checkEmailExisted = async (email) => {
  const passenger = await db.Passenger.findOne({
    where: {
      email: email,
    },
  });
  const staff = await db.Staff.findOne({
    where: {
      email: email,
    },
  });
  return passenger || staff ? true : false;
};

const checkPhoneNumberExisted = async (phoneNumber) => {
  const passenger = await db.Passenger.findOne({
    where: {
      phoneNumber: phoneNumber,
    },
  });
  const staff = await db.Staff.findOne({
    where: {
      phoneNumber: phoneNumber,
    },
  });
  return passenger || staff ? true : false;
};

const checkEmailOrPhoneNumberExisted = async (rawData) => {
  try {
    const data = rawData.body;
    const phoneNumber = data.phoneNumber ? data.phoneNumber : null;
    const email = data.email ? data.email : null;
    if (!phoneNumber && !email) {
      return apiReturns.error(404, "Email or Phone number is not Existed");
    }
    const passenger = email
      ? await db.Passenger.findOne({
          where: { email: email },
          include: [
            {
              model: db.UserAccount,
              as: "UserAccountData",
              attributes: { exclude: ["password"] },
            },
          ],
        })
      : await db.Passenger.findOne({
          where: { phoneNumber: phoneNumber },
          include: [
            {
              model: db.UserAccount,
              as: "UserAccountData",
              attributes: { exclude: ["password"] },
            },
          ],
        });
    return passenger
      ? apiReturns.success(200, "Email or Phone number is Existed")
      : apiReturns.error(404, "Email or Phone number is not Existed");
  } catch (error) {
    console.log(error);
    return apiReturns.error(500, "Some thing went wrong");
  }
};

const registerNewUserAccount = async (rawData) => {
  try {
    const data = rawData.body;
    const hashPasswordFromBcrypt = await hashPassword(data.password);
    const checkUser = await db.UserAccount.findOne({
      where: { userName: data.userName },
    });
    if (checkUser) {
      return apiReturns.validation("User is already registered");
    }
    const email = data.email ? data.email : null;
    const phoneNumber = data.phoneNumber ? data.phoneNumber : null;
    if (email && (await checkEmailExisted(email))) {
      return apiReturns.validation("Email or Phone Number is already existed");
    } else if (phoneNumber && (await checkPhoneNumberExisted(phoneNumber))) {
      return apiReturns.validation("Email or Phone Number is already existed");
    }
    let userAccount = null;
    await db.sequelize.transaction(async (t) => {
      const roleId = data.roleId ? data.roleId : "1";
      userAccount = await db.UserAccount.create(
        {
          userName: data.userName,
          password: hashPasswordFromBcrypt,
          avatar: data.avatar,
          roleId: roleId,
          memberShipId: data.memberShipId ? data.memberShipId : "1",
          rewardPoint: data.rewardPoint ? data.rewardPoint : 0,
        },
        { transaction: t }
      );
      if (!roleId || roleId == "1") {
        const passenger = await db.Passenger.create(
          {
            fullName: data.userName,
            email: email,
            address: data.address ? data.address : null,
            phoneNumber: phoneNumber,
            userId: userAccount.id,
            gender: data.gender ? data.gender : null,
          },
          { transaction: t }
        );
      } else if (roleId == "2") {
        const positionId = data.positionId ? data.positionId : "1";
        const staff = await db.Staff.create(
          {
            fullName: data.userName,
            email: email,
            address: data.address ? data.address : null,
            phoneNumber: phoneNumber,
            positionId: positionId,
            userId: userAccount.id,
            gender: data.gender ? data.gender : null,
          },
          { transaction: t }
        );
      }
    });
    return apiReturns.success(200, "Register Successfully", {
      userId: userAccount.id ? userAccount.id : null,
    });
  } catch (error) {
    console.error(error);
    return apiReturns.validation("Something went wrong");
  }
};

const checkPassword = async (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword);
};

const loginUserAccount = async (rawData, res) => {
  try {
    const data = rawData.body;
    let userId = null;
    let userName = null;
    let password = null;
    let roleId = null;
    let positionId = null;
    if (data.userName) {
      // Check login with userName
      const user = await db.UserAccount.findOne({
        where: { userName: data.userName },
      });
      if (!user) {
        return apiReturns.validation("User account does not exist");
      }
      userId = user.id;
      userName = user.userName;
      password = user.password;
      roleId = user.roleId;
      if (roleId === "2") {
        const info = await db.Staff.findOne({
          where: { userId: userId },
          include: [
            {
              model: db.Position,
              as: "PositionData",
            },
          ],
        });
        positionId = info.dataValues.positionId;
      }
    } else if (data.phoneNumber) {
      // Check login with email & phoneNumber
      const phoneNumber = data.phoneNumber ? data.phoneNumber : null;
      // const email = data.email ? data.email : null;
      // const passenger = await (email
      //   ? await db.Passenger.findOne({
      //       where: { email: email },
      //       include: [
      //         {
      //           model: db.UserAccount,
      //           as: "UserAccountData",
      //         },
      //       ],
      //     })
      //   : await db.Passenger.findOne({
      //       where: { phoneNumber: phoneNumber },
      //       include: [
      //         {
      //           model: db.UserAccount,
      //           as: "UserAccountData",
      //         },
      //       ],
      //     }));
      const info =
        (await db.Passenger.findOne({
          where: { phoneNumber: phoneNumber },
          include: [
            {
              model: db.UserAccount,
              as: "UserAccountData",
            },
          ],
        })) ||
        (await db.Staff.findOne({
          where: { phoneNumber: phoneNumber },
          include: [
            {
              model: db.UserAccount,
              as: "UserAccountData",
            },
            {
              model: db.Position,
              as: "PositionData",
            },
          ],
        }));
      if (info) {
        userId = await info.dataValues.UserAccountData.id;
        userName = await info.dataValues.UserAccountData.userName;
        password = await info.dataValues.UserAccountData.password;
        roleId = await info.dataValues.UserAccountData.roleId;
        if (roleId === "2")
          positionId = await info.dataValues.UserAccountData.positionId;
      } else {
        return apiReturns.validation("Phone Number is not already existed");
      }
    } else {
      return apiReturns.validation("Something went wrong");
    }
    const plainTextPassword = data.password;
    const isPassword = await checkPassword(plainTextPassword, password);
    if (!isPassword) {
      return apiReturns.validation("Password is not correct");
    }
    const roleUser = await getRolesUser(roleId);
    const payload = {
      userId: userId,
      userName: userName,
      role: roleUser.dataValues,
    };
    if (positionId) payload.position = await getPositionsStaff(positionId);
    const accessToken = createJWT(
      payload,
      JWT_SECRET_ACCESS_TOKEN,
      JWT_EXPIRES_IN_ACCESS_TOKEN
    );
    // const refreshTokenInRedis = await getRedis(user)
    const refreshToken = createJWT(
      payload,
      JWT_SECRET_REFRESH_TOKEN,
      JWT_EXPIRES_IN_REFRESH_TOKEN
    );
    res.cookie("refreshToken", `Bearer ${refreshToken}`, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // Expires after 24 hours
      sameSite: "strict",
    });
    await setRedis({
      key: userName,
      value: JSON.stringify(refreshToken),
    });
    return apiReturns.success(200, "Login Successfully", {
      ...payload,
      access_token: `Bearer ${accessToken}`,
    });
  } catch (error) {
    console.log(error);
    return apiReturns.error(500, "Some thing went wrong");
  }
};

const requestRefreshToken = async (rawData, res) => {
  try {
    const { userName } = rawData.body;
    const refreshToken = rawData.cookies.refreshToken;
    if (!refreshToken) return apiReturns.error(401, "You're not authenticated");
    const refreshTokenInCookie = refreshToken.split(" ")[1];
    const refreshTokenInRedis = await getRedis(userName);
    if (refreshTokenInRedis != refreshTokenInCookie) {
      return apiReturns.error(403, "Refresh Token is not valid");
    }
    let newAccessToken,
      newRefreshToken = null;
    return jwt.verify(
      refreshTokenInCookie,
      JWT_SECRET_REFRESH_TOKEN,
      async (error, decoded) => {
        if (error) {
          return notAuthError("Access token maybe expired or invalid", res);
        }
        const payload = {
          userId: decoded.userId,
          userName: decoded.userName,
          role: decoded.role,
          position: decoded.position,
        };
        newAccessToken = createJWT(
          payload,
          JWT_SECRET_ACCESS_TOKEN,
          JWT_EXPIRES_IN_ACCESS_TOKEN
        );
        newRefreshToken = createJWT(
          payload,
          JWT_SECRET_REFRESH_TOKEN,
          JWT_EXPIRES_IN_REFRESH_TOKEN
        );
        await setRedis({
          key: userName,
          value: JSON.stringify(newRefreshToken),
        });
        await res.cookie("refreshToken", `Bearer ${newRefreshToken}`, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // Expires after 24 hours
          sameSite: "strict",
        });
        return apiReturns.success(200, "Refresh Token Successfully", {
          accessToken: `Bearer ${newAccessToken}`,
        });
      }
    );
  } catch (error) {
    console.log(error);
    return apiReturns.error(500, "Some thing went wrong");
  }
};

const logoutAccount = async (rawData, res) => {
  try {
    res.clearCookie("refreshToken");
    // const userName = rawData.
    await delRedis(rawData.body.userName);
    return apiReturns.success(200, "Logged Out!");
  } catch (error) {
    console.log(error);
    return apiReturns.error(500, "Something went wrong");
  }
};

const resetPassword = async (rawData, res) => {
  try {
    const data = rawData.body;
    const phoneNumber = data.phoneNumber ? data.phoneNumber : null;
    const email = data.email ? data.email : null;
    const passenger = await (email
      ? await db.Passenger.findOne({
          where: { email: email },
          include: [
            {
              model: db.UserAccount,
              as: "UserAccountData",
              attributes: { exclude: ["password"] },
            },
          ],
        })
      : await db.Passenger.findOne({
          where: { phoneNumber: phoneNumber },
          include: [
            {
              model: db.UserAccount,
              as: "UserAccountData",
              attributes: { exclude: ["password"] },
            },
          ],
        }));
    if (!passenger) {
      return apiReturns.error(404, "Email or Phone Number not found");
    }
    await db.UserAccount.update(
      {
        password: await hashPassword(data.newPassword),
      },
      { where: { id: passenger.UserAccountData.id } }
    );
    return apiReturns.success(200, "Reset password successfully");
  } catch (error) {
    console.log(error);
    return apiReturns.error(400, "Something went wrong");
  }
};

module.exports = {
  hashPassword,
  registerNewUserAccount,
  checkEmailOrPhoneNumberExisted,
  loginUserAccount,
  requestRefreshToken,
  logoutAccount,
  resetPassword,
};
