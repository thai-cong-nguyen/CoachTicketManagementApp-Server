require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const createNewService = async (rawData) => {
  try {
    const data = rawData.body;
    if (!data.serviceDetail)
      return apiReturns.validation("Can not create without Service Detail");
    await db.Service.create(data);
    return apiReturns.success(200, "Create new Service Successful");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getAllServices = async ({ page, limit, order, ...query }) => {
  try {
    // Order And Queries
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const fLimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * fLimit;
    queries.limit = fLimit;
    if (order && order.trim() !== "") {
      const arrayOrder = order.split(",");
      queries.order = [[arrayOrder[0], arrayOrder[1]]]; // 'ASC' for ascending, 'DESC' for descending
    } else {
      queries.order = [["id", "ASC"]];
    }
    const services = await db.Service.findAndCountAll({
      where: query,
      ...queries,
    });
    return apiReturns.success(200, "Get Successfully", services);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getServicesOfCoaches = async (rawData) => {
  try {
    const coachId = rawData.params.coachId;
    const coach = await db.Coach.findByPk(coachId);
    if (!coach) {
      throw new Error("Could not find coach");
    }
    const coachServices = await db.CoachService.findAndCountAll({
      where: { coachId: coachId },
      include: [
        {
          model: db.Service,
          as: "ServiceData",
          attribute: ["serviceName"],
        },
      ],
    });
    let res = {
      services: [],
    };
    if (coachServices.count < 0) {
      const services = coachServices.map(
        (service) => service.ServiceData.serviceName
      );
      res.services = services;
    }
    return apiReturns.success(200, "Get Coach Services Successfully", res);
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const removeServiceOutOfCoach = async ({ coachId, serviceId }) => {
  try {
    const coachType = await db.CoachService.findOne({
      where: { coachId: coachId, serviceId: serviceId },
      attributes: ["id", "coachId", "serviceId"],
    });
    if (!coachType) return apiReturns.error(404, "Coach have not this service");
    await db.CoachService.destroy({ where: { id: coachType.id } });
    return apiReturns.success(200, "Removed this service from coach");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, "Something went wrong");
  }
};

const addServiceForCoach = async ({ coachId, serviceId }) => {
  try {
    const existingCoachService = await db.CoachService.findOne({
      where: {
        coachId: coachId,
        serviceId: serviceId,
      },
      attributes: ["id", "coachId", "serviceId"],
    });
    if (existingCoachService) {
      return apiReturns.error(409, "Service is available for this Coach");
    }
    await db.CoachService.create({
      coachId: coachId,
      serviceId: serviceId,
    });
    return apiReturns.success(200, "Added Service for this Coach");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, "Something went wrong");
  }
};

const deleteServiceById = async (rawData) => {
  try {
    const serviceId = rawData.params.serviceId;
    const existingService = await db.Service.findByPk(serviceId);
    if (!existingService)
      return apiReturns.error(400, "Service is not available");
    await db.Service.destroy({ where: { id: serviceId } });
    return apiReturns.success(200, "Deleted successfully");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, "Something went wrong");
  }
};

module.exports = {
  getAllServices,
  createNewService,
  removeServiceOutOfCoach,
  addServiceForCoach,
  getServicesOfCoaches,
  deleteServiceById,
};
