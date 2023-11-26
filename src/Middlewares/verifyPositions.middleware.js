const { notAuthError } = require("../Middlewares/handleErrors.middleware");

exports.isManager = (req, res, next) => {
  const { position } = req.user;
  if (position.id !== "1") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};

exports.isDriver = (req, res, next) => {
  const { position } = req.user;
  if (position.id !== "2") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};

exports.isCoachAssistant = (req, res, next) => {
  const { position } = req.user;
  if (position.id !== "3") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};

exports.isSeller = (req, res, next) => {
  const { position } = req.user;
  if (position.id !== "1") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};
