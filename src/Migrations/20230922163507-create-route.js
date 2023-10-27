"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Routes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      routeName: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      departurePlace: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      arrivalPlace: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      distance: {
        defaultValue: 0,
        type: Sequelize.FLOAT,
      },
      duration: {
        defaultValue: 0,
        type: Sequelize.FLOAT,
      },
      departureLat: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      departureLng: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      arrivalLat: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      arrivalLng: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Routes");
  },
};
