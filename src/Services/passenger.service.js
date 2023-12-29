require("dotenv").config();
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getAllPassengers = async ({ page, limit, order, ...query }) => {
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
    const passengers = await db.Passenger.findAndCountAll({
      where: query,
      ...queries,
    });
    return apiReturns.success(200, "Get Passengers Successfully", passengers);
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const deletePassengersById = async (rawData) => {
  try {
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const updatePassengersById = async (rawData) => {
  try {
    const updateData = {};
    if (rawdata.fullName) updateData.fullName = rawData.fullName;
    if (rawdata.email) updateData.email = rawData.email;
    if (rawdata.address) updateData.address = rawData.address;
    if (rawdata.phoneNumber) updateData.phoneNumber = rawData.phoneNumber;
    if (rawdata.gender) updateData.gender = rawData.gender;
    const updatedPassengers = await db.Passenger.update(updateData, {
      where: { id: rawData.id },
    });
    if (!updatedPassengers)
      return apiReturns.error(400, "Can not update information passenger");
    return apiReturns.success(
      200,
      "Updated information passenger successfully",
      updatedPassengers
    );
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllPassengers,
  deletePassengersById,
  updatePassengersById,
};
