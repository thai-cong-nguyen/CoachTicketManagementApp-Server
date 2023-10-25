const {
  getAllTickets,
  fillTicketInfo,
  changeSeatTicket,
} = require("../Services/ticket.service");

exports.getAllTicketsController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllTickets(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send("Something went wrong");
  }
};

exports.fillTicketInfoController = async (req, res, next) => {
  try {
    const response = await fillTicketInfo(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send("Something went wrong");
  }
};

exports.changeSeatTicketController = async (req, res, next) => {
  try {
    const response = await changeSeatTicket(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send("Something went wrong");
  }
};
