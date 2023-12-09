"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Staff.belongsTo(models.UserAccount, {
        foreignKey: "userId",
        targetKey: "id",
        as: "UserAccountData",
      });
      Staff.belongsTo(models.Position, {
        foreignKey: "positionId",
        targetKey: "id",
        as: "PositionData",
      });
      // has many
      Staff.hasMany(models.StaffReport, {
        foreignKey: "staffId",
        onDelete: "CASCADE",
      });
      Staff.hasMany(models.Shuttle, {
        foreignKey: "driverId",
        onDelete: "CASCADE",
      });
      Staff.hasMany(models.Shuttle, {
        foreignKey: "coachAssistantId",
        onDelete: "CASCADE",
      });
      Staff.hasMany(models.Schedule, {
        foreignKey: "driverId",
        onDelete: "CASCADE",
      });
      Staff.hasMany(models.Schedule, {
        foreignKey: "coachAssistantId",
        onDelete: "CASCADE",
      });
    }
  }
  Staff.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      positionId: DataTypes.BIGINT,
      userId: DataTypes.BIGINT,
      gender: DataTypes.ENUM("male", "female"),
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Staff",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Staff;
};
