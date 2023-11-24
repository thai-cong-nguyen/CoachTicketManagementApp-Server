"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reservation.belongsTo(models.Schedule, {
        foreignKey: "scheduleId",
        targetKey: "id",
        as: "ScheduleData",
      });
      Reservation.belongsTo(models.Passenger, {
        foreignKey: "passengerId",
        targetKey: "id",
        as: "PassengerData",
      });
      Reservation.belongsTo(models.UserAccount, {
        foreignKey: "userId",
        targetKey: "id",
        as: "UserAccountData",
      });
      Reservation.belongsTo(models.Payment, {
        foreignKey: "paymentId",
        targetKey: "id",
        as: "PaymentData",
      });
      Reservation.belongsTo(models.Discount, {
        foreignKey: "discountId",
        targetKey: "id",
        as: "DiscountData",
      });
      Reservation.belongsTo(models.Places, {
        foreignKey: "departurePoint",
        targetKey: "id",
        as: "DeparturePlaceData",
      });
      Reservation.belongsTo(models.Places, {
        foreignKey: "arrivalPoint",
        targetKey: "id",
        as: "ArrivalPlaceData",
      });
      // has many
      Reservation.hasMany(models.ShuttlePassengers, { onDelete: "CASCADE" });
    }
  }
  Reservation.init(
    {
      scheduleId: DataTypes.BIGINT,
      passengerId: DataTypes.BIGINT,
      userId: DataTypes.BIGINT,
      reservationPhoneNumber: DataTypes.STRING,
      seatNumber: DataTypes.STRING,
      reservationDate: DataTypes.DATE,
      paymentId: DataTypes.BIGINT,
      discountId: DataTypes.BIGINT,
      note: DataTypes.STRING,
      status: DataTypes.ENUM("0", "1", "2", "3", "4"),
      departurePoint: DataTypes.BIGINT,
      arrivalPoint: DataTypes.BIGINT,
      isShuttle: DataTypes.BOOLEAN,
      isRoundTrip: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Reservation",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Reservation;
};
