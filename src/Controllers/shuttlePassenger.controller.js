const {
  getAllPassengerOfShuttle,
  deleteShuttlePassengers,
} = require("../Services/shuttlePassenger.service");

module.exports = {
  getAllPassengerOfShuttleController: async (req, res) => {
    try {
      const query = req.query;
      const response = await getAllPassengerOfShuttle(query);
      return res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  },
  deleteShuttlePassengersController: async (req, res) => {
    try {
      const response = await deleteShuttlePassengers(req);
      return res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  },
};
