"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Passenger.belongsTo(models.UserAccount, {
        foreignKey: "userId",
        targetKey: "id",
        as: "UserAccountData",
      });
      // has many
      Passenger.hasMany(models.Reservation, { onDelete: "CASCADE" });
    }
  }
  Passenger.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      userId: DataTypes.BIGINT,
      gender: DataTypes.ENUM("male", "female"),
    },
    {
      sequelize,
      modelName: "Passenger",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Passenger;
};
