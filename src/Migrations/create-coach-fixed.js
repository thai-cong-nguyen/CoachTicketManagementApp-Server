"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CoachFixeds", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      idCoach: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Coaches", key: "id" },
      },
      serviceName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      quantity: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      fixedDate: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE,
      },
      isUpgrade: {
        defaultValue: false,
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CoachFixeds");
  },
};
