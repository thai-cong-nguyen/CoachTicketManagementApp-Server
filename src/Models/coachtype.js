"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CoachType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CoachType.init(
    {
      typeName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CoachType",
      createdAt: false,
      updatedAt: false,
    }
  );
  return CoachType;
};
