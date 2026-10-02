const { redisClient } = require('../config/redis');

// Configurable stream name, defaulting to 'investor-events'
const INVESTOR_EVENTS_STREAM = process.env.REDIS_STREAM_KEY || 'investor-events';

/**
 * Add a synthetic investor behavioural event to the Redis Stream.
 * Uses XADD to append field-value pairs for ingestion by future workers.
 *
 * @param {Object} event - Structured investor event
 * @param {string} event.eventId - Unique event ID
 * @param {string} event.investorId - Simulated investor ID
 * @param {string} event.eventType - Decision or action type (e.g. INVESTMENT_DECISION)
 * @param {number} [event.amount] - Investment amount
 * @param {string} event.timestamp - ISO 8601 timestamp
 * @param {Object} [event.metadata] - Optional supplementary context (non-sensitive synthetic data only)
 * @returns {Promise<string>} Stream entry ID returned by Redis (e.g., '1696245000000-0')
 */
const addInvestorEvent = async (event) => {
  const fields = [
    'eventId', String(event.eventId || ''),
    'investorId', String(event.investorId || ''),
    'eventType', String(event.eventType || ''),
    'amount', event.amount !== undefined && event.amount !== null ? String(event.amount) : '',
    'timestamp', String(event.timestamp || new Date().toISOString()),
  ];

  if (event.outcome) {
    fields.push('outcome', String(event.outcome));
  }

  if (event.metadata !== undefined && event.metadata !== null) {
    const metadataStr = typeof event.metadata === 'object'
      ? JSON.stringify(event.metadata)
      : String(event.metadata);
    fields.push('metadata', metadataStr);
  }

  // Append entry to Redis Stream using XADD
  const streamId = await redisClient.xadd(INVESTOR_EVENTS_STREAM, '*', ...fields);
  return streamId;
};

/**
 * Helper to inspect stream length (useful for tests and monitoring)
 */
const getStreamLength = async () => {
  return await redisClient.xlen(INVESTOR_EVENTS_STREAM);
};

/**
 * Helper to inspect recent stream entries
 * @param {number} count Number of recent entries to fetch
 */
const getRecentStreamEvents = async (count = 10) => {
  return await redisClient.xrevrange(INVESTOR_EVENTS_STREAM, '+', '-', 'COUNT', count);
};

module.exports = {
  INVESTOR_EVENTS_STREAM,
  addInvestorEvent,
  getStreamLength,
  getRecentStreamEvents,
};
