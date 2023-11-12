require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { deleteCoachServiceById } = require("./coachService.service");
const { deleteScheduleById } = require("./schedule.service");
const { deleteShuttlesById } = require("./shuttle.service");

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
      });
      return apiReturns.success(200, "Get Coaches Successfully", coaches);
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
  updateCoaches: async (rawData) => {
    try {
      const id = rawData.params.id;
      const data = rawData.body;
      const coach = await db.Coach.findOne({ where: { id } });
      if (!coach) {
        return apiReturns.error(404, "Coaches Not Found");
      }
      await db.Coach.update(data, { where: { id } });
      return apiReturns.success(200, "Update Successfully");
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
  deleteCoachById: async (id) => {
    const [coachServices, schedules, shuttles] = await Promise.all([
      db.CoachService.findAndCountAll({ where: { coachId: id } }),
      db.Schedule.findAndCountAll({ where: { coachId: id } }),
      db.Shuttle.findAndCountAll({ where: { coachId: id } }),
    ]);
    await Promise.all([
      ...coachServices.map((coachService) =>
        deleteCoachServiceById(coachService.id)
      ),
      ...schedules.map((schedule) => deleteScheduleById(schedule.id)),
      ...shuttles.map((shuttle) => deleteShuttlesById(shuttle.id)),
    ]);
  },
  deleteCoach: async (rawData) => {
    try {
      const id = rawData.params.id;
      await this.deleteCoachById(id);
      return apiReturns.success(200, "Delete Successfully");
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
};
