require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const issueRoutes = require('./routes/issueRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Core Middlewares
app.use(cors({
  origin: '*', // Allow frontend during hackathon development & demo
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger for easy debugging in terminal
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint (for deployment monitoring on Render/Railway)
app.get(['/', '/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'CivicPulse API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[Unhandled Error] ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 CivicPulse Backend is running on port ${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   - POST   http://localhost:${PORT}/api/issues/triage`);
  console.log(`   - GET    http://localhost:${PORT}/api/issues`);
  console.log(`   - POST   http://localhost:${PORT}/api/issues`);
  console.log(`   - PATCH  http://localhost:${PORT}/api/issues/:id/status`);
  console.log(`   - GET    http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

