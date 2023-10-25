const express = require("express");
const router = express.Router();

const {
  getAllPassengersController,
  deletePassengersByIdController,
  updatePassengersController,
} = require("../Controllers/passenger.controller");
const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  isAdmin,
  isStaff,
  isAdminOrStaff,
} = require("../Middlewares/verifyRoles.middleware");
// private Router
router.use(verifyJWT);
router.get("/", getAllPassengersController);
router.delete("/:id", deletePassengersByIdController);
router.patch("/:id", updatePassengersController);

module.exports = router;
