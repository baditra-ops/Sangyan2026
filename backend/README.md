# PAUSE — Real-Time Investor Behavioural Safety System (Backend)

Backend service for the **SANGYAN Investor Resilience Hackathon prototype**.

> **Note**: This application is a behavioural safety prototype. It uses **synthetic / simulated investor events only**. It does NOT access real bank accounts, brokerage accounts, SMS, or OTPs, nor does it provide financial or trading advice.

---

## Architecture Flow

```text
HTTP Request (Simulated Event)
      │
      ▼
POST /events (Express)
      │
      ▼ Validation
      │
streamService.js (XADD)
      │
      ▼
Redis Stream (`investor-events`)
```

---

## API Endpoints

### 1. Health Check
- **Method**: `GET`
- **Path**: `/health`
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "pause-backend",
    "redis": "ready",
    "timestamp": "2026-10-02T12:34:17.998Z",
    "uptime": 148.97
  }
  ```

---

### 2. Ingest Investor Event
- **Method**: `POST`
- **Path**: `/events`
- **Headers**: `Content-Type: application/json`

#### Example Request Body
```json
{
  "investorId": "investor-001",
  "eventType": "INVESTMENT_DECISION",
  "amount": 5000,
  "timestamp": "2026-10-02T12:30:00.000Z"
}
```

*Note: If `timestamp` or `eventId` are omitted, they are automatically generated.*

#### Example Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Investor event accepted",
  "event": {
    "id": "evt_4280a7f5-8d5a-45b2-a111-6d2b04afe2fc",
    "investorId": "investor-001",
    "eventType": "INVESTMENT_DECISION",
    "amount": 5000,
    "timestamp": "2026-10-02T12:32:04.934Z"
  },
  "streamId": "1790944324942-0"
}
```

#### Validation Rules
- `investorId`: Required non-empty string.
- `eventType`: Required non-empty string.
- `amount`: Required positive number (`> 0`) when `eventType` is `INVESTMENT_DECISION` or when `amount` is specified.

---

## Redis Stream: `investor-events`

Events are stored as key-value pairs using Redis `XADD`:
- `eventId`: Unique identifier of the synthetic event
- `investorId`: Simulated investor ID
- `eventType`: Event category (e.g., `INVESTMENT_DECISION`)
- `amount`: Decision amount
- `timestamp`: ISO-8601 timestamp

To inspect the stream directly via Docker:
```bash
docker exec -it redis_Rick redis-cli XRANGE investor-events - +
```
