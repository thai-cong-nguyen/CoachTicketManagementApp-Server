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
const { logoutAccountController } = require("../Controllers/logout.controller");
const { verifyJWT } = require("../Middlewares/JWT.middleware");

router.post("/register", registerNewUserAccountController);
router.post("/login", loginNewUserAccountController);
router.use(verifyJWT);
router.post("/refresh", requestRefreshTokenController);
router.delete("/logout", logoutAccountController);

module.exports = router;
