const userRouter = require("./users.route");
const authRouter = require("./auth.route");
const passengerRouter = require("./passengers.route");
const staffRouter = require("./staffs.route");
const routeRouter = require("./routes.route");
const scheduleRouter = require("./schedules.route");
const placesRouter = require("./places.route");
const tripRouter = require("./trips.route");
const coachRouter = require("./coaches.route");
const ticketRouter = require("./tickets.route");
const discountRouter = require("./discounts.route");
const userDiscountRouter = require("./userDiscounts.route");
const staffReportRouter = require("./staffReports.route");
const paymentRouter = require("./payment.route");
const statisticRouter = require("./statistics.route");
const uploadRouter = require("./upload.route");

const {
  internalServerError,
  notFoundError,
} = require("../Middlewares/handleErrors.middleware");
// const { otpLogin, verifyOTP } = require("../Controllers/otp.controller");

const apiWebRoutes = (app) => {
  // Entry Router
  app.use("/api/auth", authRouter);
  // User Router
  app.use("/api/users", userRouter);
  // Passenger Router
  app.use("/api/passengers", passengerRouter);
  // Staff Router
  app.use("/api/staffs", staffRouter);
  // Places Router
  app.use("/api/places", placesRouter);
  // Coaches Router
  app.use("/api/coaches", coachRouter);
  // Route Router
  app.use("/api/routes", routeRouter);
  // Schedule Router
  app.use("/api/schedules", scheduleRouter);
  // Trip Router
  app.use("/api/trips", tripRouter);
  // Ticket Router
  app.use("/api/tickets", ticketRouter);
  // Discount Router
  app.use("/api/discounts", discountRouter);
  // User Discount Router
  app.use("/api/userDiscounts", userDiscountRouter);
  // Staff Report Router
  app.use("/api/staffReports", staffReportRouter);
  // Payment Router
  app.use("/api/payment-sheet", paymentRouter);
  // Statistic Router
  app.use("/api/statistic", statisticRouter);
  // Upload Image Router
  app.use("/api/upload", uploadRouter);

  return app.use(notFoundError);
};

module.exports = apiWebRoutes;
