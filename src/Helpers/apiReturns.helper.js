exports.success = (statusCode, message, data = {}) => {
  return {
    error: false,
    code: statusCode,
    message,
    data,
  };
};

exports.error = (statusCode, message) => {
  // List of common HTTP request code
  const codes = [200, 201, 400, 401, 404, 403, 422, 500];

  // Get matched code
  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    error: true,
    code: statusCode,
    message,
  };
};

exports.validation = (errors) => {
  return {
    error: true,
    code: 422,
    message: "Validation Errors",
    errors,
  };
};
