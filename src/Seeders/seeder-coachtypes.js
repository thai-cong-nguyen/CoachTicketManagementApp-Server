"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("CoachTypes", [
      { CoachTypes: "normal" },
      { CoachTypes: "Limousine" },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("CoachTypes", null, {});
  },
};
