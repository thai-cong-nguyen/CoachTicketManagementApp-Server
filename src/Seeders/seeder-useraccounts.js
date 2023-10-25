"use strict";
const { randomString } = require("../Utils/random.util");
const { hashPassword } = require("../Services/user.service");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("UserAccounts", [
      {
        userName: randomString(5),
        password: await hashPassword("12345"),
        avatar:
          "https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg",
        roleId: 1,
        memberShipId: 1,
      },
      {
        userName: randomString(5),
        password: await hashPassword("12345"),
        avatar:
          "https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg",
        roleId: 1,
        memberShipId: 1,
      },
      {
        userName: randomString(5),
        password: await hashPassword("12345"),
        avatar:
          "https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg",
        roleId: 2,
        memberShipId: 1,
      },
      {
        userName: randomString(5),
        password: await hashPassword("12345"),
        avatar:
          "https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg",
        roleId: 3,
        memberShipId: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("UserAccounts", null, {});
  },
};
