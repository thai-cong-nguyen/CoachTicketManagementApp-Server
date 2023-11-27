const express = require("express");
const router = express.Router();

const {
  getStatisticCustomersByScheduleController,
  getStatisticCustomersByMonthsController,
  getStatisticCustomersByYearsController,
  getStatisticsRevenueByScheduleController,
  getStatisticsRevenueByMonthsController,
  getStatisticsRevenueByYearsController,
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

module.exports = router;
