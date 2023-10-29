const { registerNewUserAccount } = require("../Services/auth.service");

exports.registerNewUserAccountController = (req, res, next) => {
  registerNewUserAccount(req)
    .then((response) => {
      return res.status(response.code).send(response);
    })
    .catch((error) => {
      return res.status(400).send(error.message);
    });
};
