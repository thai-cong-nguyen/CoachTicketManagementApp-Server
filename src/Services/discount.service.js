require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getAllDiscounts = async ({
  page,
  limit,
  order,
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
    if (discountId) queries.discountId = discountId;
    const discounts = await db.Discount.findAndCountAll({
      where: query,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      ...queries,
    });
    return apiReturns.success(200, "Get Successfully", discounts);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const createNewDiscount = async (rawData) => {
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
};

const updateDiscount = async (rawData) => {
  try {
    const id = rawData.params.id;
    const data = rawData.body;
    const checkExisted = await db.Discount.findOne({ where: { id: id } });
    if (!checkExisted) {
      return apiReturns.error(400, "Discount is not existed");
    }
    const discount = await db.Discount.update({ data }, { where: { id: id } });
    return apiReturns.success(200, "Updated Discount Successfully", discount);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const deleteAllUserDiscountsByDiscountId = async (discountId) => {
  const userDiscount = await db.UserDiscount.findAndCountAll({
    where: { discountId: discountId },
  });
  if (userDiscount.count === 0) {
    await db.Discount.destroy({ where: { id: discountId } });
  }
  await Promise.all(
    userDiscount.rows.forEach(async (item) => {
      await db.UserDiscount.destroy({ where: { id: item.id } });
    })
  );
};

const deleteDiscount = async (rawData) => {
  try {
    const id = rawData.params.id;
    const discount = await db.Discount.findOne({ where: { id: id } });
    if (!discount) {
      return apiReturns.error(400, "Discount is not existed");
    }
    await deleteAllUserDiscountsByDiscountId(id);
    return apiReturns.success(200, "Delete Discount Successfully");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllDiscounts,
  createNewDiscount,
  updateDiscount,
  deleteDiscount,
};
