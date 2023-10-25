"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reservations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      scheduleId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      passengerId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      userId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      reservationPhoneNumber: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      seatNumber: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      reservationDate: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE,
      },
      paymentId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      discountId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      note: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      status: {
        defaultValue: "0",
        allowNull: false,
        type: Sequelize.ENUM("0", "1", "2"),
      },
      departurePoint: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      arrivalPoint: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      isShuttle: {
        defaultValue: false,
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      isRoundTrip: {
        defaultValue: false,
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Reservations");
  },
};
