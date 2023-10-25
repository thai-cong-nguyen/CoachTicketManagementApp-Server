const { notAuthError } = require("../Middlewares/handleErrors.middleware");

exports.isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role.roleName !== "Admin") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};
exports.isStaff = (req, res, next) => {
  const { role } = req.user;
  if (role.roleName !== "Staff") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};
exports.isAdminOrStaff = (req, res, next) => {
  const { role } = req.user;
  if (role.roleName !== "Admin" && role.roleName !== "Staff") {
    return notAuthError("You are not allowed to access this", res);
  }
  next();
};
