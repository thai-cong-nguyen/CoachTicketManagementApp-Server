"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Route.init(
    {
      routeName: DataTypes.STRING,
      departurePlace: DataTypes.STRING,
      arrivalPlace: DataTypes.STRING,
      distance: DataTypes.FLOAT,
      duration: DataTypes.FLOAT,
      departureLat: DataTypes.STRING,
      departureLng: DataTypes.STRING,
      arrivalLat: DataTypes.STRING,
      arrivalLng: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Route",
    }
  );
  return Route;
};
