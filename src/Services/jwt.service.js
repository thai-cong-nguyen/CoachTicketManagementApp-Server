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

const getPositionsStaff = async (positionId) => {
  const positionOfStaff = await db.Position.findOne({
    where: {
      id: positionId,
    },
    attributes: ["id", "positionName"],
  });
  return positionOfStaff ? positionOfStaff : null;
};

module.exports = { createJWT, getRolesUser, getPositionsStaff };
