import { useState, useEffect, useRef, useCallback } from 'react';

const rawWs = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';
const DEFAULT_WS_URL = rawWs.endsWith('/') ? rawWs.slice(0, -1) : rawWs;

/**
 * Custom hook managing real-time WebSocket connection to PAUSE backend.
 * Handles client registration per investor, reconnection, and live assessments.
 *
 * @param {string} investorId - The simulated investor ID to monitor
 * @returns {Object} Connection state, latest assessment, and control handlers
 */
export function useWebSocket(investorId) {
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING'); // CONNECTING | CONNECTED | DISCONNECTED | ERROR
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(null);

  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const shouldReconnectRef = useRef(true);

  // Clear current assessment when switching investors
  useEffect(() => {
    setLatestAssessment(null);
    setAssessmentHistory([]);
    setIsRegistered(false);
  }, [investorId]);

  const connect = useCallback(() => {
    if (!investorId) return;

    // Clean up existing socket if any
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch (e) {
        // ignore
      }
    }

    setConnectionStatus('CONNECTING');

    const wsUrl = `${DEFAULT_WS_URL}?investorId=${encodeURIComponent(investorId)}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'PING' }));
      }
    }, 20000);

    ws.onopen = () => {
      setConnectionStatus('CONNECTED');
      // Also send explicit registration message for protocol compliance
      ws.send(JSON.stringify({ type: 'REGISTER', investorId }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setLastMessageTime(new Date());

        // Ignore heartbeat replies
        if (message.type === 'PONG' || message.type === 'PING') {
          return;
        }

        if (message.type === 'REGISTERED') {
          setIsRegistered(true);
        } else if (message.type === 'BEHAVIOUR_ASSESSMENT') {
          // Double-check investor isolation on frontend
          if (message.data && message.data.investorId === investorId) {
            setLatestAssessment(message.data);
            setAssessmentHistory((prev) => [message.data, ...prev.slice(0, 19)]);
          }
        } else if (message.type === 'ERROR') {
          console.warn('[WS Server Error]', message.message);
        }
      } catch (err) {
        console.error('[WS Parse Error]', err);
      }
    };

    ws.onerror = () => {
      setConnectionStatus('ERROR');
    };

    ws.onclose = () => {
      clearInterval(heartbeatInterval);
      setConnectionStatus('DISCONNECTED');
      setIsRegistered(false);

      if (shouldReconnectRef.current) {
        // Reconnect after 2 seconds with sensible backoff
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 2000);
      }
    };
  }, [investorId]);

  useEffect(() => {
    shouldReconnectRef.current = true;
    connect();

    return () => {
      shouldReconnectRef.current = false;
      clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const reconnect = useCallback(() => {
    shouldReconnectRef.current = true;
    clearTimeout(reconnectTimeoutRef.current);
    connect();
  }, [connect]);

  return {
    connectionStatus,
    latestAssessment,
    assessmentHistory,
    isRegistered,
    lastMessageTime,
    reconnect,
  };
}
