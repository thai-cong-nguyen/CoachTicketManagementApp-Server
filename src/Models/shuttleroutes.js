"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShuttleRoutes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ShuttleRoutes.belongsTo(models.Shuttle, {
        foreignKey: "shuttleId",
        targetKey: "id",
        as: "ShuttleData",
      });
      ShuttleRoutes.belongsTo(models.Places, {
        foreignKey: "departurePlaceId",
        targetKey: "id",
        as: "DeparturePlaceData",
      });
      // has many
      ShuttleRoutes.hasMany(models.ShuttlePassengers, {
        foreignKey: "shuttleRouteId",
        onDelete: "CASCADE",
      });
    }
  }
  ShuttleRoutes.init(
    {
      shuttleId: DataTypes.BIGINT,
      departureTime: DataTypes.DATE,
      departurePlaceId: DataTypes.BIGINT,
      status: DataTypes.ENUM("0", "1", "2", "3"),
      departurePlaceLat: DataTypes.FLOAT,
      departurePlaceLng: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "ShuttleRoutes",
      createdAt: false,
      updatedAt: false,
    }
  );
  return ShuttleRoutes;
};
