const express = require("express");
const router = express.Router();

const { verifyJWT } = require("../Middlewares/JWT.middleware");
const {
  getAllTicketsController,
  fillTicketInfoController,
  chooseSeatTicketController,
  changeSeatTicketController,
  getAllTicketsOfUsersController,
} = require("../Controllers/ticket.controller");

router.use(verifyJWT);
router.get("/", getAllTicketsController);
router.get("/user", getAllTicketsOfUsersController);
router.post("/choose-seat", chooseSeatTicketController);
router.post("/fill-ticket-info", fillTicketInfoController);
router.patch("/change-seat", changeSeatTicketController);

module.exports = router;
