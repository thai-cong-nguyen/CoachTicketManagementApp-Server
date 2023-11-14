const express = require("express");
const router = express.Router();

const {
  registerNewUserAccountController,
  loginNewUserAccountController,
  requestRefreshTokenController,
  logoutAccountController,
  resetPasswordController,
  checkEmailOrPhoneNumberExistedController,
} = require("../Controllers/auth.controller");
const { verifyJWT } = require("../Middlewares/JWT.middleware");

router.post("/register", registerNewUserAccountController);
router.post("/login", loginNewUserAccountController);
router.post("/refresh", requestRefreshTokenController);
router.patch("/reset-password", resetPasswordController);
router.post(
  "/check-email-phone-number",
  checkEmailOrPhoneNumberExistedController
);
router.use(verifyJWT);
router.delete("/logout", logoutAccountController);

module.exports = router;
