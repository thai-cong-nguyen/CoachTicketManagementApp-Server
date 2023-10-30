const { logoutAccount } = require("../Services/auth.service");

exports.logoutAccountController = async (req, res, next) => {
  try {
    const response = await logoutAccount(req, res);
    return res.status(response.code).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(404).send(error.message);
  }
};
