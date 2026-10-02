# PAUSE — Real-Time Investor Behavioural Safety Console (Frontend)

React + Vite + Tailwind CSS dashboard for the **SANGYAN Investor Resilience Hackathon prototype**.

> **SAFETY NOTICE**:
> This interface is an educational behavioural safety layer. It does NOT provide stock tips, trading signals, broker routing, or price predictions. All data rendered is synthetic.

---

## Architecture Flow

```text
Synthetic Event Trigger (EventSimulator)
            │
            ▼ HTTP POST /events
     Backend Pipeline (Express → Redis Stream → Behaviour Worker → Risk Engine)
            │
            ▼ Real-Time WebSocket (ws://localhost:5000/ws)
      useWebSocket Hook
            │
            ▼
┌───────────────────────┬───────────────────────────┐
▼                       ▼                           ▼
RiskIndicator Gauge   BehaviourSignals List    CoolingOffPanel ("TAKE A PAUSE.")
```

---

## Environment Configuration

Create or update `.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000/ws
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## Key Dashboard Features

1. **System Status**: Displays live backend, WebSocket, and Redis Stream operational indicators.
2. **Simulated Investor Switcher**: Allows monitoring different personas (`investor-001`, `investor-002`, `investor-003`) with isolated state.
3. **Circular Behavioural Gauge**: Displays deterministic score (0–100) and risk levels (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
4. **Detected Signals**: Shows transparent behavioural rules (`RAPID_DECISIONS`, `CONSECUTIVE_LOSSES`, `INCREASING_AMOUNT_AFTER_LOSS`, `ODD_HOUR_ACTIVITY`).
5. **Cooling-Off Intervention**: Reflective banner encouraging a pause when compound risks occur.
6. **One-Click Demo Presets**:
   - `Paced Trade` (Normal activity)
   - `Rapid Pacing` (3 rapid decisions)
   - `Loss Chasing` (Escalating loss streak: ₹1k $\rightarrow$ ₹2.5k $\rightarrow$ ₹5k)
   - `Odd Hours` (02:30 AM IST execution)
7. **Activity Timeline**: Real-time log of simulated decisions.
8. **Explainability Panel**: Details the exact rule points and SEBI disclaimer.
9. **Architectural Pipeline Diagram**: Visualizes the 6-stage backend processing flow.
