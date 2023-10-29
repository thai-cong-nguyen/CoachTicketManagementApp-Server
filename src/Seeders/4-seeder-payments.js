"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Payments", [
      {
        paymentMethod: "Cash",
      },
      {
        paymentMethod: "Visa",
      },
      {
        paymentMethod: "Crypto",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Payments", null, {});
  },
};
