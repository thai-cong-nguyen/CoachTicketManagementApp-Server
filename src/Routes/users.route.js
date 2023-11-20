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
router.get("/:userId", getCurrentUserAccountController);
router.post(
  "/changePassword/:userId",
  changePasswordCurrentUserAccountController
);
router.patch("/:userId", updateUserAccountController);

// Admin permission
router.use(isAdmin);
router.get("/", getAllUserAccountsController);
router.delete("/:userId", deleteUserAccountByIdController);

module.exports = router;
