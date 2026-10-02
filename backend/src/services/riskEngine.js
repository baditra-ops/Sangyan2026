/**
 * EXPLAINABLE BEHAVIOURAL RISK ENGINE
 *
 * Evaluates simulated investor decision events and produces deterministic,
 * explainable behavioural safety assessments.
 *
 * IMPORTANT SAFETY NOTICE:
 * - This engine does NOT provide financial, trading, or investment advice.
 * - It evaluates behavioural safety patterns (e.g. rapid decisions, loss-chasing, odd hours).
 * - Thresholds are prototype demonstration rules, NOT official SEBI regulations.
 */

// Prototype Rule Constants (Configurable, Explainable, Transparent)
const RAPID_DECISION_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RAPID_DECISION_THRESHOLD = 3;              // 3 decisions in window
const CONSECUTIVE_LOSSES_THRESHOLD = 3;          // 3 consecutive simulated losses
const INCREASING_LOSS_STREAK_MIN = 2;            // At least 2 losses with increasing amount
const ODD_HOUR_START = 0;                        // 00:00 (Midnight)
const ODD_HOUR_END = 5;                          // 05:00 AM
const TIMEZONE = 'Asia/Kolkata';

// Scoring Weights
const RISK_POINTS = {
  RAPID_DECISIONS: 20,
  CONSECUTIVE_LOSSES: 30,
  INCREASING_AMOUNT_AFTER_LOSS: 30,
  ODD_HOUR_ACTIVITY: 10,
};

/**
 * Maps a numeric risk score (0-100) to a deterministic risk level.
 * @param {number} score
 * @returns {'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'}
 */
const getRiskLevel = (score) => {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 30) return 'MODERATE';
  return 'LOW';
};

/**
 * Extracts hour (0-23) in Asia/Kolkata timezone from an ISO timestamp.
 * @param {string} isoTimestamp
 * @returns {number}
 */
const getHourInKolkata = (isoTimestamp) => {
  const date = new Date(isoTimestamp);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    hourCycle: 'h23',
  });
  return parseInt(formatter.format(date), 10);
};

/**
 * Evaluates the behavioural pattern of an incoming investor event against the investor's recent state.
 *
 * @param {Object} event - Current investor event
 * @param {Object} investorState - Bounded recent state of the investor
 * @returns {Object} Deterministic behavioural assessment
 */
const evaluateBehaviour = (event, investorState) => {
  const signals = [];
  const reasons = [];

  const currentTimestamp = new Date(event.timestamp || new Date()).getTime();

  // -------------------------------------------------------------------------
  // SIGNAL 1: RAPID REPEATED DECISIONS
  // Detects multiple investment decisions within the 10-minute window
  // -------------------------------------------------------------------------
  if (investorState && Array.isArray(investorState.recentEvents)) {
    const recentDecisionsInWindow = investorState.recentEvents.filter((e) => {
      const eTime = new Date(e.timestamp).getTime();
      const diff = currentTimestamp - eTime;
      return diff >= 0 && diff <= RAPID_DECISION_WINDOW_MS;
    });

    if (recentDecisionsInWindow.length >= RAPID_DECISION_THRESHOLD) {
      signals.push({
        type: 'RAPID_DECISIONS',
        severity: recentDecisionsInWindow.length >= 5 ? 'HIGH' : 'MEDIUM',
        points: RISK_POINTS.RAPID_DECISIONS,
        message: `${recentDecisionsInWindow.length} investment decisions occurred within the last 10 minutes.`,
      });
      reasons.push('Rapid repeated decisions');
    }
  }

  // -------------------------------------------------------------------------
  // SIGNAL 2: CONSECUTIVE LOSSES
  // Detects 3 or more consecutive simulated losses
  // -------------------------------------------------------------------------
  if (investorState && investorState.consecutiveLosses >= CONSECUTIVE_LOSSES_THRESHOLD) {
    signals.push({
      type: 'CONSECUTIVE_LOSSES',
      severity: 'HIGH',
      points: RISK_POINTS.CONSECUTIVE_LOSSES,
      message: `${investorState.consecutiveLosses} simulated loss outcomes occurred consecutively.`,
    });
    reasons.push(`${investorState.consecutiveLosses} consecutive simulated losses`);
  }

  // -------------------------------------------------------------------------
  // SIGNAL 3: INCREASING AMOUNT AFTER LOSSES (Possible loss-chasing pattern)
  // Detects increasing investment amount following consecutive losses
  // -------------------------------------------------------------------------
  if (
    investorState &&
    investorState.consecutiveLosses >= INCREASING_LOSS_STREAK_MIN &&
    Array.isArray(investorState.lossStreakAmounts) &&
    investorState.lossStreakAmounts.length >= 2
  ) {
    const amounts = investorState.lossStreakAmounts;
    const len = amounts.length;
    // Check if the latest loss amount is greater than the preceding loss amount
    if (amounts[len - 1] > amounts[len - 2]) {
      signals.push({
        type: 'INCREASING_AMOUNT_AFTER_LOSS',
        severity: 'HIGH',
        points: RISK_POINTS.INCREASING_AMOUNT_AFTER_LOSS,
        message: 'Investment amount increased following simulated losses (possible loss-chasing pattern detected).',
      });
      reasons.push('Increasing investment amount after losses');
    }
  }

  // -------------------------------------------------------------------------
  // SIGNAL 4: LATE-NIGHT / ODD-HOUR ACTIVITY
  // Detects activity between 00:00 and 05:00 IST
  // -------------------------------------------------------------------------
  try {
    const kolkataHour = getHourInKolkata(event.timestamp);
    if (kolkataHour >= ODD_HOUR_START && kolkataHour < ODD_HOUR_END) {
      signals.push({
        type: 'ODD_HOUR_ACTIVITY',
        severity: 'LOW',
        points: RISK_POINTS.ODD_HOUR_ACTIVITY,
        message: `Investment activity occurred during prototype-defined odd-hour window (${kolkataHour.toString().padStart(2, '0')}:00 IST).`,
      });
      reasons.push('Odd-hour activity (00:00–05:00 IST)');
    }
  } catch (err) {
    // If timestamp cannot be parsed, safely ignore this heuristic
  }

  // -------------------------------------------------------------------------
  // CALCULATE DETERMINISTIC RISK SCORE (Capped at 100)
  // -------------------------------------------------------------------------
  const rawScore = signals.reduce((sum, sig) => sum + sig.points, 0);
  const riskScore = Math.min(Math.max(rawScore, 0), 100);
  const riskLevel = getRiskLevel(riskScore);

  // -------------------------------------------------------------------------
  // COOLING-OFF DECISION
  // Triggered when riskScore >= 60 OR when multiple high-severity signals occur
  // -------------------------------------------------------------------------
  const highSeverityCount = signals.filter((s) => s.severity === 'HIGH').length;
  const coolingOff = riskScore >= 60 || highSeverityCount >= 2;
  const coolingOffReason = coolingOff
    ? `Cooling-off recommended: ${reasons.join(', ')}. Encouraging a moment to pause and reflect.`
    : null;

  return {
    investorId: event.investorId,
    eventId: event.eventId || null,
    streamId: event.streamId || null,
    riskScore,
    riskLevel,
    signals,
    coolingOff,
    coolingOffReason,
    reasons,
    evaluatedAt: new Date().toISOString(),
    disclaimer: 'Prototype heuristics for behavioural resilience demonstration only. Not SEBI thresholds or financial advice.',
  };
};

module.exports = {
  RAPID_DECISION_WINDOW_MS,
  RAPID_DECISION_THRESHOLD,
  CONSECUTIVE_LOSSES_THRESHOLD,
  INCREASING_LOSS_STREAK_MIN,
  ODD_HOUR_START,
  ODD_HOUR_END,
  TIMEZONE,
  RISK_POINTS,
  getRiskLevel,
  getHourInKolkata,
  evaluateBehaviour,
};
