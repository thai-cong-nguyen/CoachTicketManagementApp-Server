require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

module.exports = {
  getAllRating: async ({ page, limit, order, ...query }) => {
    try {
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const flimit = +limit || +process.env.PAGINATION_LIMIT;
      queries.offset = offset * flimit;
      queries.limit = flimit;
      if (order) queries.order = order;
      const ratings = await db.Rating.findAndCountAll({
        where: query,
        ...queries,
      });
      return apiReturns.success(200, "Get Rating Successfully", ratings);
    } catch (error) {
      console.log(error.message);
      return apiReturns.error(400, error.message);
    }
  },
  createNewRating: async (rawData) => {
    try {
      const data = rawData.body;
      await db.Rating.create(data);
      return apiReturns.success(200, "Create New Rating Successfully");
    } catch (error) {
      console.log(error.message);
      return apiReturns.error(400, error.message);
    }
  },
  deleteRating: async (id) => {
    await db.Rating.destroy(id);
  },
  deleteRatingById: async (rawData) => {
    try {
      const { id } = rawData.params;
      const rating = await db.Rating.findOne({ where: { id: id } });
      if (!rating) return apiReturns.error(404, "Rating is not found");
      await this.deleteRating(id);
      return apiReturns.success(200, "Delete Rating Successfully");
    } catch (error) {
      console.log(error.message);
      return apiReturns.error(400, error.message);
    }
  },
};
