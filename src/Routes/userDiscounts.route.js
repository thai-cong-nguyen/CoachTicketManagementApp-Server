const express = require("express");
const router = express.Router();

const {
  getUserDiscountController,
  addDiscountForUserController,
  updateUserDiscountController,
  deleteUserDiscountController,
} = require("../Controllers/userDiscount.controller");

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  isAdmin,
  isStaff,
  isManager,
  isAdminOrStaff,
} = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.get("/", getUserDiscountController);
router.post("/", addDiscountForUserController);
router.patch("/:id", updateUserDiscountController);
router.delete("/:userId", deleteUserDiscountController);

module.exports = router;
