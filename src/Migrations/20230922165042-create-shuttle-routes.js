"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ShuttleRoutes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      shuttleId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Shuttles", key: "id" },
      },
      departureTime: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE,
      },
      departurePlace: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Places", key: "id" },
      },
      status: {
        defaultValue: "0",
        allowNull: false,
        type: Sequelize.ENUM("0", "1"),
        /**
         * 0 [note: 'processing']
          1 [note: 'finished'] 
         */
      },
      departurePlaceLat: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      departurePlaceLng: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.FLOAT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ShuttleRoutes");
  },
};
