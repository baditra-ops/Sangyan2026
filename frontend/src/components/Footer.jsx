import React from 'react';
import { PauseCircle, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 text-xs text-slate-500 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <PauseCircle className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-300 font-mono">PAUSE</span>
            <span className="text-slate-500 ml-1.5">• Real-Time Investor Behavioural Safety System</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <span>SANGYAN Hackathon Prototype</span>
          <span>•</span>
          <span>Synthetic Simulation Data</span>
          <span>•</span>
          <span>Transparent Rule Engine</span>
        </div>

        <p className="text-[11px] text-slate-500">
          Non-advisory educational platform. Does not execute or predict trades.
        </p>
      </div>
    </footer>
  );
}
