const {
  getAllStaffs,
  updateStaff,
  createNewStaff,
  deleteStaff,
  getWorkOfStaff,
} = require("../Services/staff.service");

exports.getAllStaffsController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllStaffs(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};
exports.deleteStaffsByIdController = async (req, res, next) => {
  try {
    const response = await deleteStaff(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};
exports.updateStaffsControllers = async (req, res, next) => {
  try {
    const response = await updateStaff(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};
exports.createNewStaffControllers = async (req, res, next) => {
  try {
    const response = await createNewStaff(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};
exports.getWorkOfStaffController = async (req, res, next) => {
  try {
    const response = await getWorkOfStaff(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};
