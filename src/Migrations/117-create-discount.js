"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Discounts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      value: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      key: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      expireDate: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: "0",
      },
      isSystem: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      minimumpricetoapply: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      maximumdiscountprice: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Discounts");
  },
};
