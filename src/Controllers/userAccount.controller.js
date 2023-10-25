const {
  getAllUserAccounts,
  getCurrentUserAccount,
  deleteUserAccountById,
  updateUserAccountById,
  changePassword,
} = require("../Services/user.service");
const { isEmptyObject } = require("../Helpers/checking.helper");

exports.getCurrentUserAccountController = async (req, res, next) => {
  try {
    const response = await getCurrentUserAccount(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.getAllUserAccountsController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllUserAccounts(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.deleteUserAccountByIdController = async (req, res, next) => {
  try {
    const response = await deleteUserAccountById(req);
    return res.status(response.code).send(response);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.updateUserAccountController = async (req, res, next) => {
  try {
    const response = await updateUserAccountById(req);
    return res.status(response.code).send(response);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.changePasswordCurrentUserAccountController = async (req, res, next) => {
  try {
    const response = await changePassword(req);
    return res.status(response.code).send(response);
  } catch (error) {
    return res.status(400).send(error);
  }
};
