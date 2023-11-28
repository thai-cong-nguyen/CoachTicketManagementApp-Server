"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Coach, {
        foreignKey: "coachId",
        targetKey: "id",
        as: "CoachData",
      });
      Schedule.belongsTo(models.Route, {
        foreignKey: "routeId",
        targetKey: "id",
        as: "RouteData",
      });
      Schedule.belongsTo(models.Staff, {
        foreignKey: "driverId",
        targetKey: "id",
        as: "DriverData",
      });
      Schedule.belongsTo(models.Staff, {
        foreignKey: "coachAssistantId",
        targetKey: "id",
        as: "CoachAssistantData",
      });
      Schedule.belongsTo(models.Places, {
        foreignKey: "startPlace",
        targetKey: "id",
        as: "StartPlaceData",
      });
      Schedule.belongsTo(models.Places, {
        foreignKey: "arrivalPlace",
        targetKey: "id",
        as: "ArrivalPlaceData",
      });
      // has many
      Schedule.hasMany(models.Reservation, {
        foreignKey: "scheduleId",
        onDelete: "CASCADE",
      });
      Schedule.hasMany(models.StaffReport, {
        foreignKey: "scheduleId",
        onDelete: "CASCADE",
      });
      Schedule.hasMany(models.Rating, {
        foreignKey: "scheduleId",
        onDelete: "CASCADE",
      });
      Schedule.hasMany(models.Shuttle, {
        foreignKey: "scheduleId",
        onDelete: "CASCADE",
      });
    }
  }
  Schedule.init(
    {
      coachId: DataTypes.BIGINT,
      routeId: DataTypes.BIGINT,
      driverId: DataTypes.BIGINT,
      coachAssistantId: DataTypes.BIGINT,
      departureTime: DataTypes.DATE,
      arrivalTime: DataTypes.DATE,
      startPlace: DataTypes.BIGINT,
      arrivalPlace: DataTypes.BIGINT,
      price: DataTypes.BIGINT,
      status: DataTypes.ENUM("0", "1", "2", "3"),
    },
    {
      sequelize,
      modelName: "Schedule",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Schedule;
};
