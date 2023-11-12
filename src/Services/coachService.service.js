require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

module.exports = {
  deleteCoachServiceById: async (id) => {
    await db.CoachService.destroy({ where: { id } });
  },
};
