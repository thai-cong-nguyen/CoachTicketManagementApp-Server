"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShuttlePassengers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ShuttlePassengers.belongsTo(models.ShuttleRoutes, {
        foreignKey: "shuttleRouteId",
        targetKey: "id",
        as: "ShuttleRouteData",
      });
      ShuttlePassengers.belongsTo(models.Reservation, {
        foreignKey: "reservationId",
        targetKey: "id",
        as: "ReservationData",
      });
    }
  }
  ShuttlePassengers.init(
    {
      shuttleRouteId: DataTypes.BIGINT,
      reservationId: DataTypes.BIGINT,
      status: DataTypes.ENUM("0", "1"),
    },
    {
      sequelize,
      modelName: "ShuttlePassengers",
    }
  );
  return ShuttlePassengers;
};
