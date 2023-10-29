require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getUserDiscount = async ({
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
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    if (userId) queries.userId = userId;
    if (discountId) queries.discountId = discountId;
    const userDiscount = await db.UserDiscount.findAndCountAll({
      where: query,
      includes: [
        {
          model: db.Discount,
          as: "DiscountData",
        },
      ],
      ...queries,
    });
    return apiReturns.success(200, "Get Successfully", userDiscount);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const addDiscountForUser = async (rawData) => {
  try {
    let { users, discounts } = rawData.body;
    let userDiscounts = [];

    users.forEach((user) => {
      discounts.forEach((discount) => {
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
    return apiReturns.success(200, "Discounts are added to users successfully");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const updateUserDiscount = async (rawData) => {
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
};

const deleteUserDiscount = async (rawData) => {
  try {
    const ids = rawData.params.id;
    await Promise.all(
      ids.forEach(async (id) => {
        const checkExists = await db.UserDiscount.findOne({
          where: { id: id },
        });
        if (checkExists) {
          await ab.UserDiscount.destroy({ where: { id: id } });
        }
      })
    );
    return apiReturns.success(200, "Delete Discount of User Successfully");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getUserDiscount,
  addDiscountForUser,
  updateUserDiscount,
  deleteUserDiscount,
};
