const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  getAllShuttleController,
  createNewShuttleController,
  updateShuttleController,
  deleteShuttleController,
} = require("../Controllers/shuttle.controller");

const {
  isAdmin,
  isStaff,
  isManager,
  isAdminOrStaff,
} = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.get("/", getAllShuttleController);
router.use(isAdmin);
router.post("/", createNewShuttleController);
router.patch("/:shuttleId", updateShuttleController);
router.delete("/:shuttleId", deleteShuttleController);
