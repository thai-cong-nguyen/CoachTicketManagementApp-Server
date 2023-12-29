require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { getRolesUser } = require("../Services/jwt.service");
const { createJWT } = require("../Middlewares/JWT.middleware");

const createNewCoachType = async (rawData) => {
  try {
    const typeName = rawData.body.typeName;
    // if (typeName) return apiReturns.validation()
    const [coachType, created] = await db.CoachType.findOrCreate({
      where: { typeName: typeName },
    });
    if (created) return apiReturns.validation("Coach Type is already existed");
    return apiReturns.success(
      200,
      "Created a new Coach Type Successfully",
      coachType
    );
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getAllCoachTypes = async ({ page, limit, order, ...query }) => {
  try {
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
    const coachTypes = await db.CoachType.findAndCountAll({
      where: query,
      attributes: { exclude: ["password"] },
      ...queries,
    });
    return apiReturns.success(200, "Get CoachTypes Successful", coachTypes);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = { createNewCoachType, getAllCoachTypes };
