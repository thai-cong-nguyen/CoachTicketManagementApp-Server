const {
  getAllShuttleRoutes,
  createNewShuttleRoute,
  updateShuttleRoute,
  deleteShuttleRoute,
} = require("../Services/shuttleRoute.service");

module.exports = {
  getAllShuttleRoutesController: async (req, res) => {
    try {
      const query = req.query;
      const response = await getAllShuttleRoutes(query);
      return res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  },
  createNewShuttleRouteController: async (req, res) => {
    try {
      const response = await createNewShuttleRoute(req);
      return res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  },
  updateShuttleRouteController: async (req, res) => {
    try {
      const response = await updateShuttleRoute(req);
      return res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  },
  deleteShuttleRouteController: async (req, res) => {
    try {
      const response = await deleteShuttleRoute(req);
      return res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  },
};
