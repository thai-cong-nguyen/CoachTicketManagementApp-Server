const {
  getAllSchedules,
  createNewSchedule,
  deleteSchedule,
  updateSchedule,
  finishedSchedule,
} = require("../Services/schedule.service");
exports.getAllSchedulesController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllSchedules(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.createNewScheduleController = async (req, res, next) => {
  try {
    const response = await createNewSchedule(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.updateScheduleController = async (req, res, next) => {
  try {
    const response = await updateSchedule(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};

exports.deleteScheduleController = async (req, res, next) => {
  try {
    const response = await deleteSchedule(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};
exports.finishedScheduleController = async (req, res) => {
  try {
    const response = await finishedSchedule(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(error.message);
  }
};
