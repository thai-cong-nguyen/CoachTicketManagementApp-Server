const express = require("express");
const router = express.Router();

const {
  getAllDiscountsController,
  createNewDiscountController,
  updateDiscountController,
  deleteDiscountController,
} = require("../Controllers/discount.controller");

const { verifyJWT } = require("../Middlewares/JWT.middleware");

router.use(verifyJWT);
router.get("/", getAllDiscountsController);
router.post("/", createNewDiscountController);
router.patch("/:discountId", updateDiscountController);
router.delete("/:discountId", deleteDiscountController);

module.exports = router;
