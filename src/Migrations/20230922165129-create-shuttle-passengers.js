"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ShuttlePassengers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      shuttleRouteId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      reservationId: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      status: {
        defaultValue: "0",
        allowNull: false,
        type: Sequelize.ENUM("0", "1"),
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
    await queryInterface.dropTable("ShuttlePassengers");
  },
};
