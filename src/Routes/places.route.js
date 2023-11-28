const express = require("express");
const router = express.Router();
const {
  getAllFromPlacesController,
  getAllToPlacesController,
  getAllPlacesController,
} = require("../Controllers/place.controller");

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const { isAdminOrStaff } = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.get("/from", getAllFromPlacesController);
router.get("/to", getAllToPlacesController);
router.get("/", getAllPlacesController);

module.exports = router;
