const createErrors = require("http-errors");

exports.badRequest = (err, res) => {
  const error = createErrors.BadRequest(err);
  return res.status(error.status).json({
    error: 1,
    mess: err.message,
  });
};

exports.internalServerError = (req, res, next) => {
  const error = createErrors.InternalServerError();
  return res.status(error.status).json({
    error: 1,
    mess: error.message,
  });
};

exports.notFoundError = (req, res, next) => {
  const error = createErrors.NotFound();
  return res.status(error.status).json({
    error: 1,
    mess: error.message,
  });
};

exports.notAuthError = (err, res) => {
  const error = createErrors.Unauthorized(err);
  return res.status(error.status).json({ error: 1, mess: error.message });
};
