require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { deleteUserDiscountById } = require("./userDiscount.service");

module.exports = {
  getAllDiscounts: async ({ page, limit, order, discountId, ...query }) => {
    try {
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const pageLimit = +limit || +process.env.PAGINATION_LIMIT;
      queries.offset = offset * pageLimit;
      queries.limit = pageLimit;
      if (order && order.trim() !== "") {
        const arrayOrder = order.split(",");
        queries.order = [[arrayOrder[0], arrayOrder[1]]]; // 'ASC' for ascending, 'DESC' for descending
      } else {
        queries.order = [["id", "ASC"]];
      }
      if (discountId) queries.discountId = discountId;
      const discounts = await db.Discount.findAndCountAll({
        where: query,
        ...queries,
      });
      return apiReturns.success(200, "Get Successfully", discounts);
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
  createNewDiscount: async (rawData) => {
    try {
      const data = rawData.body;
      const discount = await db.Discount.create(data);
      return apiReturns.success(
        200,
        "Create New Discount Successfully",
        discount
      );
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
  updateDiscount: async (rawData) => {
    try {
      const discountId = rawData.params.discountId;
      const data = rawData.body;
      const checkExisted = await db.Discount.findOne({
        where: { id: discountId },
      });
      if (!checkExisted) {
        return apiReturns.error(400, "Discount is not existed");
      }
      const discount = await db.Discount.update(data, {
        where: { id: discountId },
      });
      return apiReturns.success(200, "Updated Discount Successfully");
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
  deleteDiscountById: async (id) => {
    const { count, rows } = await db.UserDiscount.findAndCountAll({
      where: { discountId: id },
    });
    if (count > 0) {
      await Promise.all(
        rows.map(async ({ id }) => {
          await deleteUserDiscountById(id);
        })
      );
    }
    await db.Discount.destroy({ where: { id } });
  },
  deleteDiscount: async (rawData) => {
    try {
      const discountId = rawData.params.discountId;
      const discount = await db.Discount.findOne({ where: { id: discountId } });
      if (!discount) {
        return apiReturns.error(404, "Discount is Not Found");
      }
      await db.Discount.destroy({ where: { id: discount.id } });
      return apiReturns.success(200, "Delete Discount Successfully");
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
};
