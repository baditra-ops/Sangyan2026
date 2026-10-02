/**
 * In-Memory Investor State Manager
 * Maintains bounded recent behavioural history per simulated investor.
 *
 * NOTE: For prototype simplicity, state is stored in memory.
 * No persistent database is used at this stage.
 */

const MAX_RECENT_EVENTS = 20;

// Central in-memory state map: investorId -> state object
const investorStates = new Map();

/**
 * Creates an empty initial state for an investor
 * @param {string} investorId
 * @returns {Object}
 */
const createInitialState = (investorId) => ({
  investorId,
  recentEvents: [],
  consecutiveLosses: 0,
  lossStreakAmounts: [],
  lastEventTimestamp: null,
});

/**
 * Retrieves the current behavioural state for an investor.
 * Creates an initial state if the investor is new.
 *
 * @param {string} investorId
 * @returns {Object}
 */
const getInvestorState = (investorId) => {
  if (!investorStates.has(investorId)) {
    investorStates.set(investorId, createInitialState(investorId));
  }
  return investorStates.get(investorId);
};

/**
 * Updates the behavioural state for an investor when a new event arrives.
 * Bounded by MAX_RECENT_EVENTS to ensure memory efficiency.
 *
 * @param {string} investorId
 * @param {Object} event - Normalized incoming event
 * @returns {Object} Updated investor state
 */
const updateInvestorState = (investorId, event) => {
  const state = getInvestorState(investorId);

  // 1. Append event to bounded history
  state.recentEvents.push({
    eventId: event.eventId,
    eventType: event.eventType,
    amount: event.amount,
    outcome: event.outcome || null,
    timestamp: event.timestamp,
    streamId: event.streamId,
  });

  if (state.recentEvents.length > MAX_RECENT_EVENTS) {
    state.recentEvents.shift();
  }

  // 2. Update timestamp
  state.lastEventTimestamp = event.timestamp;

  // 3. Track simulated consecutive losses
  if (event.outcome === 'LOSS') {
    state.consecutiveLosses += 1;
    if (typeof event.amount === 'number' && event.amount > 0) {
      state.lossStreakAmounts.push(event.amount);
    }
  } else if (event.outcome === 'WIN') {
    state.consecutiveLosses = 0;
    state.lossStreakAmounts = [];
  }
  // NEUTRAL or unprovided outcome does not alter the loss streak

  return state;
};

/**
 * Resets state for a specific investor
 * @param {string} investorId
 */
const resetInvestorState = (investorId) => {
  investorStates.delete(investorId);
};

/**
 * Clears all in-memory states (useful for automated testing)
 */
const clearAllStates = () => {
  investorStates.clear();
};

module.exports = {
  MAX_RECENT_EVENTS,
  getInvestorState,
  updateInvestorState,
  resetInvestorState,
  clearAllStates,
};
