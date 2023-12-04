require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

module.exports = {
  createNewCoach: async (rawData) => {
    try {
      const { services, typeDetails, ...data } = rawData.body;
      const coach = await db.Coach.create(data);
      if (data.services) {
        await Promise.all(
          data.services.map(async (service) => {
            await db.CoachService.create({
              coachId: coach.id,
              serviceId: service,
            });
          })
        );
      }
      return apiReturns.success(200, "Create new Coach Successful", coach);
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
  getAllCoaches: async ({ page, limit, order, ...query }) => {
    try {
      // Order And Queries
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const flimit = +limit || +process.env.PAGINATION_LIMIT;
      queries.offset = offset * flimit;
      queries.limit = flimit;
      if (order) queries.order = [order];
      const coaches = await db.Coach.findAndCountAll({
        where: query,
        ...queries,
        include: [{ model: db.CoachType, as: "CoachTypeData" }],
      });
      return apiReturns.success(200, "Get Coaches Successfully", coaches);
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
  updateCoaches: async (rawData) => {
    try {
      const coachId = rawData.params.coachId;
      const data = rawData.body;
      const coach = await db.Coach.findByPK(coachId);
      if (!coach) {
        throw new Error("Coaches Not Found");
      }
      const updatedCoach = await db.Coach.update(data, {
        where: { id: coachId },
      });
      return apiReturns.success(
        200,
        "Updated Coach Successfully",
        updatedCoach
      );
    } catch (error) {
      console.error(error);
      return apiReturns.error(400, error.message);
    }
  },
  deleteCoaches: async (rawData) => {
    try {
      const coachId = rawData.params.coachId;
      const data = rawData.body;
      const coach = await db.Coach.findByPK(coachId);
      if (!coach) {
        throw new Error("Coaches Not Found");
      }
      await db.Coach.destroy({ where: { id: coachId } });
      return apiReturns.success(200, "Delete Coach Successfully");
    } catch (error) {
      console.error(error);
      return apiReturns.error(400, error.message);
    }
  },
};
