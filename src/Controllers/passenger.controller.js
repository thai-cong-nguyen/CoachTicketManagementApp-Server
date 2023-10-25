const {
  getAllPassengers,
  deletePassengersById,
  updatePassengersById,
} = require("../Services/passenger.service");

exports.getAllPassengersController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllPassengers(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error.message);
  }
};

exports.deletePassengersByIdController = async (req, res, next) => {
  try {
    const response = await deletePassengersById(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error.message);
  }
};
exports.updatePassengersController = async (req, res, next) => {
  try {
    const response = await updatePassengersById(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(200).send(error.message);
  }
};
