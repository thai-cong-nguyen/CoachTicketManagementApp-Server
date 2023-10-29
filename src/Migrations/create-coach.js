"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Coaches", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      coachNumber: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      idCoachType: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "CoachTypes", key: "id" },
      },
      capacity: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lat: {
        defaultValue: 0,
        type: Sequelize.FLOAT,
      },
      lng: {
        defaultValue: 0,
        type: Sequelize.FLOAT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Coaches");
  },
};
