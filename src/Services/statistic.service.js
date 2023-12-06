require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { getPrice } = require("../Patterns/strategies/price.patterns");

const getStatisticCustomersBySchedule = async (rawData) => {
  try {
    const schedules = await db.Schedule.findAndCountAll({
      where: { status: "1" },
      attributes: ["id"],
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
        const amountOfCustomers = await db.Reservation.count({
          where: { scheduleId: schedule.id, status: "1" },
          distinct: true,
          col: "passengerId",
        });
        res[schedule.id] = amountOfCustomers;
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
      const startDate = new Date(
        year ? year : new Date().getFullYear(),
        month - 1,
        1
      );
      const endDate = new Date(
        year ? year : new Date().getFullYear(),
        month,
        0
      );
      const amountOfCustomers = await db.Reservation.count({
        where: {
          [Op.and]: [
            db.Sequelize.where(db.Sequelize.col("reservationDate"), {
              [Op.gte]: startDate,
              [Op.lt]: endDate,
            }),
            { status: "1" },
          ],
        },
        distinct: true,
        col: "passengerId",
      });
      res[month] = amountOfCustomers;
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
            db.Sequelize.where(
              db.Sequelize.fn(
                "EXTRACT",
                db.Sequelize.literal('YEAR FROM "reservationDate"')
              ),
              year ? year : new Date().getFullYear()
            ),
          ],
          status: "1",
        },
        distinct: true,
        col: "passengerId",
      });
      res[year] = amountOfCustomers;
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
      where: { status: "1" },
      attributes: ["id", "price"],
    });
    let res = {};
    if (schedules.count <= 0) {
      throw new Error("No data found for Trips");
    }
    await Promise.all(
      schedules.rows.map(async (schedule) => {
        if (!res.hasOwnProperty(schedule)) {
          res[schedule.id] = 0;
        }
        const reservations = await db.Reservation.findAndCountAll({
          where: { scheduleId: schedule.id, status: "1" },
          include: [{ model: db.Discount, as: "DiscountData" }],
        });
        console.log(reservations);
        if (reservations.count > 0) {
          await Promise.all(
            reservations.rows.map((reservation) => {
              res[schedule.id] += reservation.discountId
                ? getPrice(
                    {
                      percentDiscount: reservation.DiscountData.value,
                      originalPrice: schedule.price,
                    },
                    "discount"
                  )
                : getPrice({ originalPrice: schedule.price }, "default");
            })
          );
        }
      })
    );
    return apiReturns.success(200, "Get Revenue By Schedule Successfully", res);
  } catch (error) {
    console.error(error);
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
          status: "1",
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
          res[month] += reservation.discountId
            ? getPrice(
                {
                  percentDiscount: reservation.DiscountData.value,
                  originalPrice: reservation.ScheduleData.price,
                },
                "discount"
              )
            : getPrice(
                { originalPrice: reservation.ScheduleData.price },
                "default"
              );
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
          status: "1",
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
          res[year] += reservation.discountId
            ? getPrice(
                {
                  percentDiscount: reservation.DiscountData.value,
                  originalPrice: reservation.ScheduleData.price,
                },
                "discount"
              )
            : getPrice(
                { originalPrice: reservation.ScheduleData.price },
                "default"
              );
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
