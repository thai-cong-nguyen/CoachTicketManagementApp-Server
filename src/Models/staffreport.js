"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StaffReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StaffReport.belongsTo(models.Staff, {
        foreignKey: "staffId",
        targetKey: "id",
        as: "StaffData",
      });
      StaffReport.belongsTo(models.Schedule, {
        foreignKey: "scheduleId",
        targetKey: "id",
        as: "ScheduleData",
      });
      StaffReport.belongsTo(models.UserAccount, {
        foreignKey: "userId",
        targetKey: "id",
        as: "UserAccountData",
      });
    }
  }
  StaffReport.init(
    {
      staffId: DataTypes.BIGINT,
      scheduleId: DataTypes.BIGINT,
      userId: DataTypes.BIGINT,
      createdDate: DataTypes.DATE,
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "StaffReport",
      createdAt: false,
      updatedAt: false,
    }
  );
  return StaffReport;
};
