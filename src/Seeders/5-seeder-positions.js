"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Positions", [
      {
        positionName: "Seller",
      },
      {
        positionName: "Driver",
      },
      {
        positionName: "Coach Assistant",
      },
      {
        positionName: "Manager",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Positions", null, {});
  },
};
