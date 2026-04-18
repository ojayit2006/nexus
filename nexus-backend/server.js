require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARE ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5175',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// ── ROUTES ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Nexus Backend is running' });
});

// Define Routes
const authRoutes = require('./src/routes/auth');
const studentRoutes = require('./src/routes/students');
const clearanceRoutes = require('./src/routes/clearance');
const applicationsRoutes = require('./src/routes/applications');
const adminRoutes = require('./src/routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/clearance', clearanceRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler (Register LAST)
app.use(errorHandler);

// ── START SERVER ───────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
