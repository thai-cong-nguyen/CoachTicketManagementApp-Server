require("dotenv").config();
const jwt = require("jsonwebtoken");
const { notAuthError } = require("../Middlewares/handleErrors.middleware");
const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;

const verifyJWT = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return notAuthError("Require authorization", res);
  }
  jwt.verify(token, JWT_SECRET_ACCESS_TOKEN, (error, decoded) => {
    if (error) {
      return notAuthError("Access token maybe expired or invalid", res);
    }
    req.user = decoded;
    next();
  });
};

module.exports = { verifyJWT };
