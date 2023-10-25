const { registerNewUserAccount } = require("../Services/auth.service");

exports.registerNewUserAccountController = (req, res, next) => {
  registerNewUserAccount(req)
    .then((response) => {
      if (response.error) {
        return res.status(response.code).send(response.errors);
      }
      return res.status(response.code).send(response.message);
    })
    .catch((error) => {
      return res.status(error.code).send(error.errors);
    });
};
