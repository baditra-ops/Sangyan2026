import React from 'react';
import { AlertCircle, Clock, Zap, TrendingUp, ShieldCheck } from 'lucide-react';

const SIGNAL_ICONS = {
  RAPID_DECISIONS: Zap,
  CONSECUTIVE_LOSSES: AlertCircle,
  INCREASING_AMOUNT_AFTER_LOSS: TrendingUp,
  ODD_HOUR_ACTIVITY: Clock,
};

const SEVERITY_BADGES = {
  HIGH: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  LOW: 'bg-slate-700/30 text-slate-300 border-slate-600/40',
};

export default function BehaviourSignals({ signals = [] }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            DETECTED BEHAVIOURAL SIGNALS
          </h3>
          <p className="text-[11px] text-slate-500">Observable decision patterns extracted by Risk Engine</p>
        </div>
        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          {signals.length} {signals.length === 1 ? 'Signal' : 'Signals'}
        </span>
      </div>

      {signals.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-slate-800/80 rounded-lg">
          <ShieldCheck className="w-8 h-8 text-emerald-400/80 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-300">No Behavioural Warnings Active</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Simulated activity reflects steady, paced decisions without loss-chasing patterns.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {signals.map((sig, idx) => {
            const Icon = SIGNAL_ICONS[sig.type] || AlertCircle;
            const badgeClass = SEVERITY_BADGES[sig.severity] || SEVERITY_BADGES.LOW;

            return (
              <div
                key={`${sig.type}-${idx}`}
                className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/90 flex items-start space-x-3 transition hover:border-slate-700/80"
              >
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400 flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      {sig.type.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}
                      >
                        {sig.severity}
                      </span>
                      {sig.points !== undefined && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          +{sig.points} pts
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-normal">{sig.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
