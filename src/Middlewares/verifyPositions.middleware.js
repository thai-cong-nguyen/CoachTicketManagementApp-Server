const { notAuthError } = require("../Middlewares/handleErrors.middleware");

exports.isManager = (req, res, next) => {
  const { position } = req.user;
  if (position.positionName !== "Manager") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};

exports.isDriver = (req, res, next) => {
  const { position } = req.user;
  if (position.positionName !== "Driver") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};

exports.isCoachAssistant = (req, res, next) => {
  const { position } = req.user;
  if (position.positionName !== "CoachAssistant") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};
