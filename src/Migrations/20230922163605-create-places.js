"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Places", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      idRoute: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      placeName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      isPickUpPlace: {
        defaultValue: "0",
        type: Sequelize.ENUM("0", "1"),
      },
      placeLat: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      placeLng: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Places");
  },
};
