require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const excelJS = require("exceljs");
const { Op, Sequelize, QueryTypes } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { getPrice } = require("../Patterns/strategies/price.patterns");

const getCustomersBySchedule = async (rawData) => {
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
  return res;
};

const getStatisticCustomersBySchedule = async (rawData) => {
  try {
    const res = await getCustomersBySchedule(rawData);
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const downloadStatisticCustomersBySchedule = async (rawData) => {
  try {
    const customerByScheduleData = await getCustomersBySchedule(rawData);

    // Export Excel
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Statistic Customers By Schedule");
    worksheet.columns = [
      {
        header: "No",
        key: "No",
        width: 10,
      },
      {
        header: "Schedule ID",
        key: "scheduleID",
        width: 10,
      },
      {
        header: "Route Name",
        key: "routeName",
        width: 30,
      },
      {
        header: "Departure Place",
        key: "departurePlace",
        width: 30,
      },
      {
        header: "Arrival Place",
        key: "arrivalPlace",
        width: 30,
      },
      {
        header: "Start Place",
        key: "startPlace",
        width: 50,
      },
      {
        header: "End Place",
        key: "endPlace",
        width: 50,
      },
      {
        header: "Total Customer",
        key: "totalCustomer",
        width: 20,
      },
    ];
    const promises = Object.entries(customerByScheduleData).map(
      async ([key, value], index) => {
        const schedule = await db.Schedule.findByPk(key, {
          include: [
            {
              model: db.Route,
              as: "RouteData",
            },
            {
              model: db.Places,
              as: "StartPlaceData",
            },
            {
              model: db.Places,
              as: "ArrivalPlaceData",
            },
          ],
        });
        const res = {
          No: index + 1,
          scheduleID: key,
          routeName: schedule.RouteData.routeName,
          departurePlace: schedule.RouteData.departurePlace,
          arrivalPlace: schedule.RouteData.arrivalPlace,
          startPlace: schedule.StartPlaceData.placeName,
          endPlace: schedule.ArrivalPlaceData.placeName,
          totalCustomer: value,
        };
        worksheet.addRow(res);
      }
    );

    // Wait for all promises to resolve
    await Promise.all(promises);
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    const exportFile = await workbook.xlsx.writeBuffer();
    return apiReturns.success(200, "Download Successfully", exportFile);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getCustomersByMonths = async ({ year }) => {
  let res = {};
  for (let month = 1; month <= 12; month++) {
    const startDate = new Date(
      year ? year : new Date().getFullYear(),
      month - 1,
      1
    );
    const endDate = new Date(year ? year : new Date().getFullYear(), month, 0);
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
  return res;
};

const getStatisticCustomersByMonths = async ({ year }) => {
  try {
    const res = await getCustomersByMonths({ year });
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

const downloadStatisticCustomersByMonths = async ({ year }) => {
  try {
    const customersByMonths = await getCustomersByMonths({ year });
    const currentYear = year ? year : new Date().getFullYear();
    // Export Excel
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      `Statistic Customers By Months In ${currentYear}`
    );
    worksheet.columns = [
      {
        header: "No",
        key: "No",
        width: 10,
      },
      {
        header: "Month",
        key: "month",
        width: 10,
      },
      {
        header: "Year",
        key: "year",
        width: 10,
      },
      {
        header: "Total Customer",
        key: "totalCustomer",
        width: 20,
      },
    ];
    Object.entries(customersByMonths).forEach(([key, value], index) => {
      const res = {
        No: index + 1,
        month: key,
        year: currentYear,
        totalCustomer: value,
      };
      worksheet.addRow(res);
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    const exportFile = await workbook.xlsx.writeBuffer();
    return apiReturns.success(200, "Download Successfully", exportFile);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getCustomersByYears = async ({ fromYear, toYear }) => {
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
  return res;
};

const getStatisticCustomersByYears = async ({ fromYear, toYear }) => {
  try {
    const res = await getCustomersByYears({ fromYear, toYear });
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

const downloadStatisticCustomersByYears = async ({ fromYear, toYear }) => {
  try {
    const customersByYears = await getCustomersByYears({ fromYear, toYear });
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      `Statistic Customers By Year From ${fromYear} To ${toYear}`
    );
    worksheet.columns = [
      {
        header: "No",
        key: "No",
        width: 10,
      },
      {
        header: "Year",
        key: "year",
        width: 10,
      },
      {
        header: "Total Customer",
        key: "totalCustomer",
        width: 20,
      },
    ];
    Object.entries(customersByYears).forEach(([key, value], index) => {
      const res = {
        No: index + 1,
        year: key,
        totalCustomer: value,
      };
      worksheet.addRow(res);
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    const exportFile = await workbook.xlsx.writeBuffer();
    return apiReturns.success(200, "Download Successfully", exportFile);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};
const getRevenueBySchedule = async (rawData) => {
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
  return res;
};

const getStatisticsRevenueBySchedule = async (rawData) => {
  try {
    const res = await getRevenueBySchedule(rawData);
    return apiReturns.success(200, "Get Revenue By Schedule Successfully", res);
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const downloadStatisticsRevenueBySchedule = async (rawData) => {
  try {
    const revenueBySchedule = await getRevenueBySchedule(rawData);

    // Export Excel
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Statistic Revenue By Schedule");
    worksheet.columns = [
      {
        header: "No",
        key: "No",
        width: 10,
      },
      {
        header: "Schedule ID",
        key: "scheduleID",
        width: 10,
      },
      {
        header: "Route Name",
        key: "routeName",
        width: 30,
      },
      {
        header: "Departure Place",
        key: "departurePlace",
        width: 30,
      },
      {
        header: "Arrival Place",
        key: "arrivalPlace",
        width: 30,
      },
      {
        header: "Start Place",
        key: "startPlace",
        width: 50,
      },
      {
        header: "End Place",
        key: "endPlace",
        width: 50,
      },
      {
        header: "Total Revenue",
        key: "totalRevenue",
        width: 20,
      },
    ];
    const promises = Object.entries(revenueBySchedule).map(
      async ([key, value], index) => {
        const schedule = await db.Schedule.findByPk(key, {
          include: [
            {
              model: db.Route,
              as: "RouteData",
            },
            {
              model: db.Places,
              as: "StartPlaceData",
            },
            {
              model: db.Places,
              as: "ArrivalPlaceData",
            },
          ],
        });
        const res = {
          No: index + 1,
          scheduleID: key,
          routeName: schedule.RouteData.routeName,
          departurePlace: schedule.RouteData.departurePlace,
          arrivalPlace: schedule.RouteData.arrivalPlace,
          startPlace: schedule.StartPlaceData.placeName,
          endPlace: schedule.ArrivalPlaceData.placeName,
          totalRevenue: parseInt(value),
        };
        worksheet.addRow(res);
      }
    );

    // Wait for all promises to resolve
    await Promise.all(promises);
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    const exportFile = await workbook.xlsx.writeBuffer();
    return apiReturns.success(200, "Download Successfully", exportFile);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getRevenueByMonth = async ({ year }) => {
  let res = {};
  for (let month = 1; month <= 12; month++) {
    res[month] = 0;
    const sql = `SELECT r.*, s.*, d.*
    FROM "Reservations" r
    JOIN "Schedules" s ON r."scheduleId"  = s.id
    join "Discounts" d on r."discountId" = d.id 
    WHERE EXTRACT(YEAR FROM r."reservationDate") = ${year} AND EXTRACT(MONTH FROM r."reservationDate") = ${month};
    `;
    const reservations = await db.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });
    if (reservations.length <= 0) {
      continue;
    }
    await Promise.all(
      reservations.map(async (reservation) => {
        res[month] += reservation.discountId
          ? getPrice(
              {
                percentDiscount: reservation.value,
                originalPrice: reservation.price,
              },
              "discount"
            )
          : getPrice({ originalPrice: reservation.price }, "default");
      })
    );
  }
  return res;
};

const getStatisticsRevenueByMonths = async ({ year }) => {
  try {
    const res = await getRevenueByMonth({ year });
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

const downloadStatisticsRevenueByMonths = async ({ year }) => {
  try {
    const revenueByMonths = await getRevenueByMonth({ year });
    const currentYear = year ? year : new Date().getFullYear();
    // Export Excel
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      `Statistic Revenue Months ${currentYear}`
    );
    worksheet.columns = [
      {
        header: "No",
        key: "No",
        width: 10,
      },
      {
        header: "Month",
        key: "month",
        width: 10,
      },
      {
        header: "Year",
        key: "year",
        width: 10,
      },
      {
        header: "Total Revenue",
        key: "totalRevenue",
        width: 20,
      },
    ];
    Object.entries(revenueByMonths).forEach(([key, value], index) => {
      const res = {
        No: index + 1,
        month: key,
        year: currentYear,
        totalRevenue: value,
      };
      worksheet.addRow(res);
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    const exportFile = await workbook.xlsx.writeBuffer();
    return apiReturns.success(200, "Download Successfully", exportFile);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getRevenueByYears = async ({ fromYear, toYear }) => {
  let res = {};
  if (fromYear > toYear) {
    const temp = fromYear;
    fromYear = toYear;
    toYear = temp;
  }
  if (toYear - fromYear > 15) {
    return apiReturns.validation("Over the maximum distance years");
  }
  let count = 0;
  for (let year = fromYear; year <= toYear; year++) {
    res[year] = 0;
    const sql = `SELECT r.*, s.*, d.*
    FROM "Reservations" r
    JOIN "Schedules" s ON r."scheduleId"  = s.id
    join "Discounts" d on r."discountId" = d.id 
    WHERE EXTRACT(YEAR FROM r."reservationDate") = ${year};
    `;
    const reservations = await db.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });
    if (reservations.length <= 0) {
      continue;
    }
    await Promise.all(
      reservations.map(async (reservation) => {
        res[year] += reservation.discountId
          ? getPrice(
              {
                percentDiscount: reservation.value,
                originalPrice: reservation.price,
              },
              "discount"
            )
          : getPrice({ originalPrice: reservation.price }, "default");
      })
    );
  }
  return res;
};

const getStatisticsRevenueByYears = async ({ fromYear, toYear }) => {
  try {
    const res = await getRevenueByYears({ fromYear, toYear });
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.log(error.message);
    return apiReturns.error(400, error.message);
  }
};

const downloadStatisticsRevenueByYears = async ({ fromYear, toYear }) => {
  try {
    const revenueByYears = await getRevenueByYears({ fromYear, toYear });
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Revenue ${fromYear}-${toYear}`);
    worksheet.columns = [
      {
        header: "No",
        key: "No",
        width: 10,
      },
      {
        header: "Year",
        key: "year",
        width: 10,
      },
      {
        header: "Total Revenue",
        key: "totalRevenue",
        width: 20,
      },
    ];
    Object.entries(revenueByYears).forEach(([key, value], index) => {
      const res = {
        No: index + 1,
        year: key,
        totalRevenue: value,
      };
      worksheet.addRow(res);
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    const exportFile = await workbook.xlsx.writeBuffer();
    return apiReturns.success(200, "Download Successfully", exportFile);
  } catch (error) {
    console.error(error.message);
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
  downloadStatisticCustomersBySchedule,
  downloadStatisticCustomersByMonths,
  downloadStatisticCustomersByYears,
  downloadStatisticsRevenueBySchedule,
  downloadStatisticsRevenueByMonths,
  downloadStatisticsRevenueByYears,
};
