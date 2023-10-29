"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Places", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      routeId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Routes", key: "id" },
      },
      placeName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      isPickUpPlace: {
        defaultValue: "0",
        type: Sequelize.ENUM("0", "1"),
        /**
         * 0 [note: 'drop off']
            1 [note: 'pick up']
         */
      },
      placeLat: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      placeLng: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Places");
  },
};
