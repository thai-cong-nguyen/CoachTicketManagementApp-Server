"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Services", [
      {
        serviceName: "Air Conditioner",
      },
      {
        serviceName: "Wifi",
      },
      {
        serviceName: "TV",
      },
      {
        serviceName: "Blanket",
      },
      {
        serviceName: "Charging Socket",
      },
      {
        serviceName: "Mattress",
      },
      {
        serviceName: "Earphone",
      },
      {
        serviceName: "Toilet",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Services", null, {});
  },
};
