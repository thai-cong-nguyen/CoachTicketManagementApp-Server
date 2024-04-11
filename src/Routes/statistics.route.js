const express = require("express");
const router = express.Router();

const {
  getStatisticCustomersByScheduleController,
  getStatisticCustomersByMonthsController,
  getStatisticCustomersByYearsController,
  getStatisticsRevenueByScheduleController,
  getStatisticsRevenueByMonthsController,
  getStatisticsRevenueByYearsController,
  downloadStatisticCustomersByScheduleController,
  downloadStatisticCustomersByMonthsController,
  downloadStatisticCustomersByYearsController,
  downloadStatisticRevenueByScheduleController,
  downloadStatisticRevenueByMonthsController,
  downloadStatisticRevenueByYearsController,
} = require("../Controllers/statistic.controller");

const { verifyJWT } = require("../Middlewares/JWT.middleware");

const {
  isAdmin,
  isStaff,
  isManager,
  isAdminOrStaff,
} = require("../Middlewares/verifyRoles.middleware");

router.use(verifyJWT);
router.use(isAdmin);
router.get("/customer/schedule", getStatisticCustomersByScheduleController);
router.get("/customer/months/", getStatisticCustomersByMonthsController);
router.get("/customer/years/", getStatisticCustomersByYearsController);
router.get("/revenue/schedule", getStatisticsRevenueByScheduleController);
router.get("/revenue/months", getStatisticsRevenueByMonthsController);
router.get("/revenue/years", getStatisticsRevenueByYearsController);
router.get(
  "/customer/schedule/download",
  downloadStatisticCustomersByScheduleController
);
router.get(
  "/customer/months/download",
  downloadStatisticCustomersByMonthsController
);
router.get(
  "/customer/years/download",
  downloadStatisticCustomersByYearsController
);
router.get(
  "/revenue/schedule/download",
  downloadStatisticRevenueByScheduleController
);
router.get(
  "/revenue/months/download",
  downloadStatisticRevenueByMonthsController
);
router.get(
  "/revenue/years/download",
  downloadStatisticRevenueByYearsController
);

module.exports = router;
