"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CoachService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CoachService.belongsTo(models.Coach, {
        foreignKey: "idCoach",
        targetKey: "id",
        as: "CoachData",
      });
      CoachService.belongsTo(models.Service, {
        foreignKey: "serviceId",
        targetKey: "id",
        as: "ServiceData",
      });
    }
  }
  CoachService.init(
    {
      coachId: DataTypes.BIGINT,
      serviceId: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "CoachService",
      createdAt: false,
      updatedAt: false,
    }
  );
  return CoachService;
};
