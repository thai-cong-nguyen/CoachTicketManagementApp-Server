const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");

const {
  getAllStaffsController,
  deleteStaffsByIdController,
  updateStaffsControllers,
  createNewStaffControllers,
  getWorkOfStaffController,
} = require("../Controllers/staff.controller");

const {
  isAdmin,
  isStaff,
  isManager,
  isAdminOrStaff,
} = require("../Middlewares/verifyRoles.middleware");

// Staff Router
router.use(verifyJWT);
router.get("/", getAllStaffsController);
router.use("/works", isStaff, getWorkOfStaffController);
router.use(isAdmin);
router.post("/", createNewStaffControllers);
router.delete("/:id", deleteStaffsByIdController);
router.patch("/:id", updateStaffsControllers);

module.exports = router;
