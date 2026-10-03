import React, { useState, useEffect } from 'react';
import { Server, Wifi, WifiOff, Database, Cpu, Radio, RefreshCw, CheckCircle2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SystemStatus({ wsStatus, onReconnect, language = 'en', onHealthChange }) {
  const [backendHealth, setBackendHealth] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const data = await res.json();
        setBackendHealth(data);
        if (onHealthChange) {
          onHealthChange(data);
        }
      } else {
        setBackendHealth(null);
        if (onHealthChange) onHealthChange(null);
      }
    } catch {
      setBackendHealth(null);
      if (onHealthChange) onHealthChange(null);
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
  const isRedisReady = Boolean(backendHealth && backendHealth.redis === 'ready');

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Title & Live Indicators */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            {language === 'hi' ? 'सिस्टम स्थिति' : 'SYSTEM STATUS'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Sync Button */}
        <button
          type="button"
          onClick={() => {
            checkHealth();
            if (onReconnect) onReconnect();
          }}
          disabled={isChecking}
          className="inline-flex items-center justify-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono transition border border-slate-700 disabled:opacity-50 self-start sm:self-center"
          title="Refresh health checks and sync connection"
        >
          <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{language === 'hi' ? 'स्थिति सिंक' : 'Sync'}</span>
        </button>
      </div>

      {/* Technical Status Grid (Part 11) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-xs font-mono">
        {/* 1. Backend */}
        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isBackendOnline ? 'bg-emerald-400' : 'bg-rose-500'}`} />
          <div className="min-w-0">
            <span className="text-[9px] text-slate-500 uppercase block">Backend</span>
            <span className={`text-[11px] font-bold ${isBackendOnline ? 'text-emerald-300' : 'text-rose-300'}`}>
              {isBackendOnline ? 'Connected' : 'Offline'}
            </span>
          </div>
        </div>

        {/* 2. Redis */}
        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isRedisReady ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <div className="min-w-0">
            <span className="text-[9px] text-slate-500 uppercase block">Redis</span>
            <span className={`text-[11px] font-bold ${isRedisReady ? 'text-emerald-300' : 'text-amber-300'}`}>
              {isRedisReady ? 'Ready' : 'Offline'}
            </span>
          </div>
        </div>

        {/* 3. Stream */}
        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isRedisReady ? 'bg-indigo-400' : 'bg-slate-600'}`} />
          <div className="min-w-0">
            <span className="text-[9px] text-slate-500 uppercase block">Stream</span>
            <span className="text-[11px] font-bold text-indigo-300 truncate block">
              investor-events
            </span>
          </div>
        </div>

        {/* 4. Worker */}
        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isBackendOnline ? 'bg-emerald-400' : 'bg-slate-600'}`} />
          <div className="min-w-0">
            <span className="text-[9px] text-slate-500 uppercase block">Worker</span>
            <span className="text-[11px] font-bold text-emerald-300 truncate block">
              {isBackendOnline ? 'Processing' : 'Standby'}
            </span>
          </div>
        </div>

        {/* 5. WebSocket */}
        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center space-x-2 col-span-2 sm:col-span-1">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              isWsConnected ? 'bg-cyan-400' : wsStatus === 'CONNECTING' ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <div className="min-w-0">
            <span className="text-[9px] text-slate-500 uppercase block">WebSocket</span>
            <span
              className={`text-[11px] font-bold ${
                isWsConnected ? 'text-cyan-300' : wsStatus === 'CONNECTING' ? 'text-amber-300' : 'text-rose-300'
              }`}
            >
              {isWsConnected ? 'Live' : wsStatus === 'CONNECTING' ? 'Connecting' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
