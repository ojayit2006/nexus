const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error
  const logMessage = `${err.message} ${process.env.NODE_ENV !== 'production' ? err.stack : ''}`;
  logger.error(logMessage);

  // Handle Supabase-specific errors
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Duplicate entry' });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Handle JWT expiry
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Handle Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({ error: err.details[0].message });
  }

  // Default error
  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  return res.status(status).json({ error: message });
};

module.exports = errorHandler;
