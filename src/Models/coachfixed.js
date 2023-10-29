"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CoachFixed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CoachFixed.belongsTo(models.Coach, {
        foreignKey: "idCoach",
        targetKey: "id",
        as: "CoachData",
      });
    }
  }
  CoachFixed.init(
    {
      idCoach: DataTypes.BIGINT,
      serviceName: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      fixedDate: DataTypes.DATE,
      isUpgrade: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "CoachFixed",
      createdAt: false,
      updatedAt: false,
    }
  );
  return CoachFixed;
};
