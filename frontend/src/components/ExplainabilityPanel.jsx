import React from 'react';
import { HelpCircle, Check, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ExplainabilityPanel({ assessment }) {
  const reasons = assessment && assessment.reasons ? assessment.reasons : [];
  const hasSignals = reasons.length > 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-3">
        <HelpCircle className="w-4 h-4 text-indigo-400" />
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          EXPLAINABILITY: WHY DID PAUSE RESPOND?
        </h3>
      </div>

      <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-3">
        {hasSignals ? (
          <div>
            <p className="text-xs text-slate-300 font-semibold mb-2">
              Behavioural risk score ({assessment.riskScore}/100) was calculated based on explicit triggers:
            </p>
            <ul className="space-y-1.5 pl-1">
              {reasons.map((r, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-slate-400 leading-relaxed">
            {assessment
              ? 'No adverse behavioural rules were breached during this session. Decision pacing and loss sequences remain within normal parameters.'
              : 'Monitoring is active. When simulated events arrive, the Risk Engine audits decision pace, outcome streaks, and timing against transparent rules.'}
          </p>
        )}

        {/* Scoring logic reference */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400">
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[9px]">RAPID DECISIONS</span>
            <span className="text-slate-200">+20 pts</span>
          </div>
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[9px]">CONSECUTIVE LOSSES</span>
            <span className="text-slate-200">+30 pts</span>
          </div>
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[9px]">LOSS ESCALATION</span>
            <span className="text-slate-200">+30 pts</span>
          </div>
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[9px]">ODD HOURS (0-5 IST)</span>
            <span className="text-slate-200">+10 pts</span>
          </div>
        </div>

        {/* Regulatory & Safety Notice */}
        <div className="pt-2 text-[11px] text-slate-500 leading-normal italic">
          Disclaimer: These behavioural thresholds are deterministic prototype heuristics engineered for the SANGYAN Hackathon demonstration and are not official SEBI regulatory thresholds.
        </div>
      </div>
    </div>
  );
}
