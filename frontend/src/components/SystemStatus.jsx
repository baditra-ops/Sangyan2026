import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Server, Radio, Database, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SystemStatus({ wsStatus, onReconnect }) {
  const [backendHealth, setBackendHealth] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const data = await res.json();
        setBackendHealth(data);
      } else {
        setBackendHealth(null);
      }
    } catch (err) {
      setBackendHealth(null);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  const isBackendOnline = Boolean(backendHealth && backendHealth.status === 'ok');
  const isWsConnected = wsStatus === 'CONNECTED';
  const isRedisReady = backendHealth && backendHealth.redis === 'ready';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Backend HTTP Status */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <Server className={`w-3.5 h-3.5 ${isBackendOnline ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span className="text-slate-400">Backend API:</span>
            <span className={`font-semibold ${isBackendOnline ? 'text-emerald-300' : 'text-rose-300'}`}>
              {isBackendOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          {/* WebSocket Status */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            {isWsConnected ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            )}
            <span className="text-slate-400">WebSocket:</span>
            <span
              className={`font-semibold ${
                isWsConnected ? 'text-emerald-300' : wsStatus === 'CONNECTING' ? 'text-amber-300' : 'text-rose-300'
              }`}
            >
              {wsStatus}
            </span>
          </div>

          {/* Redis Stream Status */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <Database className={`w-3.5 h-3.5 ${isRedisReady ? 'text-indigo-400' : 'text-amber-400'}`} />
            <span className="text-slate-400">Redis Stream:</span>
            <span className={`font-semibold ${isRedisReady ? 'text-indigo-300' : 'text-amber-300'}`}>
              {isRedisReady ? 'READY' : 'OFFLINE'}
            </span>
          </div>

          {/* Synthetic Data Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-xs">
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="text-indigo-300 font-medium">Live Stream: Synthetic</span>
          </div>
        </div>

        {/* Manual Refresh / Reconnect */}
        <button
          onClick={() => {
            checkHealth();
            if (onReconnect) onReconnect();
          }}
          disabled={isChecking}
          className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition border border-slate-700 disabled:opacity-50"
          title="Refresh health checks and reconnect WebSocket"
        >
          <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
          <span>Sync Status</span>
        </button>
      </div>
    </div>
  );
}
