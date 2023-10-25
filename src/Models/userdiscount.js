"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserDiscount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDiscount.belongsTo(models.UserAccount, {
        foreignKey: "userId",
        targetKey: "id",
        as: "UserAccountData",
      });
      UserDiscount.belongsTo(models.Discount, {
        foreignKey: "discountId",
        targetKey: "id",
        as: "DiscountData",
      });
    }
  }
  UserDiscount.init(
    {
      userId: DataTypes.BIGINT,
      discountId: DataTypes.BIGINT,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "UserDiscount",
    }
  );
  return UserDiscount;
};
