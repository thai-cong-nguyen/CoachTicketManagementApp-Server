"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ShuttleRoutes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      shuttleId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      departureTime: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE,
      },
      departurePlaceId: {
        allowNull: false,
        type: Sequelize.BIGINT,
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
    await queryInterface.dropTable("ShuttleRoutes");
  },
};
