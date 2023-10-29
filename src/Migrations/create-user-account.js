"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserAccounts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      userName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      avatar: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      roleId: {
        allowNull: false,
        defaultValue: "1",
        type: Sequelize.BIGINT,
        references: { model: "Roles", key: "id" },
      },
      memberShipId: {
        allowNull: false,
        defaultValue: "1",
        type: Sequelize.BIGINT,
        references: { model: "MemberShips", key: "id" },
      },
      rewardPoint: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserAccounts");
  },
};
