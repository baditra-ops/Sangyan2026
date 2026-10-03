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
 * Sanitizes Redis URL if the user accidentally copied CLI prefixes (e.g. `redis-cli --tls -u ...`),
 * wrapping quotes, or needs TLS for Upstash.
 */
const sanitizeRedisUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  let url = rawUrl.trim();

  // Strip wrapping quotes
  if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1).trim();
  }

  // Extract URL if full CLI string was pasted (e.g. `redis-cli --tls -u redis://...`)
  const cliMatch = url.match(/-u\s+(rediss?:\/\/[^\s'"]+)/);
  if (cliMatch) {
    url = cliMatch[1];
  } else if (url.includes('redis://') || url.includes('rediss://')) {
    const urlMatch = url.match(/(rediss?:\/\/[^\s'"]+)/);
    if (urlMatch) {
      url = urlMatch[1];
    }
  }

  // Upstash cloud endpoints enforce TLS (`rediss://`)
  if (url.includes('upstash.io') && url.startsWith('redis://')) {
    url = url.replace('redis://', 'rediss://');
  }

  return url;
};

/**
 * Factory function to create a new Redis client instance
 * (useful when separate pub/sub or consumer connections are needed)
 */
const createRedisClient = (customOptions = {}) => {
  const options = { ...redisConfig, ...customOptions };
  const cleanUrl = sanitizeRedisUrl(process.env.REDIS_URL);

  const client = cleanUrl
    ? new Redis(cleanUrl, {
        retryStrategy: redisConfig.retryStrategy,
        maxRetriesPerRequest: null,
        lazyConnect: true,
        ...(cleanUrl.startsWith('rediss://') ? { tls: { rejectUnauthorized: false } } : {}),
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
