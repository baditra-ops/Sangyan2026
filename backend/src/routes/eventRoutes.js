const express = require('express');
const crypto = require('crypto');
const { addInvestorEvent } = require('../services/streamService');

const router = express.Router();

/**
 * Generates a unique event ID if none was supplied
 */
const generateEventId = () => {
  if (typeof crypto.randomUUID === 'function') {
    return `evt_${crypto.randomUUID()}`;
  }
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * POST /events
 * Ingests a synthetic behavioural event from a retail investor simulation
 */
router.post('/', async (req, res) => {
  try {
    const { investorId, eventType, amount, timestamp, metadata } = req.body || {};

    // 1. Validate investorId
    if (!investorId || typeof investorId !== 'string' || !investorId.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'investorId is required and must be a non-empty string',
      });
    }

    // 2. Validate eventType
    if (!eventType || typeof eventType !== 'string' || !eventType.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'eventType is required and must be a non-empty string',
      });
    }

    // 3. Validate amount for investment decisions or when amount is provided
    const isInvestmentDecision = eventType.trim().toUpperCase() === 'INVESTMENT_DECISION';
    if (isInvestmentDecision || amount !== undefined) {
      if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'amount must be a valid positive number greater than 0',
        });
      }
    }

    // 4. Normalize timestamp
    let eventTimestamp = timestamp;
    if (!eventTimestamp || typeof eventTimestamp !== 'string' || isNaN(Date.parse(eventTimestamp))) {
      eventTimestamp = new Date().toISOString();
    }

    // 5. Build structured synthetic event
    const eventId = req.body.eventId || req.body.id || generateEventId();
    const event = {
      eventId,
      investorId: investorId.trim(),
      eventType: eventType.trim(),
      amount: typeof amount === 'number' ? amount : null,
      timestamp: eventTimestamp,
      ...(metadata ? { metadata } : {}),
    };

    // 6. Append to Redis Stream
    const streamId = await addInvestorEvent(event);

    // 7. Return accepted response
    return res.status(201).json({
      success: true,
      message: 'Investor event accepted',
      event: {
        id: event.eventId,
        investorId: event.investorId,
        eventType: event.eventType,
        amount: event.amount,
        timestamp: event.timestamp,
        ...(event.metadata ? { metadata: event.metadata } : {}),
      },
      streamId,
    });
  } catch (err) {
    console.error('[Event Ingestion Error]', err.message);
    return res.status(503).json({
      success: false,
      error: 'Stream Ingestion Failure',
      message: 'Unable to record event to the stream at this time. Please retry.',
    });
  }
});

module.exports = router;
