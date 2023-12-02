/**
 * Sale off when user use the discount
 * @param {*} originalPrice
 * @returns
 */
function discountPrice({ percentDiscount, originalPrice }) {
  return originalPrice - originalPrice * percentDiscount;
}

/**
 * Default price
 * @param {*} originalPrice
 * @returns
 */
function defaultPrice({ originalPrice }) {
  return originalPrice;
}

/**
 * Sale off when black friday
 * @param {*} originalPrice
 * @returns
 */
function blackFridayPrice({ originalPrice }) {
  return originalPrice * 0.9;
}

const getPriceStrategy = {
  default: defaultPrice,
  discount: discountPrice,
  blackFriday: blackFridayPrice,
};

function getPrice({ percentDiscount, originalPrice }, typePromotion) {
  return getPriceStrategy[typePromotion]({ percentDiscount, originalPrice });
}

module.exports = { getPrice };
