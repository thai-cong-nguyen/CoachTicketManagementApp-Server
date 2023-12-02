// Payment Strategy Interface
class PaymentStrategy {
  processPayment() {
    throw new Error("This payment method must be implemented");
  }
}

class CreditCardPaymentStrategy extends PaymentStrategy {
  processPayment() {
    console.log("Processing Credit Card Payment");
  }
}

class CashPaymentStrategy extends PaymentStrategy {
  processPayment() {
    console.log("Processing Cash Payment");
  }
}

// Context
class PaymentProcessor {
  constructor(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  setPaymentStrategy(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  processPayment() {
    if (this.paymentStrategy) {
      this.paymentStrategy.processPayment();
    } else {
      console.error("Payment strategy not set. Unable to process payment.");
      throw new Error("Unable to process payment.");
    }
  }
}

module.exports = {
  CreditCardPaymentStrategy,
  CashPaymentStrategy,
  PaymentProcessor,
};
