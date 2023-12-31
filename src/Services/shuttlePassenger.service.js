require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

module.exports = {
  getAllPassengerOfShuttle: async ({ page, limit, order, ...query }) => {
    try {
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.PAGINATION_LIMIT;
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order && order.trim() !== "") {
        const arrayOrder = order.split(",");
        queries.order = [[arrayOrder[0], arrayOrder[1]]]; // 'ASC' for ascending, 'DESC' for descending
      } else {
        queries.order = [["id", "ASC"]];
      }
      const shuttlePassengers = await db.ShuttlePassengers.findAndCountAll({
        where: query,
        ...queries,
        include: [
          {
            model: db.ShuttleRoutes,
            as: "ShuttleRouteData",
            include: [{ model: db.Shuttle, as: "ShuttleData" }],
          },
          {
            model: db.Reservation,
            as: "ReservationData",
            include: [{ model: db.Passenger, as: "PassengerData" }],
          },
        ],
      });
      return apiReturns.success(
        200,
        "Get Passengers of Shuttle Successfully",
        shuttlePassengers
      );
    } catch (error) {
      console.log(error);
      return apiReturns.error(400, error.message);
    }
  },

  deleteShuttlePassengers: async (rawData) => {
    try {
      const shuttlePassengerId = rawData.params.shuttlePassengerId;
      const shuttlePassenger = await db.ShuttlePassengers.findByPk({
        where: { id: shuttlePassengerId },
      });
      if (!shuttlePassenger) {
        throw new Error("Shuttle Passenger is not existed");
      }
      await db.ShuttlePassengers.destroy({ where: { id: shuttlePassengerId } });
      return apiReturns.success(200, "Deleted Shuttle Passenger Successfully");
    } catch (error) {
      console.log(error);
      return apiReturns.error(400, error.message);
    }
  },

  countOfShuttlePassenger: async (shuttleRouteId, transaction = null) => {
    const shuttlePassengers = await db.ShuttlePassengers.findAndCountAll({
      where: { shuttleRouteId: shuttleRouteId },
      transaction: transaction ? transaction : null,
    });
    return shuttlePassengers ? shuttlePassengers.count : 0;
  },
};
