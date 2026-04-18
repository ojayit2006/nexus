import express from 'express';
import { 
  getPendingApplications, 
  approveApplication, 
  rejectApplication, 
  getStats 
} from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Role-based access for all admin routes
const adminRoles = ['hod', 'labassistant', 'librarian', 'principal', 'admin'];

// GET /api/admin/pending
router.get('/pending', verifyToken, requireRole(adminRoles), getPendingApplications);

// GET /api/admin/stats
router.get('/stats', verifyToken, requireRole(adminRoles), getStats);

// PATCH /api/admin/applications/:id/approve
router.patch('/applications/:id/approve', verifyToken, requireRole(adminRoles), approveApplication);

// PATCH /api/admin/applications/:id/reject
router.patch('/applications/:id/reject', verifyToken, requireRole(adminRoles), rejectApplication);

export default router;
