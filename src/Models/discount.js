"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Discount.hasMany(models.Reservation, { onDelete: "CASCADE" });
      Discount.hasMany(models.UserDiscount, { onDelete: "CASCADE" });
    }
  }
  Discount.init(
    {
      value: DataTypes.FLOAT,
      status: DataTypes.BOOLEAN,
      key: DataTypes.STRING,
      title: DataTypes.STRING,
      expireDate: DataTypes.DATE,
      quantity: DataTypes.INTEGER,
      isSystem: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Discount",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Discount;
};
