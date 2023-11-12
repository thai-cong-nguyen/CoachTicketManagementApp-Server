require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { getRolesUser } = require("../Services/jwt.service");
const { createJWT } = require("../Services/jwt.service");
const { setRedis, getRedis, delRedis } = require("../Services/redis.service");
const jwt = require("jsonwebtoken");

const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;
const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN;
const JWT_EXPIRES_IN_ACCESS_TOKEN = process.env.JWT_EXPIRES_IN_ACCESS_TOKEN;
const JWT_EXPIRES_IN_REFRESH_TOKEN = process.env.JWT_EXPIRES_IN_REFRESH_TOKEN;
const salt = bcrypt.genSaltSync(10);

const defaultAvatar =
  "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg";

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
      console.log(email, await checkEmailExisted(email));
      return apiReturns.validation("Email or Phone Number is already existed");
    } else if (phoneNumber && (await checkPhoneNumberExisted(phoneNumber))) {
      return apiReturns.validation("Email or Phone Number is already existed");
    }
    try {
      await db.sequelize.transaction(async (t) => {
        const roleId = data.roleId ? data.roleId : "1";
        const userAccount = await db.UserAccount.create(
          {
            userName: data.userName,
            password: hashPasswordFromBcrypt,
            avatar: data.avatar ? data.avatar : defaultAvatar,
            roleId: roleId,
            memberShipId: data.memberShipId ? data.memberShipId : "1",
            rewardPoint: data.rewardPoint ? data.memberShipId : 0,
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
    } catch (error) {
      return apiReturns.error(500, error.message);
    }
    return apiReturns.success(200, "Register Successfully", {
      userId: userAccount.id ? userAccount.id : null,
    });
  } catch (error) {
    console.error(error.message);
    return apiReturns.validation("Some thing went wrong");
  }
};

const checkPassword = async (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword);
};

const loginUserAccount = async (rawData, res) => {
  try {
    const data = rawData.body;
    let userId = null;
    let username = null;
    let password = null;
    let roleId = null;
    if (data.userName) {
      // Check login with username
      const user = await db.UserAccount.findOne({
        where: { userName: data.userName },
      });
      if (!user) {
        return apiReturns.validation("User account does not exist");
      }
      userId = user.id;
      username = user.userName;
      password = user.password;
      roleId = user.roleId;
    } else if (data.email || data.phoneNumber) {
      // Check login with email & phoneNumber
      const phoneNumber = data.phoneNumber ? data.phoneNumber : null;
      const email = data.email ? data.email : null;
      const passenger = await (email
        ? await db.Passenger.findOne({
            where: { email: email },
            include: [
              {
                model: db.UserAccount,
                as: "UserAccountData",
              },
            ],
          })
        : await db.Passenger.findOne({
            where: { phoneNumber: phoneNumber },
            include: [
              {
                model: db.UserAccount,
                as: "UserAccountData",
              },
            ],
          }));
      if (passenger) {
        userId = await passenger.dataValues.UserAccountData.id;
        username = await passenger.dataValues.UserAccountData.userName;
        password = await passenger.dataValues.UserAccountData.password;
        roleId = await passenger.dataValues.UserAccountData.roleId;
      } else {
        return apiReturns.validation(
          "Email or Phone Number is not already existed"
        );
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
      userName: username,
      role: roleUser.dataValues,
    };
    const refreshToken = createJWT(
      payload,
      JWT_SECRET_REFRESH_TOKEN,
      JWT_EXPIRES_IN_REFRESH_TOKEN
    );
    const accessToken = createJWT(
      payload,
      JWT_SECRET_ACCESS_TOKEN,
      JWT_EXPIRES_IN_ACCESS_TOKEN
    );
    res.cookie("refreshToken", `Bearer ${refreshToken}`, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // Expires after 24 hours
      sameSite: "strict",
    });
    await setRedis({
      key: username,
      value: JSON.stringify(refreshToken),
    });
    return apiReturns.success(200, "Login Successfully", {
      ...payload,
      access_token: accessToken,
    });
  } catch (error) {
    console.log(error);
    return apiReturns.error(500, "Some thing went wrong");
  }
};

const requestRefreshToken = async (rawData, res) => {
  try {
    const { userName } = rawData.body;
    const refreshTokenInCookie = rawData.cookies.refreshToken.split(" ")[1];
    if (!refreshTokenInCookie)
      return apiReturns.error(401, "You're not authenticated");
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
        const payload = { userName: decoded.userName, role: decoded.role };
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
          accessToken: newAccessToken,
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
    await delRedis(rawData.body.userName);
    return apiReturns.success(200, "Logged Out!");
  } catch (error) {
    console.log(error);
    return apiReturns.error(500, "Some thing went wrong");
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
