const {
  getStatisticCustomersBySchedule,
  getStatisticCustomersByMonths,
  getStatisticCustomersByYears,
  getStatisticsRevenueBySchedule,
  getStatisticsRevenueByMonths,
  getStatisticsRevenueByYears,
  downloadStatisticCustomersBySchedule,
  downloadStatisticCustomersByMonths,
  downloadStatisticCustomersByYears,
  downloadStatisticsRevenueBySchedule,
  downloadStatisticsRevenueByMonths,
  downloadStatisticsRevenueByYears,
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
    const query = req.query;
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

exports.downloadStatisticCustomersByScheduleController = async (req, res) => {
  try {
    const response = await downloadStatisticCustomersBySchedule(req);
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="statistic_customers_by_schedule.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return res.status(response.code).send(response.data);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.downloadStatisticCustomersByMonthsController = async (req, res) => {
  try {
    const year = req.query.year ? req.query.year : new Date().getFullYear();
    const response = await downloadStatisticCustomersByMonths({ year });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="statistic_customers_${year}.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return res.status(response.code).send(response.data);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.downloadStatisticCustomersByYearsController = async (req, res) => {
  try {
    const fromYear = req.query.fromYear
      ? req.query.fromYear
      : new Date().getFullYear();
    const toYear = req.query.toYear
      ? req.query.toYear
      : new Date().getFullYear();
    const response = await downloadStatisticCustomersByYears({
      fromYear,
      toYear,
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="statistic_customers_${fromYear}_${toYear}.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return res.status(response.code).send(response.data);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.downloadStatisticRevenueByScheduleController = async (req, res) => {
  try {
    const response = await downloadStatisticsRevenueBySchedule(req);
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="statistic_revenue_by_schedule.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return res.status(response.code).send(response.data);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.downloadStatisticRevenueByMonthsController = async (req, res) => {
  try {
    const year = req.query.year ? req.query.year : new Date().getFullYear();
    const response = await downloadStatisticsRevenueByMonths({ year });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="statistic_revenue_${year}.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return res.status(response.code).send(response.data);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};

exports.downloadStatisticRevenueByYearsController = async (req, res) => {
  try {
    const fromYear = req.query.fromYear
      ? req.query.fromYear
      : new Date().getFullYear();
    const toYear = req.query.toYear
      ? req.query.toYear
      : new Date().getFullYear();
    const response = await downloadStatisticsRevenueByYears({
      fromYear,
      toYear,
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="statistic_revenue_${fromYear}_${toYear}.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return res.status(response.code).send(response.data);
  } catch (error) {
    console.error(error);
    return res.status(404).send(error.message);
  }
};
