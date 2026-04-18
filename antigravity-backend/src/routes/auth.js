import express from 'express';
import { login, refresh, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/refresh
router.post('/refresh', refresh);

// GET /api/auth/me
router.get('/me', verifyToken, getMe);

export default router;
