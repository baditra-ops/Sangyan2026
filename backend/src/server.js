require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { redisClient } = require('./config/redis');
const eventRoutes = require('./routes/eventRoutes');
const { startWorker, stopWorker } = require('./workers/behaviourWorker');
const { initWebSocketServer, getWebSocketStatus, closeWebSocketServer } = require('./services/websocketService');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

// Core Middlewares - Dynamic origin reflection to support credentials and prevent CORS failure
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server) or any client origin
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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
  const wsStatus = getWebSocketStatus();
  res.status(200).json({
    status: 'ok',
    service: 'pause-backend',
    redis: redisClient.status,
    websocket: wsStatus.status,
    connectedClients: wsStatus.connectedClients,
    timestamp: new Date().toISOString(),
    uptime: Number(process.uptime().toFixed(2)),
  });
});

// Event Ingestion Routes
app.use('/events', eventRoutes);

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

// Create Shared HTTP Server for Express and WebSockets
const server = http.createServer(app);

// Initialize WebSocket Service on /ws
initWebSocketServer(server);

// Start HTTP Server
server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 PAUSE Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  console.log(`⚡ WebSocket Server: ws://localhost:${PORT}/ws`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('====================================================');

  // Connect to Redis
  redisClient.connect().catch((err) => {
    console.warn('[Redis] Connection notice:', err.message);
  });

  // Start Behaviour Worker for investor event stream
  startWorker().catch((err) => {
    console.error('[Worker Startup Error]', err.message);
  });
});

// Graceful Shutdown
const handleShutdown = async (signal) => {
  console.log(`\n[${signal}] Initiating graceful shutdown...`);

  // Stop Behaviour Worker
  try {
    await stopWorker();
  } catch (workerErr) {
    console.warn('[Worker] Error stopping worker:', workerErr.message);
  }

  // Close WebSocket Server
  try {
    await closeWebSocketServer();
  } catch (wsErr) {
    console.warn('[WS] Error closing WebSocket server:', wsErr.message);
  }

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
