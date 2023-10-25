"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CoachTypeDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CoachTypeDetail.belongsTo(models.TypeDetail, {
        foreignKey: "idTypeDetail",
        targetKey: "id",
        as: "TypDetailData",
      });
    }
  }
  CoachTypeDetail.init(
    {
      idTypeDetail: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "CoachTypeDetail",
    }
  );
  return CoachTypeDetail;
};
