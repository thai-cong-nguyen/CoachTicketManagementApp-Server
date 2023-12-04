require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

module.exports = {
  getUserDiscount: async ({
    page,
    limit,
    order,
    userId,
    discountId,
    ...query
  }) => {
    try {
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const pageLimit = +limit || +process.env.PAGINATION_LIMIT;
      queries.offset = offset * pageLimit;
      queries.limit = pageLimit;
      if (order) queries.order = order;
      if (userId) query.userId = userId;
      if (discountId) query.discountId = discountId;
      const userDiscount = await db.UserDiscount.findAndCountAll({
        where: query,
        ...queries,
        include: [
          {
            model: db.Discount,
            as: "DiscountData",
          },
        ],
      });
      return apiReturns.success(200, "Get Successfully", userDiscount);
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
  addDiscountForUser: async (rawData) => {
    try {
      let { userId, discountId } = rawData.body;
      let userDiscounts = [];

      userId.forEach((user) => {
        discountId.forEach((discount) => {
          let obj = {};
          obj["userId"] = user;
          obj["discountId"] = discount;
          userDiscounts.push(obj);
        });
      });
      await Promise.all(
        userDiscounts.map(async (userDiscount) => {
          await db.UserDiscount.findOrCreate({
            where: userDiscount,
            default: userDiscount,
          });
        })
      );
      return apiReturns.success(
        200,
        "Discounts are added to users successfully"
      );
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
  updateUserDiscount: async (rawData) => {
    try {
      const { userId, discountId, status } = rawData.body;
      const userDiscount = await db.UserDiscount.findOne({
        where: { userId: userId, discountId: discountId },
      });
      if (!userDiscount) {
        return apiReturns.validation("Something went wrong");
      }
      await db.UserAccount.update(
        { status: status },
        { where: { id: userDiscount.id } }
      );
      return apiReturns.success(200, "Updated Successfully");
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
  deleteUserDiscountById: async (id) => {
    await db.UserDiscount.destroy({ where: { id: id } });
  },
  deleteUserDiscount: async (rawData) => {
    try {
      const userId = rawData.params.userId;
      const ids = rawData.body.id;
      await Promise.all(
        ids.map(async (id) => {
          const checkExists = await db.UserDiscount.findOne({
            where: { id: id, userId: userId },
          });
          if (checkExists) {
            await db.UserDiscount.destroy({ where: { id: id } });
          }
        })
      );
      return apiReturns.success(200, "Delete Discount of User Successfully");
    } catch (error) {
      console.error(error.message);
      return apiReturns.error(400, error.message);
    }
  },
};
