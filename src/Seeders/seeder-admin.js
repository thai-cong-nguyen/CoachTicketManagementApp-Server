"use strict";
/** @type {import('sequelize-cli').Migration} */
const { hashPassword } = require("../Services/auth.service");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("UserAccounts", [
      { userName: "admin", password: hashPassword("12345"), roleId: "3" },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("UserAccounts", null, {});
  },
};
