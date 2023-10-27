const { modes } = require("tar");
const db = require("../Models/index");
const jwt = require("jsonwebtoken");

const createJWT = (payload, secret, expiresIn) => {
  let token = null;
  try {
    token = jwt.sign(payload, secret, { expiresIn: expiresIn });
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
