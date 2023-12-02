"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Passengers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      fullName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: { model: "UserAccounts", key: "id" },
      },
      gender: {
        type: Sequelize.ENUM("male", "female"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Passengers");
  },
};
