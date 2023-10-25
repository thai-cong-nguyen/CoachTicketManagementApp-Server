"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Schedules", {
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
      routeId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      driverId: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BIGINT,
      },
      coachAssistantId: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BIGINT,
      },
      departureTime: {
        allowNull: true,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
      arrivalTime: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DATE,
      },
      startPlace: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      arrivalPlace: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      price: {
        comment: "Can not be negative",
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.BIGINT,
      },
      status: {
        allowNull: false,
        defaultValue: "0",
        type: Sequelize.ENUM("0", "1", "2", "3"),
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
    await queryInterface.dropTable("Schedules");
  },
};
