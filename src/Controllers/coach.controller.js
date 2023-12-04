const {
  createNewCoach,
  getAllCoaches,
  updateCoaches,
  deleteCoaches,
} = require("../Services/coach.service");

exports.createNewCoachController = async (req, res, next) => {
  try {
    const response = await createNewCoach(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.getAllCoachesController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllCoaches(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.updateCoachController = async (req, res, next) => {
  try {
    const response = await updateCoaches(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(error.message);
  }
};
exports.deleteCoachController = async (req, res, next) => {
  try {
    const response = await deleteCoaches(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(error.message);
  }
};
