const {
  getAllCoachTypes,
  createNewCoachType,
} = require("../Services/coachType.service");
exports.getAllCoachTypesController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllCoachTypes(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.createNewCoachTypesController = async (req, res, next) => {
  try {
    const response = await createNewCoachType(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};
