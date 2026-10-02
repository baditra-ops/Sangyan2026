const { WebSocketServer, WebSocket } = require('ws');

let wss = null;

// Map of investorId -> Set<WebSocket>
const investorClients = new Map();

// Reverse map of WebSocket -> investorId for fast cleanup
const socketInvestorMap = new Map();

/**
 * Registers a WebSocket client to receive updates for a specific investor.
 *
 * @param {WebSocket} ws - The connected client socket
 * @param {string} investorId - The simulated investor ID to observe
 */
const registerClient = (ws, investorId) => {
  // If already registered to this investor, re-send ack without duplicate log
  if (socketInvestorMap.get(ws) === investorId) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'REGISTERED', investorId }));
    }
    return;
  }

  // If client was previously registered to another investor, unregister first
  unregisterClient(ws, false);

  if (!investorClients.has(investorId)) {
    investorClients.set(investorId, new Set());
  }
  investorClients.get(investorId).add(ws);
  socketInvestorMap.set(ws, investorId);

  console.log(`[WS] Client registered for investor: ${investorId}`);

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type: 'REGISTERED',
        investorId,
      })
    );
  }
};

/**
 * Unregisters and cleans up a client socket from all subscription maps.
 *
 * @param {WebSocket} ws - The client socket
 * @param {boolean} [logDisconnect=true] - Whether to log disconnection
 */
const unregisterClient = (ws, logDisconnect = true) => {
  const investorId = socketInvestorMap.get(ws);
  if (investorId && investorClients.has(investorId)) {
    const clients = investorClients.get(investorId);
    clients.delete(ws);
    if (clients.size === 0) {
      investorClients.delete(investorId);
    }
  }
  socketInvestorMap.delete(ws);

  if (logDisconnect) {
    console.log('[WS] Client disconnected');
  }
};

/**
 * Initializes the WebSocket server attached to the existing HTTP server.
 * Listens on the /ws path.
 *
 * @param {import('http').Server} httpServer
 * @returns {WebSocketServer}
 */
const initWebSocketServer = (httpServer) => {
  if (wss) {
    return wss;
  }

  wss = new WebSocketServer({
    server: httpServer,
    path: '/ws',
  });

  console.log('[WS] WebSocket server initialized on path /ws');

  wss.on('connection', (ws, req) => {
    console.log('[WS] Client connected');

    // Support automatic registration via URL query param: ws://host:port/ws?investorId=investor-001
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      const queryInvestorId = parsedUrl.searchParams.get('investorId');
      if (typeof queryInvestorId === 'string' && queryInvestorId.trim()) {
        registerClient(ws, queryInvestorId.trim());
      }
    } catch (urlErr) {
      // Ignore query parse error
    }

    // Handle incoming client messages
    ws.on('message', (rawData) => {
      try {
        const message = JSON.parse(rawData.toString());

        if (message.type === 'REGISTER') {
          if (!message.investorId || typeof message.investorId !== 'string' || !message.investorId.trim()) {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  type: 'ERROR',
                  message: 'investorId is required and must be a non-empty string for registration',
                })
              );
            }
            return;
          }

          registerClient(ws, message.investorId.trim());
        } else {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: 'ERROR',
                message: `Unknown message type: ${message.type}`,
              })
            );
          }
        }
      } catch (parseErr) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: 'ERROR',
              message: 'Malformed JSON message',
            })
          );
        }
      }
    });

    ws.on('error', (err) => {
      console.warn(`[WS Error] Client socket error: ${err.message}`);
    });

    ws.on('close', () => {
      unregisterClient(ws, true);
    });
  });

  return wss;
};

/**
 * Broadcasts a behavioural risk assessment to all clients registered for the given investor.
 *
 * @param {Object} assessment - Behavioural assessment output from the Risk Engine
 */
const broadcastAssessment = (assessment) => {
  if (!assessment || !assessment.investorId) {
    return;
  }

  const investorId = assessment.investorId;
  const clients = investorClients.get(investorId);

  if (!clients || clients.size === 0) {
    // No clients currently subscribed to this investor
    return;
  }

  const payload = JSON.stringify({
    type: 'BEHAVIOUR_ASSESSMENT',
    data: {
      investorId: assessment.investorId,
      eventId: assessment.eventId,
      streamId: assessment.streamId,
      riskScore: assessment.riskScore,
      riskLevel: assessment.riskLevel,
      signals: assessment.signals,
      coolingOff: assessment.coolingOff,
      coolingOffReason: assessment.coolingOffReason,
      reasons: assessment.reasons,
      timestamp: assessment.evaluatedAt || new Date().toISOString(),
      disclaimer: assessment.disclaimer,
    },
  });

  console.log(`[WS] Assessment sent to ${clients.size} client(s) for investor: ${investorId} (Score: ${assessment.riskScore})`);

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload, (err) => {
        if (err) {
          console.warn(`[WS] Failed to send assessment to client: ${err.message}`);
        }
      });
    }
  }
};

/**
 * Returns current WebSocket service status for health checks
 */
const getWebSocketStatus = () => {
  return {
    status: wss ? 'ready' : 'uninitialized',
    connectedClients: wss ? wss.clients.size : 0,
  };
};

/**
 * Closes the WebSocket server cleanly on shutdown
 */
const closeWebSocketServer = async () => {
  if (!wss) return;

  console.log('[WS] Closing WebSocket server...');
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.terminate();
    }
  }

  return new Promise((resolve) => {
    wss.close(() => {
      console.log('[WS] WebSocket server closed.');
      wss = null;
      resolve();
    });
  });
};

module.exports = {
  initWebSocketServer,
  broadcastAssessment,
  getWebSocketStatus,
  closeWebSocketServer,
  registerClient,
  unregisterClient,
};
