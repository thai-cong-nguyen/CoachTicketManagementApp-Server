const { requestRefreshToken } = require("../Services/auth.service");

exports.requestRefreshTokenController = async (req, res) => {
  try {
    const response = await requestRefreshToken(req, res);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};
