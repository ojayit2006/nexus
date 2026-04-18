const express = require('express');
const router = express.Router();
const applicationsController = require('../controllers/applicationsController');
const { verifyToken, requireStudent } = require('../middleware/auth');

// All routes require verification and student role
router.use(verifyToken);
router.use(requireStudent);

// POST /api/applications/submit
router.post('/submit', applicationsController.submit);

// GET /api/applications/my-status
router.get('/my-status', applicationsController.myStatus);

// GET /api/applications/history
router.get('/history', applicationsController.history);

module.exports = router;
