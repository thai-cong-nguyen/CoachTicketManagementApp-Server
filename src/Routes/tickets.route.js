const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  getAllTicketsController,
  fillTicketInfoController,
  getAllTicketsOfUsersController,
  getUserTicketsHistoryController,
  bookingTicketController,
  cancelBookingTicketController,
  confirmBookingTicketController,
} = require("../Controllers/ticket.controller");

router.use(verifyJWT);
router.get("/", getAllTicketsController);
router.get("/user", getAllTicketsOfUsersController);
router.post("/fill-ticket-info", fillTicketInfoController);
router.get("/history", getUserTicketsHistoryController);
router.post("/create-booking", bookingTicketController);
router.delete("/cancel-booking", cancelBookingTicketController);
router.post("/confirm-ticket-info", confirmBookingTicketController);

module.exports = router;
