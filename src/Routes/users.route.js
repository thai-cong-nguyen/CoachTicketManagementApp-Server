const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  getAllUserAccountsController,
  getCurrentUserAccountController,
  deleteUserAccountByIdController,
  updateUserAccountController,
  changePasswordCurrentUserAccountController,
  updateRewardPointController,
} = require("../Controllers/userAccount.controller");
const { verifyJWT } = require("../Middlewares/JWT.middleware");
const { notAuthError } = require("../Middlewares/handleErrors.middleware");
const {
  isAdmin,
  isStaff,
  isManager,
  isAdminOrStaff,
  isAdminOrManager,
} = require("../Middlewares/verifyRoles.middleware");
const upload = multer({ storage: multer.memoryStorage() });

// User Router
// private router
router.use(verifyJWT);
router.get("/currentAccount", getCurrentUserAccountController);
router.patch("/changePassword", changePasswordCurrentUserAccountController);
router.patch(
  "/:userId",
  (req, res, next) => {
    const { userId, role } = req.user;
    if (role.id !== "3" && userId !== req.params.userId) {
      return notAuthError("You are not allowed to access this", res);
    }
    next();
  },
  async (req, res, next) => {
    try {
      upload.single("image")(req, res, (err) => {
        if (err) {
          console.error("Multer error:", err);
          return res.status(400).send("Multer error: " + err.message);
        }
        next();
      });
    } catch (error) {
      console.error("Route error:", error);
      return res.status(500).send("Something went wrong");
    }
  },
  updateUserAccountController
);
router.patch("/updateRewardPoint", updateRewardPointController);
// Admin permission
router.get("/", isAdminOrManager, getAllUserAccountsController);
router.use(isAdmin);
router.delete("/:userId", deleteUserAccountByIdController);

module.exports = router;
