const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  getAllShuttleRoutesController,
  createNewShuttleRouteController,
  updateShuttleRouteController,
  deleteShuttleRouteController,
} = require("../Controllers/shuttleRoute.controller");

const {
  isAdmin,
  isStaff,
  isManager,
  isAdminOrStaff,
} = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.get("/", getAllShuttleRoutesController);
router.use(isAdmin);
router.post("/", createNewShuttleRouteController);
router.patch("/:shuttleRouteId", updateShuttleRouteController);
router.delete("/:shuttleRouteId", deleteShuttleRouteController);
