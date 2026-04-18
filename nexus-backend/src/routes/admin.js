const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All routes require verification and administrative roles
router.use(verifyToken);
router.use(requireRole(['admin', 'lab', 'hod', 'principal', 'labassistant']));

// GET /api/admin/queue
router.get('/queue', adminController.queue);

// PATCH /api/admin/applications/:applicationId/approve
router.patch('/applications/:applicationId/approve', adminController.approve);

// PATCH /api/admin/applications/:applicationId/reject
router.patch('/applications/:applicationId/reject', adminController.reject);

// GET /api/admin/stats
router.get('/stats', adminController.stats);

// GET /api/admin/search
router.get('/search', adminController.search);

module.exports = router;
