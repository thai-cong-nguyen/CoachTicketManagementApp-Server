require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { createJWT } = require("../Services/jwt.service");

const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;
const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN;
const JWT_EXPIRES_IN_ACCESS_TOKEN = process.env.JWT_EXPIRES_IN_ACCESS_TOKEN;
const JWT_EXPIRES_IN_REFRESH_TOKEN = process.env.JWT_EXPIRES_IN_REFRESH_TOKEN;
const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { hashPassword };
