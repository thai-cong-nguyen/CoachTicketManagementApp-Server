require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");

const getTicket = async ({ queries, ...query }) => {
  const reservations = await db.Reservation.findAndCountAll({
    where: query,
    ...queries,
    include: [
      {
        model: db.Schedule,
        as: "ScheduleData",
        include: [
          {
            model: db.Coach,
            as: "CoachData",
            include: [
              {
                model: db.CoachType,
                as: "CoachTypeData",
              },
            ],
          },
          {
            model: db.Route,
            as: "RouteData",
          },
          {
            model: db.Staff,
            as: "DriverData",
            attributes: ["id", "fullName", "phoneNumber", "gender"],
          },
          {
            model: db.Staff,
            as: "CoachAssistantData",
            attributes: ["id", "fullName", "phoneNumber", "gender"],
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
      },
      {
        model: db.Passenger,
        as: "PassengerData",
        attributes: ["id", "fullName", "phoneNumber", "gender"],
      },
      {
        model: db.UserAccount,
        as: "UserAccountData",
        attributes: ["id", "userName"],
      },
    ],
  });
  const tickets = reservations.rows.reduce((acc, curr) => {
    const found = acc.find(
      (item) =>
        item.ScheduleData.scheduleId === curr.ScheduleData.scheduleId &&
        item.UserAccountData.userId === curr.UserAccountData.userId &&
        new Date(item.reservationDate).getTime() ===
          new Date(curr.reservationDate).getTime()
    );
    if (found) {
      found.reservationId.push(curr.id);
      found.seatNumber.push(curr.seatNumber);
      found.PassengerData.push(curr.PassengerData);
      found.totalPrice += curr.ScheduleData.price;
    } else {
      acc.push({
        reservationId: [curr.id],
        reservationPhoneNumber: curr.reservationPhoneNumber,
        seatNumber: [curr.seatNumber],
        reservationDate: curr.reservationDate,
        paymentId: curr.paymentId,
        discountId: curr.discountId,
        status: curr.status,
        note: curr.note,
        totalPrice: curr.ScheduleData.price,
        status: curr.status,
        departurePoint: curr.departurePoint,
        arrivalPoint: curr.arrivalPoint,
        isShuttle: curr.isShuttle,
        isRoundTrip: curr.isRoundTrip,
        PassengerData: [curr.PassengerData],
        ScheduleData: curr.ScheduleData,
        UserAccountData: curr.UserAccountData,
      });
    }
    return acc;
  }, []);
  return tickets;
};

const getAllTickets = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    const tickets = await getTicket({ queries, ...query });
    return apiReturns.success(200, "Get Successfully", tickets);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const getAllTicketsOfUsers = async ({ page, limit, order, userId }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    queries.userId = userId;
    const currentTickets = await getTickets({ queries, status: "3" });
    const historyTickets = await getTickets({ queries, [Op.notIn]: ["3"] });
    const res = { current: currentTickets, history: historyTickets };
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const fillTicketInfo = async (rawData) => {
  try {
    const data = rawData.body;
    let res = [];
    await Promise.all(
      data.forEach(async (e) => {
        const passenger = await db.Passenger.findOrCreate({
          where: { phoneNumber: e.phoneNumber },
          default: e.passenger,
        });
        const reservation = await db.Reservation.update(
          { passengerId: passenger.id },
          { where: { id: e.id } }
        );
        res.push({ passenger, reservation });
      })
    );
    return apiReturns.success(200, "Fill Ticket Successful", res);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};
//
const changeSeatTicket = async (rawData) => {
  try {
    const data = rawData.body;
    const checkExistedReservation = await db.Reservation.findOne({
      where: {
        seatNumber: data.seatNumber,
      },
    });
    if (checkExistedReservation) {
      return apiReturns.validation("Seat is not available");
    }
    const reservation = await db.Reservation.update(
      { seatNumber: data.seatNumber },
      {
        where: {
          passengerId: data.passengerId,
        },
      }
    );
    return apiReturns.success(200, "Change Seat Successfully", reservation);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const chooseSeatTicket = async (rawData) => {
  try {
    const user = rawData.user;
    const { id, quantity, seatNumber } = rawData.body;
    let res = [{ quantity: quantity, rows: [] }];
    await db.transaction(async (t) => {
      seatNumber.forEach(async (number) => {
        const [reservation, created] = await db.Reservation.findOrCreate(
          {
            where: { seatNumber: number },
            default: { userId: user.id, scheduleId: id, seatNumber: number },
          },
          { transaction: t }
        );
        if (!created) {
          throw new Error("Seat is not Available");
        }
        res.rows.push(reservation);
      });
    });
    return apiReturns.success(200, "Choose Seat Successfully", res);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllTickets,
  fillTicketInfo,
  chooseSeatTicket,
  changeSeatTicket,
  getAllTicketsOfUsers,
};
