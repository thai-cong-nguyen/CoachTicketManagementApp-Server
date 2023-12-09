require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { arraysAreEqual } = require("../Utils/compare.util");
const { remainingSlotOfSchedule } = require("./schedule.service");
const { countOfShuttlePassenger } = require("./shuttlePassenger.service");
const { listServiceNameForCoach } = require("./coach.service");

const filterReservationToTickets = async (reservations) => {
  const tickets = reservations.rows.reduce((acc, curr) => {
    const found = acc.find(
      (item) =>
        item.ScheduleData.scheduleId === curr.ScheduleData.scheduleId &&
        item.UserAccountData.userId === curr.UserAccountData.userId &&
        new Date(item.reservationDate).getTime() ===
          new Date(curr.reservationDate).getTime() &&
        item.isRoundTrip === curr.isRoundTrip
    );
    if (found) {
      found.reservationId.push(curr.id);
      found.seatNumber.push(curr.seatNumber);
      found.PassengerData.push(curr.PassengerData);
      found.totalPrice += parseInt(curr.ScheduleData.price);
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
        totalPrice: parseInt(curr.ScheduleData.price),
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

const getTickets = async ({ queries, reservationId, ...query }) => {
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
  const tickets = await filterReservationToTickets(reservations);
  // adding service of Coach, shuttle, roundTrip ticket in ticket
  await Promise.all(
    tickets.map(async (ticket) => {
      // Service
      const serviceOfCoach = await listServiceNameForCoach(
        ticket.ScheduleData.coachId
      );
      // Shuttle
      const shuttlePassenger = await db.ShuttlePassengers.findAll({
        where: {
          reservationId: {
            [Op.in]: ticket.reservationId,
          },
        },
        attributes: ["id", "reservationId", "shuttleRouteId"],
        include: [
          {
            model: db.ShuttleRoutes,
            as: "ShuttleRouteData",
            include: [
              {
                model: db.Shuttle,
                as: "ShuttleData",
                include: [{ model: db.Coach, as: "CoachData" }],
              },
            ],
          },
        ],
      });
      // RoundTrip ticket
      const queryRoundTripTicket = {};
      queryRoundTripTicket.isRoundTrip = true;
      queryRoundTripTicket.userId = ticket.UserAccountData.id;
      queryRoundTripTicket["$ScheduleData.RouteData.departurePlace$"] =
        ticket.ScheduleData.RouteData.arrivalPlace;
      queryRoundTripTicket["$ScheduleData.RouteData.arrivalPlace$"] =
        ticket.ScheduleData.RouteData.departurePlace;
      queryRoundTripTicket["$ScheduleData.StartPlaceData.placeName$"] =
        ticket.ScheduleData.ArrivalPlaceData.placeName;
      queryRoundTripTicket["$ScheduleData.ArrivalPlaceData.placeName$"] =
        ticket.ScheduleData.StartPlaceData.placeName;
      queryRoundTripTicket.reservationDate = ticket.reservationDate;
      const reservationsRoundTrip = await db.Reservation.findAndCountAll({
        where: queryRoundTripTicket,
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
      const ticketRoundTrip = await filterReservationToTickets(
        reservationsRoundTrip
      );
      // shuttle Round Trip
      const shuttlePassengerRoundTrip = await Promise.all(
        ticketRoundTrip.map(async (ticket) => {
          return await db.ShuttlePassengers.findAll({
            where: {
              reservationId: {
                [Op.in]: ticket.reservationId,
              },
            },
            attributes: ["id", "reservationId", "shuttleRouteId"],
            include: [
              {
                model: db.ShuttleRoutes,
                as: "ShuttleRouteData",
                include: [
                  {
                    model: db.Shuttle,
                    as: "ShuttleData",
                    include: [{ model: db.Coach, as: "CoachData" }],
                  },
                ],
              },
            ],
          });
        }, [])
      );
      ticket.ShuttleTicketData = shuttlePassenger;
      ticket.RoundTripTicketData = ticketRoundTrip;
      ticket.ShuttleTicketRoundTripData = shuttlePassengerRoundTrip;
      ticket.ScheduleData.CoachData.ServiceData = serviceOfCoach;
    })
  );
  // adding roundTrip ticket
  // const addingRoundTrip = tickets.map(async (ticket) => {});
  const result = reservationId
    ? tickets.filter((ticket) =>
        arraysAreEqual(ticket.reservationId, reservationId)
      )
    : tickets;
  return result;
};

const getAllTickets = async ({
  page,
  limit,
  order,
  userId,
  reservationId,
  ...query
}) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    if (userId) queries.userId = userId;
    const tickets = await getTickets({ queries, reservationId, ...query });
    return apiReturns.success(200, "Get Successfully", tickets);
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const getAllTicketsOfUsers = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    const currentTickets = await getTickets({
      queries,
      status: { [Op.in]: ["0", "1"] },
      ...query,
    });
    const historyTickets = await getTickets({
      queries,
      status: { [Op.notIn]: ["0", "1"] },
      ...query,
    });
    const res = { current: currentTickets, history: historyTickets };
    return apiReturns.success(200, "Get Successfully", res);
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const getUserTicketsHistory = async ({ page, limit, order, userId }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    queries.userId = userId;
    const historyTickets = await getTickets({
      queries,
      [Op.notIn]: ["2", "3"],
    });
    return apiReturns.success(200, "Get Successfully", historyTickets);
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const createBookingTicket = async (rawData) => {
  try {
    // data get from request's body && response for the client.
    const {
      scheduleId,
      seats,
      departurePoint,
      arrivalPoint,
      shuttle,
      roundTrip,
    } = rawData.body;
    console.log("Body: ", rawData.body);
    let reservations = [];
    let shuttlePassenger = [];
    let reservationsRoundTrip = [];
    let shuttlePassengerRoundTrip = [];
    // processing for booking.
    const result = await db.sequelize.transaction(
      { logging: console.log },
      async (tx) => {
        console.log("Create Booking Ticket Transaction started");
        try {
          const currentTime = new Date().toISOString();
          console.log("Current Time: " + currentTime);
          const schedule = await db.Schedule.findByPk(scheduleId, {
            transaction: tx,
          });
          if (!schedule) {
            throw new Error("Can not find schedule");
          }

          const remainingSlot = await remainingSlotOfSchedule(
            scheduleId,
            schedule.coachId
          );

          if (remainingSlot < seats.length) {
            throw new Error("Can not enough seats for booking");
          }

          await Promise.all(
            seats.map(async (seat) => {
              const [reservation, created] = await db.Reservation.findOrCreate({
                where: { scheduleId: scheduleId, seatNumber: seat },
                defaults: {
                  userId: rawData.user.userId,
                  scheduleId: scheduleId,
                  paymentId: "1",
                  seatNumber: seat,
                  reservationDate: currentTime,
                  departurePoint: departurePoint,
                  arrivalPoint: arrivalPoint,
                },
                transaction: tx,
              });
              if (!created) {
                throw new Error("Seat is not Available");
              } else {
                reservations.push(reservation);
              }
            })
          );
          // shuttle processing
          if (shuttle) {
            const shuttleRoute = await db.ShuttleRoutes.findOne({
              where: { id: shuttle.shuttleRouteId },
              include: [
                {
                  model: db.Shuttle,
                  as: "ShuttleData",
                  include: [
                    {
                      model: db.Coach,
                      as: "CoachData",
                    },
                  ],
                },
              ],
              transaction: tx,
            });
            if (!shuttleRoute) {
              throw new Error("Shuttle Route is not Available");
            }
            const remainingSlotShuttle =
              shuttleRoute.ShuttleData.CoachData.capacity -
              (await countOfShuttlePassenger(shuttleRoute.id));
            if (remainingSlotShuttle < shuttle.quantity) {
              throw new Error("Can not enough seats for shuttle");
            }
            await Promise.all(
              reservations.map(async (reservation) => {
                const [shuttlePassengerFound, created] =
                  await db.ShuttlePassengers.findOrCreate({
                    where: {
                      shuttleRouteId: shuttle.shuttleRouteId,
                      reservationId: reservation.id,
                    },
                    defaults: {
                      shuttleRouteId: shuttle.shuttleRouteId,
                      reservationId: reservation.id,
                    },
                    transaction: tx,
                  });
                if (!created) {
                  throw new Error("This passenger is booking Shuttle");
                } else {
                  shuttlePassenger.push(shuttlePassengerFound);
                }
              })
            );
          }
          // roundTrip processing
          if (roundTrip) {
            const scheduledRoundTrip = await db.Schedule.findByPk(
              roundTrip.scheduleId,
              { transaction: tx }
            );
            if (!scheduledRoundTrip) {
              throw new Error("Can not find schedule for round Trip");
            }

            const remainingSlotOfRoundTrip = await remainingSlotOfSchedule(
              roundTrip.scheduleId,
              scheduledRoundTrip.coachId
            );

            if (remainingSlotOfRoundTrip < roundTrip.seats.length) {
              throw new Error("Can not enough seats of Round Trip for booking");
            }

            await Promise.all(
              roundTrip.seats.map(async (seat) => {
                const [reservationRoundTrip, created] =
                  await db.Reservation.findOrCreate({
                    where: {
                      scheduleId: roundTrip.scheduleId,
                      seatNumber: seat,
                    },
                    defaults: {
                      userId: rawData.user.userId,
                      scheduleId: roundTrip.scheduleId,
                      seatNumber: seat,
                      paymentId: "1",
                      reservationDate: currentTime,
                      departurePoint: roundTrip.departurePoint,
                      arrivalPoint: roundTrip.arrivalPoint,
                      isRoundTrip: true,
                    },
                    transaction: tx,
                  });
                if (!created) {
                  throw new Error("Seat for Round Trip is not Available");
                } else {
                  reservationsRoundTrip.push(reservationRoundTrip);
                }
              })
            );

            if (roundTrip.shuttle) {
              const shuttleRoute = await db.ShuttleRoutes.findOne({
                where: { id: roundTrip.shuttle.shuttleRouteId },
                include: [
                  {
                    model: db.Shuttle,
                    as: "ShuttleData",
                    include: [
                      {
                        model: db.Coach,
                        as: "CoachData",
                      },
                    ],
                  },
                ],
                transaction: tx,
              });
              if (!shuttleRoute) {
                throw new Error("Shuttle Route is not Available");
              }
              const remainingSlotShuttle =
                shuttleRoute.ShuttleData.CoachData.capacity -
                (await countOfShuttlePassenger(shuttleRoute.id));
              if (remainingSlotShuttle < roundTrip.shuttle.quantity) {
                throw new Error("Can not enough seats for shuttle");
              }
              await Promise.all(
                reservationsRoundTrip.map(async (reservation) => {
                  const [shuttlePassengerRoundTripFound, created] =
                    await db.ShuttlePassengers.findOrCreate({
                      where: {
                        shuttleRouteId: roundTrip.shuttle.shuttleRouteId,
                        reservationId: reservation.id,
                      },
                      defaults: {
                        shuttleRouteId: roundTrip.shuttle.shuttleRouteId,
                        reservationId: reservation.id,
                      },
                      transaction: tx,
                    });
                  if (!created) {
                    throw new Error("This passenger is booking Shuttle");
                  } else {
                    shuttlePassengerRoundTrip.push(
                      shuttlePassengerRoundTripFound
                    );
                  }
                })
              );
            }
          }
        } catch (error) {
          console.error("Error in transaction:", error);
          throw new Error("Error in transaction: " + error.message);
        }
        console.log("Create Booking Ticket Transaction completed");
      }
    );

    return apiReturns.success(200, "Created Booking Ticket Successfully", {
      reservations,
      reservationsRoundTrip,
      shuttlePassenger,
      shuttlePassengerRoundTrip,
    });
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const cancelBookingTicket = async (rawData) => {
  try {
    const { reservations, reservationsRoundTrip } = rawData.body;
    const result = await db.sequelize.transaction(
      { logging: console.log },
      async (tx) => {
        console.log("Cancel Booking Ticket Transaction started");
        try {
          if (!reservations) {
            throw new Error("Reservations data is not available");
          }
          await Promise.all(
            reservations.map(async (reservationId) => {
              const reservation = await db.Reservation.findByPk(reservationId);
              if (!reservation) {
                throw new Error("Can not find reservation");
              } else {
                await db.Reservation.destroy({
                  where: { id: reservation.id },
                  transaction: tx,
                });
              }
            })
          );
          if (reservationsRoundTrip) {
            await Promise.all(
              reservationsRoundTrip.map(async (reservationId) => {
                const reservationRoundTrip = await db.Reservation.findByPk(
                  reservationId
                );
                if (!reservationRoundTrip) {
                  throw new Error("Can not find reservation for round trip");
                } else {
                  await db.Reservation.destroy({
                    where: { id: reservationRoundTrip.id },
                    transaction: tx,
                  });
                }
              })
            );
          }
        } catch (error) {
          console.error("Error in transaction:", error);
          throw new Error("Error in transaction: " + error.message);
        }
        console.log("Cancel Booking Ticket Transaction completed");
      }
    );
    return apiReturns.success(
      200,
      "Canceled Booking Ticket Successfully",
      result
    );
  } catch (error) {
    console.log(error);
    return apiReturns.error(400, error.message);
  }
};

const confirmBookingTicket = async (rawData) => {
  try {
    const {
      passengers,
      reservations,
      passengerRoundTrip,
      reservationsRoundTrip,
      paymentId,
      discountId,
    } = rawData.body;
    const result = await db.sequelize.transaction(async (tx) => {
      console.log("Transaction started");
      try {
        if (passengers.length !== reservations.length) {
          throw new Error("Fill full passenger for reservation");
        }
        if (discountId) {
          await db.UserDiscount.update(
            { status: true },
            { where: { discountId: discountId } }
          );
        }
        await Promise.all(
          passengers.map(async (passengerInfo, index) => {
            const [passenger, created] = await db.Passenger.findOrCreate({
              where: { phoneNumber: passengerInfo.phoneNumber },
              defaults: passengerInfo,
              transaction: tx,
            });
            const info = {
              passengerId: passenger.id,
              paymentId: paymentId,
              reservationPhoneNumber: passengerInfo.phoneNumber,
            };
            if (discountId) {
              info.discountId = discountId;
            }
            const reservation = await db.Reservation.update(info, {
              where: { id: reservations[index] },
              transaction: tx,
            });
          })
        );
        if (passengerRoundTrip && reservationsRoundTrip) {
          await Promise.all(
            passengerRoundTrip.map(async (passengerInfo, index) => {
              const [passenger, created] = await db.Passenger.findOrCreate({
                where: { phoneNumber: passengerInfo.phoneNumber },
                defaults: passengerInfo,
                transaction: tx,
              });
              const info = {
                passengerId: passenger.id,
                paymentId: paymentId,
                reservationPhoneNumber: passengerInfo.phoneNumber,
              };
              if (discountId) {
                info.discountId = discountId;
              }
              const reservation = await db.Reservation.update(info, {
                where: { id: reservationsRoundTrip[index] },
                transaction: tx,
              });
            })
          );
        }
      } catch (error) {
        console.error("Error in transaction:", error);
        throw new Error("Error in transaction: " + error.message);
      }
      console.log("Transaction completed");
    });
    return apiReturns.success(200, "Filled Information Successfully", result);
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};
const acceptTicket = async (rawData) => {
  try {
    const { reservations, reservationsRoundTrip } = rawData.body;

    await db.sequelize.transaction(async (tx) => {
      await Promise.all(
        reservations.map(async (data) => {
          const reservation = await db.Reservation.findByPk(data);
          if (!reservation) {
            throw new Error("Could not find reservation");
          }
          await db.Reservation.update(
            { status: "1" },
            { where: { id: reservation.id }, transaction: tx }
          );
        })
      );
      if (reservationsRoundTrip) {
        await Promise.all(
          reservationsRoundTrip.map(async (data) => {
            const reservationRoundTrip = await db.Reservation.findByPk(data);
            if (!reservationRoundTrip) {
              throw new Error("Could not find reservation of Round Trip");
            }
            await db.Reservation.update(
              { status: "1" },
              { where: { id: reservationRoundTrip.id }, transaction: tx }
            );
          })
        );
      }
    });
    return apiReturns.success(200, "Accepted Ticket Successfully");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};
const cancelTicket = async (rawData) => {
  try {
    const {
      reservations,
      reservationsRoundTrip,
      shuttlePassenger,
      shuttlePassengerRoundTrip,
    } = rawData.body;
    console.log("Body: ", rawData.body);
    await db.sequelize.transaction(async (tx) => {
      await Promise.all(
        reservations.map(async (data) => {
          const reservation = await db.Reservation.findByPk(data);
          if (!reservation) {
            throw new Error("Could not find reservation");
          }
          await db.Reservation.update(
            { status: "2" },
            { where: { id: reservation.id }, transaction: tx }
          );
        })
      );
      if (reservationsRoundTrip) {
        await Promise.all(
          reservationsRoundTrip.map(async (data) => {
            const reservationRoundTrip = await db.Reservation.findByPk(data);
            if (!reservationRoundTrip) {
              throw new Error("Could not find reservation of Round Trip");
            }
            await db.Reservation.update(
              { status: "2" },
              { where: { id: reservationRoundTrip.id }, transaction: tx }
            );
          })
        );
      }
      if (shuttlePassenger) {
        await Promise.all(
          shuttlePassenger.map(async (shuttlePassengerId) => {
            const shuttlePassengerFound = await db.ShuttlePassengers.findByPk(
              shuttlePassengerId
            );
            if (!shuttlePassengerFound) {
              throw new Error("Can not find shuttle for passenger");
            } else {
              await db.ShuttlePassengers.destroy({
                where: { id: shuttlePassengerFound.id },
                transaction: tx,
              });
            }
          })
        );
      }
      if (shuttlePassengerRoundTrip) {
        await Promise.all(
          shuttlePassengerRoundTrip.map(async (shuttlePassengerId) => {
            const shuttlePassengerRoundTripFound =
              await db.ShuttlePassengers.findByPk(shuttlePassengerId);
            if (!shuttlePassengerRoundTripFound) {
              throw new Error(
                "Can not find shuttle of round trip for passenger"
              );
            } else {
              await db.ShuttlePassengers.destroy({
                where: { id: shuttlePassengerRoundTripFound.id },
                transaction: tx,
              });
            }
          })
        );
      }
    });

    return apiReturns.success(200, "Canceled Ticket Successfully");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllTickets,
  getAllTicketsOfUsers,
  getUserTicketsHistory,
  createBookingTicket,
  cancelBookingTicket,
  confirmBookingTicket,
  acceptTicket,
  cancelTicket,
};
