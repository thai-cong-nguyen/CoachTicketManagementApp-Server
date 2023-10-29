const express = require("express");
const router = express.Router();

const {
  registerNewUserAccountController,
} = require("../Controllers/registerUserAccount.controller");
const {
  loginNewUserAccountController,
} = require("../Controllers/loginUserAccount.controller");
const {
  requestRefreshTokenController,
} = require("../Controllers/refresh.controller");

router.post("/register", registerNewUserAccountController);
router.post("/login", loginNewUserAccountController);
router.post("/refresh", requestRefreshTokenController);

module.exports = router;
