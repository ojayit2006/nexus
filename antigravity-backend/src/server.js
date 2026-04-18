import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import logger from './utils/logger.js';
import rateLimiter from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import { supabaseAdmin } from '../config/supabase.js';

// Route Imports
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true 
}));

// Request Parsing
app.use(express.json());

// Rate Limiting
app.use(rateLimiter);

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    const { error } = await supabaseAdmin.from('profiles').select('count', { count: 'exact', head: true }).limit(1);
    
    if (error) throw error;

    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(), 
      supabase: 'connected' 
    });
  } catch (error) {
    logger.warn(`Health check Supabase error: ${error.message}`);
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(), 
      supabase: 'unreachable' 
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Antigravity Server running on port ${PORT}`);
});
