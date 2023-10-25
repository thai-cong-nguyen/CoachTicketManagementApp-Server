const {
  getAllStaffs,
  updateStaff,
  deleteStaff,
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
