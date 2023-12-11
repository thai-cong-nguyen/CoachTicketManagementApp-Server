const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  getAllTicketsController,
  getAllTicketsOfUsersController,
  getUserTicketsHistoryController,
  bookingTicketController,
  cancelBookingTicketController,
  confirmBookingTicketController,
  acceptTicketController,
  cancelTicketController,
  scanTicketController,
} = require("../Controllers/ticket.controller");
const { isAdminOrManager } = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.get("/", getAllTicketsController);
router.get("/user", getAllTicketsOfUsersController);
router.get("/history", getUserTicketsHistoryController);
router.post("/create-booking", bookingTicketController);
router.post("/cancel-booking", cancelBookingTicketController);
router.post("/confirm-ticket-info", confirmBookingTicketController);
router.patch("/cancel", cancelTicketController);
router.patch("/scan", scanTicketController);
router.use(isAdminOrManager);
router.patch("/accept", acceptTicketController);

module.exports = router;
