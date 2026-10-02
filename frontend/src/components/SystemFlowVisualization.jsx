import React from 'react';
import { ArrowRight, Cpu, Radio, ShieldCheck, Database, Laptop, Send } from 'lucide-react';

const STAGES = [
  { step: '1', title: 'Simulated Event', tech: 'HTTP POST /events', icon: Send },
  { step: '2', title: 'Redis Stream', tech: 'investor-events (XADD)', icon: Database },
  { step: '3', title: 'Worker Consumer', tech: 'behaviour-workers', icon: Cpu },
  { step: '4', title: 'Risk Engine', tech: 'Transparent Rule Engine', icon: ShieldCheck },
  { step: '5', title: 'WebSocket Delivery', tech: 'ws://host:5000/ws', icon: Radio },
  { step: '6', title: 'Safety Console', tech: 'React Dashboard UI', icon: Laptop },
];

export default function SystemFlowVisualization() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          END-TO-END ARCHITECTURAL PIPELINE
        </h3>
        <p className="text-[11px] text-slate-500">Real-time asynchronous stream flow from simulated event to safety dashboard</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {STAGES.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="relative p-3 rounded-lg bg-slate-950/70 border border-slate-800/90 flex flex-col items-center text-center transition hover:border-indigo-500/40"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-mono text-indigo-400 font-bold mb-0.5">Stage {s.step}</span>
              <span className="text-xs font-semibold text-slate-200 mb-1 leading-tight">{s.title}</span>
              <span className="text-[10px] font-mono text-slate-500 line-clamp-1">{s.tech}</span>

              {/* Arrow indicator between cards on desktop */}
              {idx < STAGES.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
