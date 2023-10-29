"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserDiscounts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      userId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "UserAccounts", key: "id" },
      },
      discountId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Discounts", key: "id" },
      },
      status: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: "0",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserDiscounts");
  },
};
