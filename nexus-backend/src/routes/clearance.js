const express = require('express');
const router = express.Router();
const clearanceController = require('../controllers/clearanceController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All routes here require authentication
router.use(verifyToken);

// GET /api/clearance/my-status - Get own application status
router.get('/my-status', clearanceController.getMyApplicationStatus);

// GET /api/clearance - Get all applications (Staff/Admin only)
router.get('/', requireRole(['admin', 'hod', 'principal', 'lab_assistant']), clearanceController.getAllApplications);

// PUT /api/clearance/:id/status - Update application status (Staff/Admin only)
router.put('/:id/status', requireRole(['admin', 'hod', 'principal', 'lab_assistant']), clearanceController.updateApplicationStatus);

module.exports = router;
