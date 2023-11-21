require("dotenv").config({ path: "../../.env" });
const { Op } = require("sequelize");
const db = require("../Models/index");
const KEY_STRIPE = process.env.KEY_STRIPE;
const stripe = require("stripe")(KEY_STRIPE);
const apiReturns = require("../Helpers/apiReturns.helper");

const paymentGateway = async (rawData) => {
  try {
    const { discountId, userId, ...data } = rawData.body;
    if (discountId && userId) {
      const discount = await db.UserDiscount.findOne({
        where: { userId: userId, discountId: discountId, status: "0" },
      });
      if (!discount) {
        return apiReturns.error(404, "Discount is not available");
      }
      await db.UserDiscount.update(
        { status: "1" },
        { where: { userId: userId, discountId: discountId } }
      );
    }
    // Use an existing Customer ID if this is a returning customer.
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: "cus_OjlFGeYC9TMFbu" },
      { apiVersion: "2022-11-15" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.cost,
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

module.exports = { paymentGateway };
