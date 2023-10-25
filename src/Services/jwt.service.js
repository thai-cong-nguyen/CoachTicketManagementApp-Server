const { modes } = require("tar");
const db = require("../Models/index");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const createJWT = (payload) => {
  let token = null;
  try {
    token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    console.error(error);
  }
  return token;
};

const getRolesUser = async (roleId) => {
  const roleOfUser = await db.Role.findOne({
    where: {
      id: roleId,
    },
    attributes: ["id", "roleName"],
  });
  return roleOfUser ? roleOfUser : null;
};

module.exports = { createJWT, getRolesUser };
