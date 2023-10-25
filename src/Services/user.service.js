require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
// const salt = bcrypt.genSaltSync(10);

// const defaultAvatar =
//   "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg";

// const hashPassword = (password) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const hashPassword = await bcrypt.hashSync(password, salt);
//       resolve(hashPassword);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// const checkEmailExisted = async (email) => {
//   const passenger = await db.Passenger.findOne({
//     where: {
//       email: email,
//     },
//   });
//   const staff = await db.Staff.findOne({
//     where: {
//       email: email,
//     },
//   });
//   return passenger || staff ? true : false;
// };

// const checkPhoneNumberExisted = async (phoneNumber) => {
//   const passenger = await db.Passenger.findOne({
//     where: {
//       phoneNumber: phoneNumber,
//     },
//   });
//   const staff = await db.Staff.findOne({
//     where: {
//       phoneNumber: phoneNumber,
//     },
//   });
//   return passenger || staff ? true : false;
// };

// const registerNewUserAccount = async (rawData) => {
//   try {
//     const data = rawData.body;
//     const hashPasswordFromBcrypt = await hashPassword(data.password);
//     const checkUser = await db.UserAccount.findOne({
//       where: { userName: data.userName },
//     });
//     if (checkUser) {
//       return apiReturns.validation("User is already registered");
//     }
//     const email = data.email ? data.email : null;
//     const phoneNumber = data.phoneNumber ? data.phoneNumber : null;
//     const positionId = data.positionId ? data.positionId : "1";
//     if (email && (await checkEmailExisted(email))) {
//       console.log(email, await checkEmailExisted(email));
//       return apiReturns.validation("Email or Phone Number is already existed");
//     } else if (phoneNumber && (await checkPhoneNumberExisted(phoneNumber))) {
//       return apiReturns.validation("Email or Phone Number is already existed");
//     }
//     try {
//       await db.sequelize.transaction(async (t) => {
//         const roleId = data.roleId ? data.roleId : "1";
//         const userAccount = await db.UserAccount.create(
//           {
//             userName: data.userName,
//             password: hashPasswordFromBcrypt,
//             avatar: data.avatar ? data.avatar : defaultAvatar,
//             roleId: roleId,
//             memberShipId: data.memberShipId ? data.memberShipId : "1",
//             rewardPoint: data.rewardPoint ? data.memberShipId : 0,
//           },
//           { transaction: t }
//         );
//         if (!roleId || roleId == "1") {
//           const passenger = await db.Passenger.create(
//             {
//               fullName: data.userName,
//               email: email,
//               address: data.address ? data.address : null,
//               phoneNumber: phoneNumber,
//               userId: userAccount.id,
//               gender: data.gender ? data.gender : null,
//             },
//             { transaction: t }
//           );
//         } else if (roleId == "2") {
//           const staff = await db.Staff.create(
//             {
//               fullName: data.userName,
//               email: email,
//               address: data.address ? data.address : null,
//               phoneNumber: phoneNumber,
//               positionId: positionId,
//               userId: userAccount.id,
//               gender: data.gender ? data.gender : null,
//             },
//             { transaction: t }
//           );
//         }
//       });
//     } catch (error) {
//       return apiReturns.error(500, error.message);
//     }

//     return apiReturns.success(200, "Register Successfully");
//   } catch (error) {
//     console.error(error.message);
//     return apiReturns.validation("Some thing went wrong");
//   }
// };

// const checkPassword = async (inputPassword, hashPassword) => {
//   return await bcrypt.compareSync(inputPassword, hashPassword);
// };

// const loginUserAccount = async (rawData) => {
//   try {
//     const data = rawData.body;
//     let username = null;
//     let password = null;
//     let roleId = null;
//     if (data.userName) {
//       // Check login with username
//       const user = await db.UserAccount.findOne({
//         where: { userName: data.userName },
//       });
//       if (!user) {
//         return apiReturns.validation("User account does not exist");
//       }
//       username = user.userName;
//       password = user.password;
//       roleId = user.roleId;
//       console.log("User: ", password);
//     } else {
//       // Check login with email & phoneNumber
//       const phoneNumber = data.phoneNumber ? data.phoneNumber : null;
//       const email = data.email ? data.email : null;
//       if (
//         !(
//           (await checkEmailExisted(email)) ||
//           (await checkPhoneNumberExisted(phoneNumber))
//         )
//       ) {
//         return apiReturns.validation(
//           "Email or Phone Number is not already existed"
//         );
//       }
//       const queryJoin = email
//         ? `SELECT * FROM PASSENGERS
//         LEFT JOIN USERACCOUNTS ON PASSENGERS.userId=USERACCOUNTS.id
//         WHERE PASSENGERS.email="${email}"`
//         : `SELECT * FROM PASSENGERS
//         LEFT JOIN USERACCOUNTS ON PASSENGERS.userId=USERACCOUNTS.id
//         WHERE PASSENGERS.phoneNumber="${phoneNumber}"`;
//       const passenger = await db.sequelize.query(queryJoin);
//       username = passenger[0][0].userName;
//       password = passenger[0][0].password;
//       roleId = passenger[0][0].roleId;
//     }
//     const plainTextPassword = data.password;
//     const isPassword = await checkPassword(plainTextPassword, password);
//     if (!isPassword) {
//       return apiReturns.validation("Password is not correct");
//     }
//     const roleUser = await getRolesUser(roleId);
//     const payload = {
//       username: username,
//       role: roleUser.dataValues,
//       expiresIn: JWT_EXPIRES_IN,
//     };
//     return apiReturns.success(200, "Login Successfully", {
//       access_token: await createJWT(payload),
//     });
//   } catch (error) {
//     console.log(error.message);
//     return apiReturns.error(400, error.message);
//   }
// };

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
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
      ...queries,
    });
    return apiReturns.success(200, "Get All User Accounts Successfully", users);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getCurrentUserAccount = async (rawData) => {
  try {
    const { id } = rawData.user;
    const user = await db.UserAccount.findOne({
      where: { id: id },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });
    return user
      ? apiReturns.success(200, "Get Current User Account Successfully", user)
      : apiReturns.validation("Can not get current user account");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
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
