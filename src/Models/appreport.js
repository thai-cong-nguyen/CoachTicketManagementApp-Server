"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AppReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AppReport.belongsTo(models.UserAccount, {
        foreignKey: "userId",
        targetKey: "id",
        as: "UserData",
      });
    }
  }
  AppReport.init(
    {
      userId: DataTypes.BIGINT,
      createdDate: DataTypes.DATE,
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AppReport",
    }
  );
  return AppReport;
};
