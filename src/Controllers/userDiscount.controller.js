const {
  getUserDiscount,
  addDiscountForUser,
  updateUserDiscount,
  deleteUserDiscount,
} = require("../Services/userDiscount.service");

exports.getUserDiscountController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getUserDiscount(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.addDiscountForUserController = async (req, res, next) => {
  try {
    const response = await addDiscountForUser(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.updateUserDiscountController = async (req, res, next) => {
  try {
    const response = await updateUserDiscount(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.deleteUserDiscountController = async (req, res, next) => {
  try {
    const response = await deleteUserDiscount(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};
