const express = require("express");
const router = express.Router();
const {
  getAllSchedulesController,
  createNewScheduleController,
  updateScheduleController,
  deleteScheduleController,
  finishedScheduleController,
} = require("../Controllers/schedule.controller");

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const { isAdmin } = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.get("/", getAllSchedulesController);
router.use(isAdmin);
router.post("/", createNewScheduleController);
router.patch("/:scheduleId", updateScheduleController);
router.delete("/:scheduleId", deleteScheduleController);
router.patch("/finish/:scheduleId", finishedScheduleController);

module.exports = router;
