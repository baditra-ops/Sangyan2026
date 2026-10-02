import React, { useState } from 'react';
import { PauseCircle, AlertOctagon, CheckCircle2, HeartHandshake, ShieldQuestion } from 'lucide-react';

export default function CoolingOffPanel({ coolingOff, reason, reasons = [] }) {
  const [isDismissed, setIsDismissed] = useState(false);

  // If not in cooling off state, or if user explicitly acknowledged for this cycle
  if (!coolingOff || isDismissed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-900/90 p-6 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
      {/* Subtle indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg shadow-amber-500/10">
            <PauseCircle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950">
                SAFETY INTERVENTION ACTIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">Cooling-Off Protocol</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              TAKE A PAUSE.
            </h2>

            <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
              Several behavioural warning signals have appeared concurrently. We encourage you to take a brief
              reflective pause before making further investment decisions. Stepping away for even a few minutes helps
              mitigate emotional decision biases like loss-chasing.
            </p>

            {/* Why PAUSE Activated */}
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                Why PAUSE Activated:
              </span>
              {reasons.length > 0 ? (
                <ul className="space-y-1.5">
                  {reasons.map((r, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span className="font-medium">{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">{reason || 'Compound behavioural patterns exceeded safety thresholds.'}</p>
              )}
            </div>

            {/* Safety boundary assurance */}
            <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-400">
              <ShieldQuestion className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span>
                PAUSE does not block transactions, cancel orders, or offer financial advice. This alert exists strictly for cognitive reflection.
              </span>
            </div>
          </div>
        </div>

        {/* User reflection action */}
        <div className="flex-shrink-0 flex flex-col items-center sm:items-end justify-center self-center md:self-start pt-2">
          <button
            onClick={() => setIsDismissed(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold tracking-wide border border-slate-700 transition flex items-center space-x-2 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>I Acknowledge & Reflect</span>
          </button>
          <span className="text-[10px] text-slate-500 mt-1">Encouraged 5-min cognitive break</span>
        </div>
      </div>
    </div>
  );
}
