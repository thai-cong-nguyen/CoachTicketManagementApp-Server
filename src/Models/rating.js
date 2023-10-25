"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rating.belongsTo(models.Schedule, {
        foreignKey: "scheduleId",
        targetKey: "id",
        as: "ScheduleData",
      });
      Rating.belongsTo(models.UserAccount, {
        foreignKey: "userId",
        targetKey: "id",
        as: "UserAccountData",
      });
    }
  }
  Rating.init(
    {
      scheduleId: DataTypes.BIGINT,
      userId: DataTypes.BIGINT,
      value: DataTypes.FLOAT,
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Rating",
    }
  );
  return Rating;
};
