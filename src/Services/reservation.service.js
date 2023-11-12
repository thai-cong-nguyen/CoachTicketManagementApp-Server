require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { deleteShuttlePassengerById } = require("./shuttlePassenger.service");

module.exports = {
  deleteReservationById: async (id) => {
    const { count, rows } = await db.ShuttlePassenger.findAndCountAll({
      where: { reservationId: id },
    });
    if (count > 0) {
      await Promise.all(
        rows.map(async ({ id }) => {
          await deleteShuttlePassengerById(id);
        })
      );
    }
    await db.Reservation.destroy({ where: { id: id } });
  },
  deleteReservation: async (rawData) => {
    try {
    } catch (error) {}
  },
};
