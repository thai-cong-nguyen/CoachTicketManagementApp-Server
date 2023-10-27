const { loginUserAccount } = require("../Services/auth.service");

exports.loginNewUserAccountController = async (req, res, next) => {
  try {
    const { response, refresh_token } = await loginUserAccount(req);
    console.log(response);
    if (!response.error) {
      res.cookie("RefreshToken", refresh_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
    }
    return res.status(response.code).send(response);
  } catch (error) {
    return res.status(400).send(error);
  }
};
