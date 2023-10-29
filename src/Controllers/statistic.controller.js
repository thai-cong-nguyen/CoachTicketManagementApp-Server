const {
  getStatisticCustomersBySchedule,
  getStatisticCustomersByMonths,
  getStatisticCustomersByYears,
  getStatisticsRevenueBySchedule,
  getStatisticsRevenueByMonths,
  getStatisticsRevenueByYears,
} = require("../Services/statistic.service");

exports.getStatisticCustomersByScheduleController = async (req, res) => {
  try {
    const response = await getStatisticCustomersBySchedule(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.getStatisticCustomersByMonthsController = async (req, res) => {
  try {
    const query = res.query;
    const response = await getStatisticCustomersByMonths(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.getStatisticCustomersByYearsController = async (req, res) => {
  try {
    const query = req.query;
    const response = await getStatisticCustomersByYears(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.getStatisticsRevenueByScheduleController = async (req, res) => {
  try {
    const response = await getStatisticsRevenueBySchedule(req);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.getStatisticsRevenueByMonthsController = async (req, res) => {
  try {
    const query = req.query;
    const response = await getStatisticsRevenueByMonths(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.getStatisticsRevenueByYearsController = async (req, res) => {
  try {
    const query = req.query;
    const response = await getStatisticsRevenueByYears(query);
    return res.status(response.code).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};
