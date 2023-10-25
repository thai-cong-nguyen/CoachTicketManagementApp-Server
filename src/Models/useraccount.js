"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserAccount.belongsTo(models.Role, {
        foreignKey: "roleId",
        targetKey: "id",
        as: "RoleData",
      });
      UserAccount.belongsTo(models.MemberShip, {
        foreignKey: "memberShipId",
        targetKey: "id",
        as: "MemberShipData",
      });
    }
  }
  UserAccount.init(
    {
      userName: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      roleId: DataTypes.BIGINT,
      memberShipId: DataTypes.BIGINT,
      rewardPoint: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserAccount",
    }
  );
  return UserAccount;
};
