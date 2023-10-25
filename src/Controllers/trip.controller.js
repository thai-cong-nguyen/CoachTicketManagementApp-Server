const { getAllTrips, getSeatTrip } = require("../Services/trip.service");

exports.getAllTripsController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllTrips(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.getSeatTripController = async (req, res, next) => {
  try {
    const response = await getSeatTrip(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};
