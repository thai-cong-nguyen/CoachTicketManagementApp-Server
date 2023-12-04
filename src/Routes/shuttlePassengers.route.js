const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  getAllPassengerOfShuttleController,
  deleteShuttlePassengersController,
} = require("../Controllers/shuttlePassenger.controller");

const {
  isAdmin,
  isStaff,
  isManager,
  isAdminOrStaff,
} = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.get("/", getAllPassengerOfShuttleController);
router.use(isAdmin);
router.delete("/", deleteShuttlePassengersController);
module.exports = router;
