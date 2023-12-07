require("dotenv").config({ path: "../../.env" });
const { Op } = require("sequelize");
const db = require("../Models/index");
const KEY_STRIPE = process.env.KEY_STRIPE;
const stripe = require("stripe")(KEY_STRIPE);
const apiReturns = require("../Helpers/apiReturns.helper");
const { getPrice } = require("../Patterns/strategies/price.patterns");

const paymentGateway = async (rawData) => {
  try {
    const { cost } = rawData.body;
    let paymentIntent = null,
      ephemeralKey = null;

    // Use an existing Customer ID if this is a returning customer.
    ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: "cus_OjlFGeYC9TMFbu" },
      { apiVersion: "2022-11-15" }
    );

    paymentIntent = await stripe.paymentIntents.create({
      amount: cost,
      currency: "VND",
      customer: "cus_OjlFGeYC9TMFbu",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return apiReturns.success(200, "Payment Successfully", {
      paymentIntent: await paymentIntent.client_secret,
      ephemeralKey: await ephemeralKey.secret,
      customer: "cus_OjlFGeYC9TMFbu",
      publishableKey:
        "pk_test_51MhlhmBI7ZTpJ5xJUpmkPO48Z8X6ckuQeAN1Rcm9d88jUNlJCawJ1MFKYxPbqZFUeURK3M7m3jhCjdI3KXksOwf100gFkPoIL5",
    });
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const confirmPayment = async (rawData) => {
  try {
    const { discountId, reservations } = rawData.body;
    const result = await db.sequelize.transaction(async (tx) => {
      if (discountId) {
        const discount = await db.UserDiscount.findOne({
          where: {
            userId: rawData.user.userId,
            discountId: discountId,
            status: "0",
          },
        });
        if (!discount) {
          throw new Error("Discount is not available");
        }
        await db.UserDiscount.update(
          { status: "1" },
          {
            where: { userId: rawData.user.userId, discountId: discountId },
            transaction: tx,
          }
        );
      }
      if (reservations) {
        reservations.forEach(async (reservationId) => {
          const reservation = await db.Reservation.findByPk(reservationId);
          if (!reservation) {
            throw new Error("Can not find reservation");
          } else {
            await db.Reservation.update(
              { status: "1" },
              { where: { id: reservation.id }, transaction: tx }
            );
          }
        });
      }
    });
    return apiReturns.success(200, "Payment Successfully");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

module.exports = { paymentGateway };
