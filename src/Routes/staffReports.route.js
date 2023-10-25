const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");

const {
  getAllStaffReportsController,
  createNewStaffReportController,
  deleteStaffReportController,
} = require("../Controllers/staffReport.controller");

const {
  isAdmin,
  isStaff,
  isManager,
  isAdminOrStaff,
} = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.post("/", createNewStaffReportController);
router.use(isAdmin);
router.get("/", getAllStaffReportsController);
router.delete("/:id", deleteStaffReportController);

module.exports = router;
