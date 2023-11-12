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
        references: { model: "Schedules", key: "id" },
      },
      passengerId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Staffs", key: "id" },
      },
      userId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "UserAccounts", key: "id" },
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
        references: { model: "Payments", key: "id" },
      },
      discountId: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: { model: "Discounts", key: "id" },
        defaultValue: null,
      },
      note: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      status: {
        defaultValue: "0",
        allowNull: false,
        type: Sequelize.ENUM("0", "1", "2", "3", "4"),
        /**
         *   0 [note: 'processing']
              1 [note: 'confirmed']
              2 [note: 'cancel']
              3 [note: 'uncheck']
              4 [note: 'checked']
         */
      },
      departurePoint: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Places", key: "id" },
      },
      arrivalPoint: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Places", key: "id" },
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Reservations");
  },
};
