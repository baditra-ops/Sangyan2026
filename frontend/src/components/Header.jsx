import React from 'react';
import { PauseCircle, BookOpen } from 'lucide-react';
import LanguageToggle from './LanguageToggle';

export default function Header({
  language,
  onToggleLanguage,
  onOpenJournal,
  isBackendOnline = false,
  wsStatus = 'DISCONNECTED',
  isRedisReady = false,
}) {
  const isWsLive = wsStatus === 'CONNECTED';
  const isStreamingReady = isBackendOnline && isRedisReady;

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/20 ring-1 ring-white/10">
            <PauseCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">PAUSE</span>
              <span className="px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                SAFETY ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide hidden sm:block">
              {language === 'hi'
                ? 'रियल-टाइम निवेशक व्यवहारिक सुरक्षा'
                : 'REAL-TIME INVESTOR BEHAVIOURAL SAFETY'}
            </p>
          </div>
        </div>

        {/* Live Actual Status Indicators (Part 2) */}
        <div className="hidden lg:flex items-center space-x-2 text-[10px] font-mono font-medium">
          {/* Backend Status */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border ${
              isBackendOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isBackendOnline ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'
              }`}
            />
            <span>{isBackendOnline ? 'BACKEND CONNECTED' : 'BACKEND OFFLINE'}</span>
          </div>

          {/* Streaming Status */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border ${
              isStreamingReady
                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isStreamingReady ? 'bg-indigo-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span>{isStreamingReady ? 'STREAMING' : 'STREAM PENDING'}</span>
          </div>

          {/* WebSocket Status */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border ${
              isWsLive
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                : wsStatus === 'CONNECTING'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isWsLive
                  ? 'bg-cyan-400'
                  : wsStatus === 'CONNECTING'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-400'
              }`}
            />
            <span>{isWsLive ? 'WEBSOCKET LIVE' : wsStatus === 'CONNECTING' ? 'WS RECONNECTING' : 'WS OFFLINE'}</span>
          </div>
        </div>

        {/* Prototype Environment Pill */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="tracking-wide text-[11px] font-mono">SIMULATED DATA • PROTOTYPE ENVIRONMENT</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick-Action: Review Decision */}
          <button
            type="button"
            onClick={onOpenJournal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-semibold text-indigo-300 hover:text-white transition shadow-sm active:scale-95 min-h-[38px]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'hi' ? 'निर्णय समीक्षा' : 'Review My Decision'}
            </span>
          </button>

          {/* Language Toggle: EN | हिंदी */}
          <LanguageToggle language={language} onToggle={onToggleLanguage} />
        </div>
      </div>
    </header>
  );
}
