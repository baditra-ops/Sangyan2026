# PAUSE — Real-Time Investor Behavioural Safety System (Backend)

Backend service for the **SANGYAN Investor Resilience Hackathon prototype**.

> **IMPORTANT SAFETY NOTICE**:
> This system is a **behavioural safety prototype**. It evaluates simulated behavioural patterns to encourage investor reflection and resilience.
> - **NOT a trading platform**: Does NOT provide stock tips, price predictions, buy/sell/hold recommendations, or broker promotion.
> - **NOT financial advice**: Does NOT claim to judge if an investment is financially good or bad.
> - **Synthetic data only**: Does NOT access real bank accounts, brokerages, OTPs, or SMS.
> - **Prototype heuristics**: Thresholds are demo scoring rules for hackathon illustration and are **NOT official SEBI thresholds**.

---

## Architecture Flow

```text
HTTP POST /events (Synthetic Decision Event)
      │
      ▼ Validation (investorId, eventType, amount, outcome)
streamService.js (XADD)
      │
      ▼
Redis Stream (`investor-events`)
      │
      ▼ XREADGROUP (Consumer Group: `behaviour-workers`)
behaviourWorker.js
      │
      ▼ updateInvestorState(investorId, event)
investorState.js (In-memory bounded history, max 20 events)
      │
      ▼ evaluateBehaviour(event, investorState)
riskEngine.js (Explainable, deterministic rules & scoring)
      │
      ├───────────────────────┬──────────────────────┐
      ▼                       ▼                      ▼
  Risk Score (0–100)      Risk Level          Behavioural Signals
      │                       │                      │
      └───────────────────────┴──────────────────────┘
                              │
                              ▼
                     Cooling-Off Trigger?
                      [ YES / NO + Reason ]
                              │
                              ├──────────────────────────────────────┐
                              ▼                                      ▼
                        XACK (Redis)                        websocketService.js
                                                                     │
                                                                     ▼
                                                          Targeted Client Broadcast
                                                              (ws://host:port/ws)
```

---

## Real-Time WebSocket Protocol

- **Endpoint**: `ws://localhost:5000/ws`

### 1. Client Registration
A connected frontend/client registers to receive real-time assessments for a specific simulated investor.

**Option A: Registration via JSON message**:
```json
{
  "type": "REGISTER",
  "investorId": "investor-001"
}
```

**Option B: Registration via URL query param**:
```text
ws://localhost:5000/ws?investorId=investor-001
```

**Server Acknowledgement**:
```json
{
  "type": "REGISTERED",
  "investorId": "investor-001"
}
```

### 2. Real-Time Behaviour Assessment Message
Broadcast in real-time when the Behaviour Worker evaluates an incoming event for that investor:
```json
{
  "type": "BEHAVIOUR_ASSESSMENT",
  "data": {
    "investorId": "investor-001",
    "eventId": "evt_4280a7f5-8d5a-45b2-a111-6d2b04afe2fc",
    "streamId": "1790945165877-0",
    "riskScore": 80,
    "riskLevel": "CRITICAL",
    "signals": [
      {
        "type": "RAPID_DECISIONS",
        "severity": "MEDIUM",
        "message": "3 investment decisions occurred within the last 10 minutes."
      },
      {
        "type": "CONSECUTIVE_LOSSES",
        "severity": "HIGH",
        "message": "3 simulated loss outcomes occurred consecutively."
      },
      {
        "type": "INCREASING_AMOUNT_AFTER_LOSS",
        "severity": "HIGH",
        "message": "Investment amount increased following simulated losses (possible loss-chasing pattern detected)."
      }
    ],
    "coolingOff": true,
    "coolingOffReason": "Cooling-off recommended: Rapid repeated decisions, 3 consecutive simulated losses, Increasing investment amount after losses. Encouraging a moment to pause and reflect.",
    "reasons": [
      "Rapid repeated decisions",
      "3 consecutive simulated losses",
      "Increasing investment amount after losses"
    ],
    "timestamp": "2026-10-02T13:31:33.133Z",
    "disclaimer": "Prototype heuristics for behavioural resilience demonstration only. Not SEBI thresholds or financial advice."
  }
}
```

### 3. Investor-Specific Routing
- The server maintains isolated client sets per `investorId`.
- Clients registered for `investor-001` **never** receive assessments intended for `investor-002`.

---

## Behavioural Signals & Prototype Rules

| Signal | Prototype Threshold | Severity | Points | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **`RAPID_DECISIONS`** | $\ge$ 3 decisions within 10 minutes | MEDIUM / HIGH | +20 | Highlights high-frequency decision making in a compressed window. |
| **`CONSECUTIVE_LOSSES`** | $\ge$ 3 consecutive simulated losses | HIGH | +30 | Identifies negative outcome streaks that can provoke emotional bias. |
| **`INCREASING_AMOUNT_AFTER_LOSS`** | Escalating amount following $\ge$ 2 simulated losses | HIGH | +30 | Flags potential loss-chasing / Martingale-style decision patterns. |
| **`ODD_HOUR_ACTIVITY`** | Event timestamp between 00:00 and 05:00 IST | LOW | +10 | Highlights activity during unusual overnight hours when cognitive fatigue is higher. |

---

## Deterministic Scoring & Risk Levels

$$\text{Risk Score} = \min(100, \sum \text{Signal Points})$$

| Score Range | Risk Level |
| :--- | :--- |
| **0 – 29** | `LOW` |
| **30 – 59** | `MODERATE` |
| **60 – 79** | `HIGH` |
| **80 – 100** | `CRITICAL` |

### Cooling-Off Intervention Rule
A **Cooling-Off** recommendation (`coolingOff = true`) is triggered when:
- **`riskScore >= 60`** (HIGH or CRITICAL), OR
- **Multiple HIGH severity signals** are triggered together.

---

## API Endpoints

### 1. Ingest Event
- **Method**: `POST`
- **Path**: `/events`
- **Body**:
  ```json
  {
    "investorId": "investor-001",
    "eventType": "INVESTMENT_DECISION",
    "amount": 5000,
    "outcome": "LOSS",
    "timestamp": "2026-10-02T12:30:00.000Z"
  }
  ```

### 2. Health Check
- **Method**: `GET`
- **Path**: `/health`
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "pause-backend",
    "redis": "ready",
    "websocket": "ready",
    "connectedClients": 0
  }
  ```
