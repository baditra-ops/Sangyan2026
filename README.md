# PAUSE — Real-Time Investor Behavioural Safety System
### SANGYAN 2026 Investor Resilience Hackathon Prototype

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://frontend-d1fuun2y0-baditra7.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://sangyan2026.onrender.com/health)
[![Redis Streams](https://img.shields.io/badge/Streaming-Upstash_Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://upstash.com/)
[![React](https://img.shields.io/badge/Frontend-React_19_•_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://vitejs.dev/)

> **PAUSE BEFORE THE NEXT DECISION.**  
> Real-time behavioural safety infrastructure engineered to detect high-frequency emotional investing patterns, explain their triggers deterministically, and introduce a reflective cognitive speed bump.

---

## 🌐 Live Prototype Links

- 🚀 **Live Web Application**: [https://frontend-d1fuun2y0-baditra7.vercel.app/](https://frontend-d1fuun2y0-baditra7.vercel.app/)
- 📡 **Backend Health Check**: [https://sangyan2026.onrender.com/health](https://sangyan2026.onrender.com/health)
- ⚡ **WebSocket Server**: `wss://sangyan2026.onrender.com/ws`

---

## 🛡️ Critical Safety Notice & Product Boundaries

PAUSE is a **public-good behavioural resilience prototype**, NOT a commercial trading tool:

- **NOT a Trading Platform**: Does NOT execute orders, predict stock prices, offer buy/sell/hold calls, or route to brokerages.
- **NOT Financial Advice**: Evaluates behavioural pacing and emotional streaks, NOT the financial quality of assets.
- **Strictly Synthetic Data**: Operates solely on simulated decision events; never accesses real bank accounts, broker APIs, SMS, or OTPs.
- **Prototype Heuristics**: Scoring weights and cooling-off triggers are deterministic demonstration rules for the SANGYAN Hackathon, not official SEBI regulations.
- **Guiding Principle**: *"PAUSE does not block transactions, cancel orders, or offer financial advice."*

---

## 🏛️ End-to-End Streaming Architecture

```text
┌────────────────────────┐
│  React Event Simulator │ ◄── [User clicks: PACED / RAPID / LOSS CHASING]
└───────────┬────────────┘
            │ HTTP POST /events (Synthetic Decision Payload)
            ▼
┌────────────────────────┐
│   Express Ingestion    │ ◄── Validates investorId, amount, outcome
└───────────┬────────────┘
            │ streamService.js (XADD)
            ▼
┌──────────────────────────────────────────────┐
│  Redis Stream: investor-events               │ ◄── Persistent Append-Only Stream
└───────────────────┬──────────────────────────┘
                    │ XREADGROUP (Consumer Group: behaviour-workers)
                    ▼
┌──────────────────────────────────────────────┐
│  behaviourWorker.js                          │ ◄── Dedicated Background Worker
└───────────────────┬──────────────────────────┘
                    │ updateInvestorState(investorId, event)
                    ▼
┌──────────────────────────────────────────────┐
│  In-Memory Bounded State                     │ ◄── Rolling 20-event window per investor
└───────────────────┬──────────────────────────┘
                    │ evaluateBehaviour(event, state)
                    ▼
┌──────────────────────────────────────────────┐
│  Explainable Rule-Based Risk Engine          │ ◄── 100% Deterministic & Transparent
│  • Rapid Decisions (+20 pts)                 │
│  • Consecutive Losses (+30 pts)              │
│  • Loss Escalation / Chasing (+30 pts)       │
│  • Odd-Hour Activity 00:00–05:00 (+10 pts)   │
└───────────────────┬──────────────────────────┘
                    │
                    ├────────────────────────────────────┐
                    ▼                                    ▼
         XACK (Redis Stream ACK)             websocketService.js (Broadcast)
                                                         │
                                                         ▼ wss://host/ws
                                            ┌────────────────────────┐
                                            │  Live Safety Dashboard │
                                            │  • Real-Time Gauge     │
                                            │  • Streaming Pipeline  │
                                            │  • Cooling-Off Panel   │
                                            └────────────────────────┘
```

---

## ✨ Key System Features

### 1. Live Event Stream Panel (Redis Stream: `investor-events`)
- Clearly visualizes events entering the real-time stream.
- Displays **Stream ID**, **Investor ID**, **Event Type**, **Simulated Amount**, and **Outcome**.
- Tracks three-stage ingestion verification:
  - `✓ EVENT RECEIVED` (HTTP `POST /events` 201)
  - `✓ STREAMED` (Appended via Redis `XADD`)
  - `✓ PROCESSED` (Consumed via `XREADGROUP` & acknowledged via `XACK`)
- Rolling recent events audit log (retains newest 10 events with smooth transitions).

### 2. Real-Time Streaming Pipeline Visualization
- Visual 6-node architectural flow:
  `SIMULATOR` → `REDIS STREAM` → `BEHAVIOUR WORKER` → `RISK ENGINE` → `WEBSOCKET` → `LIVE DASHBOARD`
- **Event-Driven Packet Animation**: Triggers a fast (~1.2s) animated pulse traversing through all 6 stages whenever a real event is dispatched. Remains idle when listening.

### 3. Transparent, Rule-Based Behavioural Risk Engine
- Deterministic score (0–100) mapped to four levels: `LOW`, `MODERATE`, `HIGH`, `CRITICAL`.
- Detects observable behavioral patterns:
  - **Rapid Decisions**: $\ge 3$ decisions within a 10-minute window (+20 pts).
  - **Consecutive Losses**: $\ge 3$ simulated losses in a row (+30 pts).
  - **Loss Chasing / Escalation**: Consecutive losses with increasing investment amounts (+30 pts).
  - **Odd-Hour Activity**: Activity between 00:00 and 05:00 IST (+10 pts).

### 4. Cooling-Off Safety Intervention Banner
- Automatically activates when risk score reaches $\ge 60$ or compound high-severity signals occur.
- Non-alarming, ambient amber aesthetic with explainable trigger breakdown.
- Primary CTA: **"Review My Decision"** prompts the investor into reflection.

### 5. Decision Journal & Reflection History
- Fosters metacognition by asking: *"Why are you making this decision?"*
- Prompts for decision driver (FOMO, market volatility, plan review) and expected time horizon.
- Bounded, persistent reflection entries stored per investor persona.
- Full bilingual localization: **English** and **हिंदी (Hindi)**.

### 6. Investor Isolation & Demo Presets
- Switch between simulated personas (`investor-001`, `investor-002`, `investor-003`) with complete state isolation.
- One-click testing presets:
  - **PACED**: Normal simulated activity.
  - **RAPID DECISIONS**: Rapid sequence in a short interval.
  - **LOSS CHASING**: Consecutive losses with escalating amounts (₹1,000 → ₹2,500 → ₹5,000).
  - **ODD HOURS**: Late-night (02:30 IST) simulation.
  - **Reset Demo**: Returns the investor persona to a clean zero state.

### 7. Magnetic Cursor & Refined Ergonomics
- Physics-based trailing aura ring using linear interpolation (`lerpFactor = 0.16`).
- Magnetically snaps to interactive buttons, cards, and inputs.
- Only enabled on fine-pointer devices with full `@media (prefers-reduced-motion: reduce)` support.

---

## ⚡ 60-Second Demo Walkthrough for Judges

Follow this sequence to experience the full prototype:

1. **Open the App**: Visit [https://frontend-d1fuun2y0-baditra7.vercel.app/](https://frontend-d1fuun2y0-baditra7.vercel.app/).
2. **Observe System Status**: Header shows `● BACKEND CONNECTED`, `● STREAMING`, and `● WEBSOCKET LIVE`.
3. **Click "PACED"**:
   - Watch the data packet pulse through the **Streaming Pipeline** (`Stages 1–6`).
   - Notice the event appear in the **Live Event Stream** with a generated Redis Stream ID.
   - Risk score remains `0/100 (LOW)`.
4. **Click "RAPID DECISIONS"**:
   - 3 rapid decisions enter the stream.
   - Behavioural signal `RAPID DECISIONS` triggers (+20 pts).
5. **Click "LOSS CHASING"**:
   - Simulated loss escalation (₹1,000 → ₹2,500 → ₹5,000).
   - Score jumps to `80/100 (CRITICAL)`.
   - The **Cooling-Off Intervention Banner** (`TAKE A PAUSE.`) activates with soft ambient glow.
6. **Click "REVIEW MY DECISION"**:
   - Decision Journal opens. Select a decision driver and time horizon, then click **Record Reflection**.
   - Your reflection appears in the **Reflection History**.
7. **Toggle Language**: Click **हिंदी** in the header to switch the interface to Hindi.
8. **Test Investor Isolation**: Switch to `investor-002` to see a completely independent clean state.
9. **Click "Reset Demo"**: Restores `investor-001` back to a clean slate.

---

## 🛠️ Technology Stack

| Layer | Technologies | Role |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons | Responsive safety console, micro-animations, magnetic cursor |
| **Backend** | Node.js, Express, `ws` (WebSockets), `ioredis` | Stream producer, consumer worker, transparent rule engine |
| **Streaming & Queue** | Redis Streams (`XADD`, `XREADGROUP`, `XACK`) | Real-time event log, consumer groups, bounded memory history |
| **Cloud Hosting** | Vercel (Frontend), Render (Backend), Upstash (Redis) | 24/7 cloud availability with automated CI/CD |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+)
- Docker (for local Redis) or local Redis server (v5.0+)

### 1. Clone Repository
```bash
git clone https://github.com/baditra-ops/Sangyan2026.git
cd Sangyan2026
```

### 2. Start Local Redis
Using Docker:
```bash
docker run -d --name pause-redis -p 6379:6379 redis:alpine
```

### 3. Start Backend
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` (`ws://localhost:5000/ws`).*

### 4. Start Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📁 Repository Structure

```text
Sangyan2026/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── redis.js             # Resilient Redis connection & TLS sanitizer
│   │   ├── routes/
│   │   │   └── eventRoutes.js       # POST /events and POST /events/reset
│   │   ├── services/
│   │   │   ├── investorState.js     # Bounded in-memory state (20-event window)
│   │   │   ├── riskEngine.js        # Deterministic explainable heuristics
│   │   │   ├── streamService.js     # Redis Stream append (XADD)
│   │   │   └── websocketService.js  # WebSocket server with PING/PONG heartbeat
│   │   ├── workers/
│   │   │   └── behaviourWorker.js   # Consumer loop (XREADGROUP & XACK)
│   │   └── server.js                # Express app & HTTP/WS server entry
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActivityTimeline.jsx         # Categorized audit trail
│   │   │   ├── BehaviourSignals.jsx         # Detected heuristic signals
│   │   │   ├── CoolingOffPanel.jsx          # Ambient safety intervention banner
│   │   │   ├── DecisionJournal.jsx          # Interactive reflection modal
│   │   │   ├── EventSimulator.jsx           # Preset scenarios & manual dispatch
│   │   │   ├── ExplainabilityPanel.jsx      # Transparent rule breakdown
│   │   │   ├── Header.jsx                   # Live status badges & actions
│   │   │   ├── Hero.jsx                     # Core mission & educational notice
│   │   │   ├── InvestorSelector.jsx         # Monitored persona switcher
│   │   │   ├── LiveEventStream.jsx          # Redis Stream visualization & log
│   │   │   ├── MagneticCursor.jsx           # Fluid physics magnetic cursor
│   │   │   ├── ReflectionHistory.jsx        # Qualitative journal log
│   │   │   ├── RiskIndicator.jsx            # Animated SVG gauge & score counter
│   │   │   ├── StreamingPipeline.jsx        # 6-stage animated packet transit
│   │   │   ├── SystemFlowVisualization.jsx  # End-to-end architectural map
│   │   │   └── SystemStatus.jsx             # Technical status grid
│   │   ├── hooks/
│   │   │   └── useWebSocket.js              # Resilient WS client with 15s heartbeat
│   │   ├── utils/
│   │   │   └── reflectionTranslations.js    # English & Hindi dictionaries
│   │   ├── App.jsx                          # Main dashboard coordinator
│   │   └── index.css                        # Design tokens, reduced motion
│   └── package.json
│
└── README.md
```

---

## 📜 License & Disclaimers

Developed for the **SANGYAN Investor Resilience Hackathon 2026**.  
All rights reserved for demonstration and educational purposes. This software is provided "as is" without warranty of any kind.