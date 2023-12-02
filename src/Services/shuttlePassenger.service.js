require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

module.exports = {
  deleteShuttlePassengerById: async (id) => {
    await db.ShuttlePassenger.destroy({ where: { id: id } });
  },

  countOfShuttlePassenger: async (shuttleRouteId) => {
    const shuttlePassengers = await db.ShuttlePassenger.findAndCountAll({
      where: { shuttleRouteId: shuttleRouteId },
    });
    return shuttlePassengers ? shuttlePassengers.count : 0;
  },
};
