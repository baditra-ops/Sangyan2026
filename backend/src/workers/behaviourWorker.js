const { createRedisClient } = require('../config/redis');
const { INVESTOR_EVENTS_STREAM } = require('../services/streamService');
const { updateInvestorState } = require('../services/investorState');
const { evaluateBehaviour } = require('../services/riskEngine');
const { broadcastAssessment } = require('../services/websocketService');

// Configurable Consumer Group & Worker Name
const CONSUMER_GROUP = process.env.REDIS_CONSUMER_GROUP || 'behaviour-workers';
const CONSUMER_NAME = process.env.WORKER_NAME || `behaviour-worker-${process.pid}-${Math.random().toString(36).substring(2, 7)}`;

// Dedicated Redis client instance for blocking stream reads
const workerRedis = createRedisClient();

let isRunning = false;

/**
 * Initializes the Redis Consumer Group for the worker.
 * Idempotent: Handles BUSYGROUP error gracefully if the group already exists.
 */
const initConsumerGroup = async () => {
  try {
    // XGROUP CREATE <stream> <group> $ MKSTREAM
    await workerRedis.xgroup('CREATE', INVESTOR_EVENTS_STREAM, CONSUMER_GROUP, '$', 'MKSTREAM');
    console.log(`[WORKER] Created consumer group '${CONSUMER_GROUP}' on stream '${INVESTOR_EVENTS_STREAM}'`);
  } catch (err) {
    if (err.message.includes('BUSYGROUP')) {
      console.log(`[WORKER] Consumer group '${CONSUMER_GROUP}' already active. Continuing.`);
    } else {
      console.error('[WORKER Error] Failed to initialize consumer group:', err.message);
      throw err;
    }
  }
};

/**
 * Parses raw Redis Stream field-value pairs into a clean JavaScript event object.
 *
 * @param {string} streamId - Redis stream entry ID
 * @param {Array<string>} rawFields - Alternating field-value array from Redis
 * @returns {Object} Structured event object
 */
const parseStreamEntry = (streamId, rawFields) => {
  const fields = {};
  for (let i = 0; i < rawFields.length; i += 2) {
    fields[rawFields[i]] = rawFields[i + 1];
  }

  let amount = null;
  if (fields.amount !== undefined && fields.amount !== '') {
    const num = Number(fields.amount);
    amount = isNaN(num) ? fields.amount : num;
  }

  let metadata = null;
  if (fields.metadata) {
    try {
      metadata = JSON.parse(fields.metadata);
    } catch {
      metadata = fields.metadata;
    }
  }

  return {
    streamId,
    eventId: fields.eventId || null,
    investorId: fields.investorId,
    eventType: fields.eventType,
    amount,
    outcome: fields.outcome || null,
    timestamp: fields.timestamp,
    ...(metadata ? { metadata } : {}),
  };
};

/**
 * Processes a parsed investor behavioural event.
 * Updates investor state and evaluates explainable behavioural risk rules.
 *
 * @param {Object} event - The parsed investor event
 * @returns {Promise<Object>} The evaluated behavioural assessment
 */
const processEvent = async (event) => {
  // 1. Update in-memory bounded behavioural state
  const investorState = updateInvestorState(event.investorId, event);

  // 2. Evaluate behavioural patterns deterministically
  const assessment = evaluateBehaviour(event, investorState);

  // 3. Broadcast real-time assessment to registered WebSocket clients
  try {
    broadcastAssessment(assessment);
  } catch (wsErr) {
    console.warn('[WORKER] WebSocket broadcast notice:', wsErr.message);
  }

  // 4. Clear console output for hackathon demonstration
  console.log('----------------------------------------------------');
  console.log(`[WORKER] Assessment for: ${assessment.investorId}`);
  console.log(`[WORKER] Stream ID: ${event.streamId || 'N/A'}`);
  console.log(`[WORKER] Event Type: ${event.eventType}${event.amount ? ` (₹${event.amount})` : ''}${event.outcome ? ` [Outcome: ${event.outcome}]` : ''}`);
  console.log(`[WORKER] Risk Score: ${assessment.riskScore}/100`);
  console.log(`[WORKER] Risk Level: ${assessment.riskLevel}`);
  if (assessment.signals.length === 0) {
    console.log('[WORKER] Signals: None');
  } else {
    console.log('[WORKER] Signals:');
    assessment.signals.forEach((sig) => {
      console.log(`  - [${sig.severity}] ${sig.type}: ${sig.message}`);
    });
  }
  console.log(`[WORKER] Cooling-Off: ${assessment.coolingOff ? 'YES' : 'NO'}`);
  if (assessment.coolingOff) {
    console.log(`[WORKER] Cooling-Off Reason: ${assessment.coolingOffReason}`);
  }
  console.log('----------------------------------------------------');

  return assessment;
};

/**
 * Main consumer loop: continuously reads new events from the consumer group using XREADGROUP.
 */
const consumeEvents = async () => {
  while (isRunning) {
    try {
      // Blocking read on consumer group with 2000ms timeout
      const response = await workerRedis.xreadgroup(
        'GROUP', CONSUMER_GROUP, CONSUMER_NAME,
        'BLOCK', 2000,
        'COUNT', 10,
        'STREAMS', INVESTOR_EVENTS_STREAM,
        '>'
      );

      // Timeout or no new events in stream
      if (!response || !response.length) {
        continue;
      }

      for (const [streamKey, entries] of response) {
        for (const [streamId, rawFields] of entries) {
          const event = parseStreamEntry(streamId, rawFields);

          try {
            // 1. Process event through behavioural handling
            await processEvent(event);

            // 2. Acknowledge successfully processed message
            await workerRedis.xack(INVESTOR_EVENTS_STREAM, CONSUMER_GROUP, streamId);
            console.log(`[WORKER] Event acknowledged: ${streamId}`);
          } catch (procErr) {
            // If processing fails, DO NOT ACK: message remains in Pending Entries List (PEL)
            console.error(`[WORKER Error] Failed to process event ${streamId}:`, procErr.message);
          }
        }
      }
    } catch (err) {
      if (!isRunning) break;
      console.error('[WORKER Error] Error in stream consumer loop:', err.message);
      // Wait briefly before retrying to avoid tight loop during transient errors
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

/**
 * Starts the Behaviour Worker process
 */
const startWorker = async () => {
  if (isRunning) return;
  isRunning = true;

  try {
    // Connect worker Redis client if not already connected
    if (workerRedis.status === 'wait') {
      await workerRedis.connect();
    }

    await initConsumerGroup();
    console.log(`[WORKER] Consumer group '${CONSUMER_GROUP}' ready (Consumer: ${CONSUMER_NAME})`);
    console.log('[WORKER] Waiting for investor events...');

    // Start background consumption loop
    consumeEvents();
  } catch (err) {
    isRunning = false;
    console.error('[WORKER Error] Could not start worker:', err.message);
  }
};

/**
 * Stops the Behaviour Worker gracefully
 */
const stopWorker = async () => {
  if (!isRunning) return;
  console.log('[WORKER] Stopping behaviour worker gracefully...');
  isRunning = false;

  try {
    if (workerRedis.status === 'ready' || workerRedis.status === 'connecting') {
      await workerRedis.quit();
      console.log('[WORKER] Worker Redis client disconnected.');
    }
  } catch (err) {
    console.warn('[WORKER] Error closing worker Redis client:', err.message);
  }
};

// If executed directly as standalone process: node src/workers/behaviourWorker.js
if (require.main === module) {
  const shutdown = async (signal) => {
    console.log(`\n[${signal}] Shutting down worker...`);
    await stopWorker();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  startWorker().catch((err) => {
    console.error('[WORKER Fatal Error]', err);
    process.exit(1);
  });
}

module.exports = {
  CONSUMER_GROUP,
  CONSUMER_NAME,
  startWorker,
  stopWorker,
  initConsumerGroup,
  parseStreamEntry,
  processEvent,
};
