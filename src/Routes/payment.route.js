const express = require("express");
const router = express.Router();

const {
  paymentGatewayController,
} = require("../Controllers/payment.controller");

const { verifyJWT } = require("../Middlewares/JWT.middleware");

router.use(verifyJWT);
router.post("/", paymentGatewayController);

module.exports = router;
