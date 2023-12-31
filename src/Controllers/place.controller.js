const {
  getAllFromPlaces,
  getAllToPlaces,
  getPlaceWithQuery,
} = require("../Services/place.service");

exports.getAllFromPlacesController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllFromPlaces(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.getAllToPlacesController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllToPlaces(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.getAllPlacesController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getPlaceWithQuery(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};
