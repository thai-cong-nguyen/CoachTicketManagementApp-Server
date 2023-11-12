const {
  loginUserAccount,
  logoutAccount,
  requestRefreshToken,
  registerNewUserAccount,
  resetPassword,
  checkEmailOrPhoneNumberExisted,
} = require("../Services/auth.service");

exports.loginNewUserAccountController = async (req, res, next) => {
  try {
    const response = await loginUserAccount(req, res);
    return res.status(response.code).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error);
  }
};

exports.logoutAccountController = async (req, res, next) => {
  try {
    const response = await logoutAccount(req, res);
    return res.status(response.code).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

exports.requestRefreshTokenController = async (req, res) => {
  try {
    const response = await requestRefreshToken(req, res);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

exports.registerNewUserAccountController = (req, res, next) => {
  registerNewUserAccount(req)
    .then((response) => {
      return res.status(response.code).send(response);
    })
    .catch((error) => {
      return res.status(500).send(error.message);
    });
};

exports.resetPasswordController = async (req, res, next) => {
  try {
    const response = await resetPassword(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

exports.checkEmailOrPhoneNumberExistedController = async (req, res, next) => {
  try {
    const response = await checkEmailOrPhoneNumberExisted(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};
