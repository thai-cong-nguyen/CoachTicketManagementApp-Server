"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shuttle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shuttle.belongsTo(models.Coach, {
        foreignKey: "coachId",
        targetKey: "id",
        as: "CoachData",
      });
      Shuttle.belongsTo(models.Schedule, {
        foreignKey: "scheduleId",
        targetKey: "id",
        as: "ScheduleData",
      });
      Shuttle.belongsTo(models.Staff, {
        foreignKey: "driverId",
        targetKey: "id",
        as: "DriverData",
      });
      Shuttle.belongsTo(models.Staff, {
        foreignKey: "coachAssistantId",
        targetKey: "id",
        as: "CoachAssistantData",
      });
      Shuttle.belongsTo(models.Places, {
        foreignKey: "departurePlace",
        targetKey: "id",
        as: "DeparturePlaceData",
      });
      Shuttle.belongsTo(models.Places, {
        foreignKey: "arrivalPlace",
        targetKey: "id",
        as: "ArrivalPlaceData",
      });
      // has many
      Shuttle.hasMany(models.ShuttleRoutes, {
        foreignKey: "shuttleId",
        onDelete: "CASCADE",
      });
    }
  }
  Shuttle.init(
    {
      coachId: DataTypes.BIGINT,
      scheduleId: DataTypes.BIGINT,
      driverId: DataTypes.BIGINT,
      coachAssistantId: DataTypes.BIGINT,
      departurePlace: DataTypes.BIGINT,
      arrivalPlace: DataTypes.BIGINT,
      distance: DataTypes.FLOAT,
      duration: DataTypes.FLOAT,
      passengerQuantity: DataTypes.INTEGER,
      status: DataTypes.ENUM("0", "1", "2", "3"),
      departurePlaceLat: DataTypes.FLOAT,
      departurePlaceLng: DataTypes.FLOAT,
      arrivalPlaceLat: DataTypes.FLOAT,
      arrivalPlaceLng: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Shuttle",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Shuttle;
};
