"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // has many
      Role.hasMany(models.UserAccount, {
        foreignKey: "roleId",
        onDelete: "CASCADE",
      });
    }
  }
  Role.init(
    {
      roleName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Role;
};
