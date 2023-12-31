"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MemberShip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // hasMany
      MemberShip.hasMany(models.UserAccount, {
        foreignKey: "memberShipId",
        onDelete: "CASCADE",
      });
    }
  }
  MemberShip.init(
    {
      memberShipName: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "MemberShip",
      createdAt: false,
      updatedAt: false,
    }
  );
  return MemberShip;
};
