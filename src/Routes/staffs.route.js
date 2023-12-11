const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");

const {
  getAllStaffsController,
  deleteStaffsByIdController,
  createNewStaffControllers,
  getWorkOfStaffController,
} = require("../Controllers/staff.controller");
const {
  uploadImageMiddleware,
} = require("../Middlewares/uploadImage.middleware");
const {
  isAdmin,
  isStaff,
  isManager,
  isAdminOrStaff,
  isAdminOrManager,
} = require("../Middlewares/verifyRoles.middleware");

// Staff Router
router.use(verifyJWT);
router.get("/", getAllStaffsController);
router.use("/works", isAdminOrManager, getWorkOfStaffController);
router.use(isAdmin);
router.post("/", uploadImageMiddleware, createNewStaffControllers);
router.delete("/:staffId", deleteStaffsByIdController);

module.exports = router;
