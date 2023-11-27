const {
  getAllServices,
  createNewService,
  removeServiceOutOfCoach,
  addServiceForCoach,
} = require("../Services/service.service");

module.exports = {
  getAllServicesController: async (req, res) => {
    try {
      const query = req.query;
      const response = await getAllServices(query);
      return res.status(response.code).send(response);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Something went wrong");
    }
  },
  createNewServiceController: async (req, res) => {
    try {
      const response = await createNewService(req);
      return res.status(response.code).send(response);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Something went wrong");
    }
  },
  removeServiceOutOfCoachController: async (req, res) => {
    try {
      const query = req.query;
      const response = await removeServiceOutOfCoach(query);
      return res.status(response.code).send(response);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Something went wrong");
    }
  },
  addServiceForCoachController: async (req, res) => {
    try {
      const query = req.query;
      const response = await addServiceForCoach(query);
      return res.status(response.code).send(response);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Something went wrong");
    }
  },
};
