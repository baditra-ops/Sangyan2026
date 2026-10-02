require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { redisClient } = require('./config/redis');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

// Core Middlewares
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lightweight request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root Information Route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'PAUSE — Real-Time Investor Behavioural Safety System',
    description: 'Behavioral safety layer for retail investor resilience (SANGYAN 2026)',
    status: 'running',
    healthCheck: '/health',
  });
});

// Health Check Endpoint (Required by prompt)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'pause-backend',
    redis: redisClient.status,
    timestamp: new Date().toISOString(),
    uptime: Number(process.uptime().toFixed(2)),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  });
});

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 PAUSE Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('====================================================');

  // Connect to Redis
  redisClient.connect().catch((err) => {
    console.warn('[Redis] Connection notice:', err.message);
  });
});

// Graceful Shutdown
const handleShutdown = async (signal) => {
  console.log(`\n[${signal}] Initiating graceful shutdown...`);
  server.close(() => {
    console.log('[HTTP] Server closed.');
  });

  try {
    if (redisClient.status === 'ready' || redisClient.status === 'connecting') {
      await redisClient.quit();
      console.log('[Redis] Client disconnected cleanly.');
    }
  } catch (err) {
    console.warn('[Redis] Error during disconnect:', err.message);
  }

  process.exit(0);
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

module.exports = { app, server };
