"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Coach extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Coach.belongsTo(models.CoachType, {
        foreignKey: "idCoachType",
        targetKey: "id",
        as: "CoachTypeData",
      });
    }
  }
  Coach.init(
    {
      coachNumber: DataTypes.STRING,
      image: DataTypes.STRING,
      idCoachType: DataTypes.BIGINT,
      capacity: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
      lat: DataTypes.FLOAT,
      lng: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Coach",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Coach;
};
