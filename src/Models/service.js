"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // has many
      Service.hasMany(models.CoachService, {
        foreignKey: "serviceId",
        onDelete: "CASCADE",
      });
    }
  }
  Service.init(
    {
      serviceName: DataTypes.STRING,
      serviceDetail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Service",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Service;
};
