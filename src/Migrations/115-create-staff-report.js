"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StaffReports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      staffId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Staffs", key: "id" },
      },
      scheduleId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Schedules", key: "id" },
      },
      userId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "UserAccounts", key: "id" },
      },
      createdDate: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE,
      },
      content: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("StaffReports");
  },
};
