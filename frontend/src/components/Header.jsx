import React from 'react';
import { ShieldAlert, PauseCircle, Activity, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <PauseCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">PAUSE</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Resilience Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block tracking-wide">
              REAL-TIME INVESTOR BEHAVIOURAL SAFETY SYSTEM
            </p>
          </div>
        </div>

        {/* Prototype safety badges */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-medium">Synthetic Simulation</span>
          </div>

          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Non-Trading Safety Layer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
