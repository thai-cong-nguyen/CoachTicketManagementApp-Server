const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  getAllTicketsController,
  fillTicketInfoController,
  chooseSeatTicketController,
  changeSeatTicketController,
} = require("../Controllers/ticket.controller");

router.use(verifyJWT);
router.get("/", getAllTicketsController);
router.post("/choose-seat", chooseSeatTicketController);
router.post("/fill-ticket-info", fillTicketInfoController);
router.patch("/change-seat", changeSeatTicketController);

module.exports = router;
