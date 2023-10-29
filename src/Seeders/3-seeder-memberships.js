"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("MemberShips", [
      {
        memberShipName: "Bronze",
        image:
          "https://static.wikia.nocookie.net/leagueoflegends/images/e/e9/Season_2022_-_Bronze.png/revision/latest/scale-to-width-down/250?cb=20220105214224",
      },
      {
        memberShipName: "Silver",
        image:
          "https://static.wikia.nocookie.net/leagueoflegends/images/4/44/Season_2022_-_Silver.png/revision/latest?cb=20220105214225",
      },
      {
        memberShipName: "Gold",
        image:
          "https://static.wikia.nocookie.net/leagueoflegends/images/8/8d/Season_2022_-_Gold.png/revision/latest?cb=20220105214225",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("MemberShips", null, {});
  },
};
