"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Places extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Places.belongsTo(models.Route, {
        foreignKey: "routeId",
        targetKey: "id",
        as: "RouteData",
      });
      // has many
      Places.hasMany(models.Schedule, {
        foreignKey: "startPlace",
        onDelete: "CASCADE",
      });
      Places.hasMany(models.Schedule, {
        foreignKey: "arrivalPlace",
        onDelete: "CASCADE",
      });
      Places.hasMany(models.Reservation, {
        foreignKey: "departurePoint",
        onDelete: "CASCADE",
      });
      Places.hasMany(models.Reservation, {
        foreignKey: "arrivalPoint",
        onDelete: "CASCADE",
      });
    }
  }
  Places.init(
    {
      routeId: DataTypes.BIGINT,
      placeName: DataTypes.STRING,
      isPickUpPlace: DataTypes.ENUM("0", "1"),
      placeLat: DataTypes.STRING,
      placeLng: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Places",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Places;
};
