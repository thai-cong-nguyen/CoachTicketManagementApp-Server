const {
  getAllDiscounts,
  createNewDiscount,
  updateDiscount,
  deleteDiscount,
} = require("../Services/discount.service");

exports.getAllDiscountsController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllDiscounts(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.createNewDiscountController = async (req, res, next) => {
  try {
    const response = await createNewDiscount(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.updateDiscountController = async (req, res, next) => {
  try {
    const response = await updateDiscount(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.deleteDiscountController = async (req, res, next) => {
  try {
    const response = await deleteDiscount(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};
