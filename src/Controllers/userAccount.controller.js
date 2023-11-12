const {
  getAllUserAccounts,
  getCurrentUserAccount,
  deleteUserAccountById,
  updateUserAccountById,
  changePasswordCurrentUserAccount,
  resetPassword,
} = require("../Services/user.service");
const { isEmptyObject } = require("../Helpers/checking.helper");

exports.getCurrentUserAccountController = async (req, res, next) => {
  try {
    const response = await getCurrentUserAccount(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

exports.getAllUserAccountsController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllUserAccounts(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

exports.deleteUserAccountByIdController = async (req, res, next) => {
  try {
    const response = await deleteUserAccountById(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

exports.updateUserAccountController = async (req, res, next) => {
  try {
    const response = await updateUserAccountById(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

exports.changePasswordCurrentUserAccountController = async (req, res, next) => {
  try {
    const response = await changePasswordCurrentUserAccount(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

exports.resetPasswordController = async (req, res, next) => {
  try {
    const response = await resetPassword(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};
