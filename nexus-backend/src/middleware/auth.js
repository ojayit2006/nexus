const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/helpers');

/**
 * Middleware to verify custom JWT token and attach user to request
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'No token provided or invalid format');
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return sendError(res, 500, 'Server configuration error');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user info to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expired');
    }
    return sendError(res, 401, 'Invalid token');
  }
};

/**
 * Middleware to restrict access based on user role
 * @param {Array<string>} allowedRoles - e.g. ['admin', 'department_head']
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return sendError(res, 401, 'User role not found in token');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, 'Forbidden: You do not have the required permissions');
    }

    next();
  };
};

const requireStudent = requireRole(['student']);
const requireAdmin = requireRole(['admin']);
const requireHOD = requireRole(['hod']);
const requirePrincipal = requireRole(['principal']);
const requireLabAssistant = requireRole(['labassistant']);

module.exports = {
  verifyToken,
  requireRole,
  requireStudent,
  requireAdmin,
  requireHOD,
  requirePrincipal,
  requireLabAssistant
};
