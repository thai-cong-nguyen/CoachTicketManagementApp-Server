const { loginUserAccount } = require("../Services/auth.service");

exports.loginNewUserAccountController = async (req, res, next) => {
  try {
    const response = await loginUserAccount(req, res);
    // if (!response.error) {
    //   res.cookie("RefreshToken", response.data.refresh_token, {
    //     httpOnly: true,
    //     maxAge: 20 * 100,
    //   });
    // }
    return res.status(response.code).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(error);
  }
};
