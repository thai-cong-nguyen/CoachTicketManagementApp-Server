const {
  getAllShuttle,
  createNewShuttle,
  updateShuttle,
  deleteShuttle,
} = require("../Services/shuttle.service");

module.exports = {
  getAllShuttleController: async (req, res) => {
    try {
      const query = req.query;
      const response = await getAllShuttle(query);
      return res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  },
  createNewShuttleController: async (req, res) => {
    try {
      const response = await createNewShuttle(req);
      return res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  },
  updateShuttleController: async (req, res) => {
    try {
      const response = await updateShuttle(req);
      return res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  },
  deleteShuttleController: async (req, res) => {
    try {
      const response = await deleteShuttle(req);
      return res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  },
};
