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
        foreignKey: "departurePlaceId",
        targetKey: "id",
        as: "DeparturePlaceData",
      });
      Shuttle.belongsTo(models.Places, {
        foreignKey: "arrivalPlaceId",
        targetKey: "id",
        as: "ArrivalPlaceData",
      });
    }
  }
  Shuttle.init(
    {
      coachId: DataTypes.BIGINT,
      scheduleId: DataTypes.BIGINT,
      driverId: DataTypes.BIGINT,
      coachAssistantId: DataTypes.BIGINT,
      departurePlaceId: DataTypes.BIGINT,
      arrivalPlaceId: DataTypes.BIGINT,
      distance: DataTypes.FLOAT,
      duration: DataTypes.FLOAT,
      passengerQuality: DataTypes.INTEGER,
      status: DataTypes.ENUM("0", "1", "2", "3"),
      departurePlaceLat: DataTypes.FLOAT,
      departurePlaceLng: DataTypes.FLOAT,
      arrivalPlaceLat: DataTypes.FLOAT,
      arrivalPlaceLng: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Shuttle",
    }
  );
  return Shuttle;
};
