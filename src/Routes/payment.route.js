const express = require("express");
const router = express.Router();

const {
  paymentGatewayController,
  confirmPaymentController,
} = require("../Controllers/payment.controller");

const { verifyJWT } = require("../Middlewares/JWT.middleware");

router.use(verifyJWT);
router.post("/", paymentGatewayController);
router.patch("/confirm", confirmPaymentController);

module.exports = router;
