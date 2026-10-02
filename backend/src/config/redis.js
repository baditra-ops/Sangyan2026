const Redis = require('ioredis');
require('dotenv').config();

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy(times) {
    // Reconnect with backoff capped at 3000ms
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
  maxRetriesPerRequest: null, // Required for stream operations (XREAD/XREADGROUP)
  enableReadyCheck: true,
  lazyConnect: true, // Connect when required or explicitly invoked
};

/**
 * Factory function to create a new Redis client instance
 * (useful when separate pub/sub or consumer connections are needed)
 */
const createRedisClient = (customOptions = {}) => {
  const options = { ...redisConfig, ...customOptions };
  const client = process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL, {
        retryStrategy: redisConfig.retryStrategy,
        maxRetriesPerRequest: null,
        lazyConnect: true,
        ...customOptions,
      })
    : new Redis(options);

  client.on('connect', () => {
    console.log('[Redis] Connected successfully.');
  });

  client.on('ready', () => {
    console.log('[Redis] Connection is ready to use.');
  });

  client.on('error', (err) => {
    console.warn(`[Redis Notice] Connection issue: ${err.message}`);
  });

  client.on('close', () => {
    // Connection closed
  });

  return client;
};

// Singleton Redis client for general caching / stream appending
const redisClient = createRedisClient();

module.exports = {
  redisClient,
  createRedisClient,
  redisConfig,
};
