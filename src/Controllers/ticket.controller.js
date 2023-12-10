const {
  getAllTickets,
  fillTicketInfo,
  chooseSeatTicket,
  getAllTicketsOfUsers,
  getUserTicketsHistory,
  createBookingTicket,
  cancelBookingTicket,
  confirmBookingTicket,
  acceptTicket,
  cancelTicket,
  scanTicket,
} = require("../Services/ticket.service");

exports.getAllTicketsController = async (req, res) => {
  try {
    const query = req.query;
    const response = await getAllTickets(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send("Something went wrong");
  }
};

exports.fillTicketInfoController = async (req, res) => {
  try {
    const response = await fillTicketInfo(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send("Something went wrong");
  }
};

exports.chooseSeatTicketController = async (req, res) => {
  try {
    const response = await chooseSeatTicket(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send("Something went wrong");
  }
};

exports.getAllTicketsOfUsersController = async (req, res) => {
  try {
    const query = req.query;
    const response = await getAllTicketsOfUsers(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send("Something went wrong");
  }
};

exports.getUserTicketsHistoryController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getUserTicketsHistory(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send("Something went wrong");
  }
};

exports.bookingTicketController = async (req, res, next) => {
  try {
    const response = await createBookingTicket(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send("Something went wrong");
  }
};

exports.cancelBookingTicketController = async (req, res, next) => {
  try {
    const response = await cancelBookingTicket(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send("Something went wrong");
  }
};

exports.confirmBookingTicketController = async (req, res, next) => {
  try {
    const response = await confirmBookingTicket(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(404).send("Something went wrong");
  }
};

exports.acceptTicketController = async (req, res, next) => {
  try {
    const response = await acceptTicket(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(404).send("Something went wrong");
  }
};
exports.cancelTicketController = async (req, res, next) => {
  try {
    const response = await cancelTicket(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(404).send("Something went wrong");
  }
};
exports.scanTicketController = async (req, res, next) => {
  try {
    const response = await scanTicket(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(404).send("Something went wrong");
  }
};
