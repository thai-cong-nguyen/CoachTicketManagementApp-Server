const {
  getAllTickets,
  fillTicketInfo,
  changeSeatTicket,
  chooseSeatTicket,
  getAllTicketsOfUsers,
  getUserTicketsHistory,
  bookingTicket,
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

exports.changeSeatTicketController = async (req, res) => {
  try {
    const response = await changeSeatTicket(req);
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
    const response = await bookingTicket(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send("Something went wrong");
  }
};
