const express = require("express");
const router = express.Router();

const {
  registerNewUserAccountController,
} = require("../Controllers/registerUserAccount.controller");
const {
  loginNewUserAccountController,
} = require("../Controllers/loginUserAccount.controller");

router.post("/register", registerNewUserAccountController);
router.post("/login", loginNewUserAccountController);

module.exports = router;
