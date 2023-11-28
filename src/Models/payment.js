"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // has many
      Payment.hasMany(models.Reservation, {
        foreignKey: "paymentId",
        onDelete: "CASCADE",
      });
    }
  }
  Payment.init(
    {
      paymentMethod: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payment",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Payment;
};
