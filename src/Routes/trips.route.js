const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  getAllTripsController,
  getSeatTripController,
} = require("../Controllers/trip.controller");

router.use(verifyJWT);
router.get("/", getAllTripsController);
router.get("/seats/:id", getSeatTripController);

module.exports = router;
