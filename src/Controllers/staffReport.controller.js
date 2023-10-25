const {
  getAllStaffReports,
  createNewStaffReport,
  deleteStaffReport,
} = require("../Services/staffReport.service");

exports.getAllStaffReportsController = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getAllStaffReports(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(response);
  }
};

exports.createNewStaffReportController = async (req, res, next) => {
  try {
    const response = await createNewStaffReport(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(response);
  }
};

exports.deleteStaffReportController = async (req, res, next) => {
  try {
    const response = await deleteStaffReport(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(response);
  }
};
