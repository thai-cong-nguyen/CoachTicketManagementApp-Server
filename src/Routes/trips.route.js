const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  getAllTripsController,
  getSeatTripController,
  getPopularTripController,
} = require("../Controllers/trip.controller");

router.use(verifyJWT);
router.get("/", getAllTripsController);
router.get("/seats/:id", getSeatTripController);
router.get("/popularTrip", getPopularTripController);

module.exports = router;
