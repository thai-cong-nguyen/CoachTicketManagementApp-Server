const { notAuthError } = require("../Middlewares/handleErrors.middleware");

exports.isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role.id !== "3") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};
exports.isStaff = (req, res, next) => {
  const { role } = req.user;
  if (role.id !== "2") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};
exports.isAdminOrStaff = (req, res, next) => {
  const { role } = req.user;
  if (role.id !== "3" && role.id !== "2") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};
exports.isAdminOrManager = (req, res, next) => {
  const { role, position } = req.user;
  if (role.id !== "3" && role.id !== "2") {
    return notAuthError("You are not allowed to access this", res);
  } else if (role.id === "2" && position.id !== "4") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};
