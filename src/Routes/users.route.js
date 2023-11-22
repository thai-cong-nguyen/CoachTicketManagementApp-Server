const express = require("express");
const multer = require("multer");
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
const upload = multer({ storage: multer.memoryStorage() });

// User Router
// private router
router.use(verifyJWT);
router.get("/currentAccount", getCurrentUserAccountController);
router.post(
  "/changePassword/:userId",
  changePasswordCurrentUserAccountController
);
router.patch("/:userId", upload.single("image"), updateUserAccountController);

// Admin permission
router.use(isAdmin);
router.get("/", getAllUserAccountsController);
router.delete("/:userId", deleteUserAccountByIdController);

module.exports = router;
