/**
 * Standard API Response Formatter
 */
const sendResponse = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Standard API Error Formatter
 */
const sendError = (res, statusCode, message = 'An error occurred', errors = null) => {
  const errorResponse = {
    success: false,
    message
  };
  if (errors) {
    errorResponse.errors = errors;
  }
  return res.status(statusCode).json(errorResponse);
};

module.exports = {
  sendResponse,
  sendError
};
