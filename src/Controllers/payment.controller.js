const {
  paymentGateway,
  confirmPayment,
} = require("../Services/payment.service");

exports.paymentGatewayController = async (req, res, next) => {
  try {
    const response = await paymentGateway(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send("Something went wrong");
  }
};

exports.confirmPaymentController = async (req, res, next) => {
  try {
    const response = await confirmPayment(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send("Something went wrong");
  }
};
