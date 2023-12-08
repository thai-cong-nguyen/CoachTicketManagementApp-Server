const {
  getAllRoutes,
  createNewRoute,
  updateRoute,
  deleteRoute,
} = require("../Services/route.service");

exports.getAllRoutesController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllRoutes(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send(error.message);
  }
};

exports.createNewRouteController = async (req, res, next) => {
  try {
    const response = await createNewRoute(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.updateRouteController = async (req, res, next) => {
  try {
    const response = await updateRoute(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send(error.message);
  }
};

exports.deleteRouteController = async (req, res, next) => {
  try {
    const response = await deleteRoute(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send(error.message);
  }
};
