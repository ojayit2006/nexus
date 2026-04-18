const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All routes here require authentication
router.use(verifyToken);

// GET /api/students/me - Get own profile
router.get('/me', studentController.getMyProfile);

// GET /api/students - Get all students (Restricted to non-student roles)
router.get('/', requireRole(['admin', 'hod', 'principal']), studentController.getAllProfiles);

module.exports = router;
