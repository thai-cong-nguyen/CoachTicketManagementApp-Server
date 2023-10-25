const express = require("express");
const router = express.Router();

const {
  getAllStaffsController,
  deleteStaffsByIdController,
  updateStaffsControllers,
} = require("../Controllers/staff.controller");

// Staff Router
router.get("/", getAllStaffsController);
router.delete("/:id", deleteStaffsByIdController);
router.patch("/:id", updateStaffsControllers);

module.exports = router;
