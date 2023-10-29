"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Schedules", {
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
      routeId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Routes", key: "id" },
      },
      driverId: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BIGINT,
        references: { model: "Staffs", key: "id" },
      },
      coachAssistantId: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BIGINT,
        references: { model: "Staffs", key: "id" },
      },
      departureTime: {
        allowNull: true,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
      arrivalTime: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DATE,
      },
      startPlace: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Places", key: "id" },
      },
      arrivalPlace: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Places", key: "id" },
      },
      price: {
        comment: "Can not be negative",
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.BIGINT,
      },
      status: {
        allowNull: false,
        defaultValue: "0",
        type: Sequelize.ENUM("0", "1", "2", "3"),
        /**
          0 [note: 'created']
          1 [note: 'full']
          2 [note: 'processing']
          3 [note: 'finished']
         **/
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Schedules");
  },
};
