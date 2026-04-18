import express from 'express';
import { submit, myStatus, history } from '../controllers/applicationsController.js';
import { verifyToken, requireStudent } from '../middleware/auth.js';

const router = express.Router();

// POST /api/applications/submit
router.post('/submit', verifyToken, requireStudent, submit);

// GET /api/applications/my-status
router.get('/my-status', verifyToken, requireStudent, myStatus);

// GET /api/applications/history
router.get('/history', verifyToken, requireStudent, history);

export default router;
