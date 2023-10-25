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
      },
      scheduleId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      driverId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      coachAssistantId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      departurePlaceId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      arrivalPlaceId: {
        allowNull: false,
        type: Sequelize.BIGINT,
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
    await queryInterface.dropTable("Shuttles");
  },
};
