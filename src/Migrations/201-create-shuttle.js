"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Shuttles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      coachId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Coaches", key: "id" },
      },
      scheduleId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Schedules", key: "id" },
      },
      driverId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Staffs", key: "id" },
      },
      coachAssistantId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Staffs", key: "id" },
      },
      departurePlace: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Places", key: "id" },
      },
      arrivalPlace: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Places", key: "id" },
      },
      distance: {
        defaultValue: 0,
        type: Sequelize.FLOAT,
      },
      duration: {
        defaultValue: 0,
        type: Sequelize.FLOAT,
      },
      passengerQuality: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      status: {
        defaultValue: "0",
        allowNull: false,
        type: Sequelize.ENUM("0", "1", "2", "3"),
        /**
         *   0 [note: 'sell ticket']
              1 [note: 'full']
              2 [note: 'processing']
              3 [note: 'finished']
         */
      },
      departurePlaceLat: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      departurePlaceLng: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      arrivalPlaceLat: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      arrivalPlaceLng: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.FLOAT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Shuttles");
  },
};
