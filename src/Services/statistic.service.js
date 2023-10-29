require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getStatisticCustomersBySchedule = async (rawData) => {
  try {
    const schedules = await db.Schedule.findAndCountAll({ attributes: ["id"] });
    let res = {};
    if (schedules.count <= 0) {
      return apiReturns.error(404, "No data found for Trips");
    }
    await Promise.all(
      schedules.rows.map(async (schedule) => {
        if (!res.hasOwnProperty(schedule)) {
          res[schedule] = 0;
        }
        const amountOfCustomers = await db.Reservation.count({
          where: { schedule: schedule.id, status: 2 },
          distinct: true,
          col: "passengerId",
        });
        res[schedule] = amountOfCustomers;
      })
    );
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getStatisticCustomersByMonths = async ({ year }) => {
  try {
    let res = {};
    for (let month = 1; month <= 12; month++) {
      const amountOfCustomers = await db.Reservation.count({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("MONTH", Sequelize.col("reservationDate")),
              month
            ),
            Sequelize.where(
              Sequelize.fn("YEAR", Sequelize.col("reservationDate")),
              year ? year : new Date().getFullYear()
            ),
          ],
          status: "2",
        },
        distinct: true,
        col: "passengerId",
      });
      res.month = amountOfCustomers;
    }
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getStatisticCustomersByYears = async ({ fromYear, toYear }) => {
  try {
    let res = {};
    if (fromYear > toYear) {
      const temp = fromYear;
      fromYear = toYear;
      toYear = temp;
    }
    if (toYear - fromYear > 15) {
      return apiReturns.validation("Over the maximum distance years");
    }
    for (let year = fromYear; year <= toYear; year++) {
      const amountOfCustomers = await db.Reservation.count({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("YEAR", Sequelize.col("reservationDate")),
              year ? year : new Date().getFullYear()
            ),
          ],
          status: "2",
        },
        distinct: true,
        col: "passengerId",
      });
      res.year = amountOfCustomers;
    }
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getStatisticsRevenueBySchedule = async (rawData) => {
  try {
    const schedules = await db.Schedule.findAndCountAll({
      attributes: ["id", "price"],
    });
    let res = {};
    if (schedules.count <= 0) {
      return apiReturns.error(404, "No data found for Trips");
    }
    await Promise.all(
      schedules.rows.map(async (schedule) => {
        if (!res.hasOwnProperty(schedule)) {
          res[schedule.id] = 0;
        }
        const reservations = await db.Reservation.findAndCountAll({
          where: { schedule: schedule.id, status: 2 },
          include: [{ model: db.Discount, as: "DiscountData" }],
        });
        await reservations.rows.map((reservation) => {
          res[schedule.id] +=
            schedule.price *
            (1 - (reservation.discountId ? reservation.DiscountData.value : 0));
        });
      })
    );
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getStatisticsRevenueByMonths = async ({ year }) => {
  try {
    let res = {};
    for (let month = 1; month <= 12; month++) {
      res[month] = 0;
      const reservations = await db.Reservation.findAndCountAll({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("MONTH", Sequelize.col("reservationDate")),
              month
            ),
            Sequelize.where(
              Sequelize.fn("YEAR", Sequelize.col("reservationDate")),
              year ? year : new Date().getFullYear()
            ),
          ],
          status: "2",
        },
        include: [
          { model: db.Schedule, as: "ScheduleData" },
          { model: db.Discount, as: "DiscountData" },
        ],
      });
      if (reservations.count <= 0) {
        continue;
      }
      await Promise.all(
        reservations.rows.map(async (reservation) => {
          res[month] +=
            reservation.ScheduleData.price *
            (1 - (reservation.discountId ? reservation.DiscountData.value : 0));
        })
      );
    }
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getStatisticsRevenueByYears = async ({ fromYear, toYear }) => {
  try {
    let res = {};
    if (fromYear > toYear) {
      const temp = fromYear;
      fromYear = toYear;
      toYear = temp;
    }
    if (toYear - fromYear > 15) {
      return apiReturns.validation("Over the maximum distance years");
    }
    for (let year = fromYear; year <= toYear; year++) {
      res[year] = 0;
      const reservations = await db.Reservation.findAndCountAll({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("YEAR", Sequelize.col("reservationDate")),
              year ? year : new Date().getFullYear()
            ),
          ],
          status: "2",
        },
        include: [
          { model: db.Schedule, as: "ScheduleData" },
          { model: db.Discount, as: "DiscountData" },
        ],
      });
      if (reservations.count <= 0) {
        continue;
      }
      await Promise.all(
        reservations.rows.map(async (reservation) => {
          res[month] +=
            reservation.ScheduleData.price *
            (1 - (reservation.discountId ? reservation.DiscountData.value : 0));
        })
      );
    }
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getStatisticCustomersBySchedule,
  getStatisticCustomersByMonths,
  getStatisticCustomersByYears,
  getStatisticsRevenueBySchedule,
  getStatisticsRevenueByMonths,
  getStatisticsRevenueByYears,
};
