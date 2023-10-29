"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CoachServices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      coachId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Coaches", key: "id" },
      },
      serviceId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Services", key: "id" },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CoachServices");
  },
};
