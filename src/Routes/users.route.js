const express = require("express");
const router = express.Router();
const {
  getAllUserAccountsController,
  getCurrentUserAccountController,
  deleteUserAccountByIdController,
  updateUserAccountController,
  changePasswordCurrentUserAccountController,
} = require("../Controllers/userAccount.controller");
const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  isAdmin,
  isStaff,
  isManager,
  isAdminOrStaff,
} = require("../Middlewares/verifyRoles.middleware");

// User Router
// public router

// private router
router.use(verifyJWT);
router.get("/:id", getCurrentUserAccountController);
router.post("/changePassword/:id", changePasswordCurrentUserAccountController);

// Admin permission
router.use(isAdmin);
router.get("/", getAllUserAccountsController);
router.delete("/:id", deleteUserAccountByIdController);
router.patch("/:id", updateUserAccountController);

module.exports = router;
