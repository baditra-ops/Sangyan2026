import React from 'react';
import { ArrowRight, Cpu, Radio, ShieldCheck, Database, Laptop, Send } from 'lucide-react';

const ARCHITECTURE_STAGES = [
  {
    step: '1',
    title: 'React Simulator',
    tech: 'POST /events',
    sub: 'Synthetic Decision Event',
    icon: Send,
    color: 'indigo',
  },
  {
    step: '2',
    title: 'Redis Stream',
    tech: 'investor-events',
    sub: 'XADD Ingestion Log',
    icon: Database,
    color: 'emerald',
  },
  {
    step: '3',
    title: 'Behaviour Worker',
    tech: 'behaviour-workers',
    sub: 'XREADGROUP Consumer',
    icon: Cpu,
    color: 'amber',
  },
  {
    step: '4',
    title: 'Risk Engine',
    tech: 'Transparent Rules',
    sub: 'Explainable Heuristics',
    icon: ShieldCheck,
    color: 'purple',
  },
  {
    step: '5',
    title: 'WebSocket Delivery',
    tech: 'ws://host:5000/ws',
    sub: 'Targeted Client Broadcast',
    icon: Radio,
    color: 'cyan',
  },
  {
    step: '6',
    title: 'React Dashboard',
    tech: 'Safety Console',
    sub: 'Real-Time Intervention',
    icon: Laptop,
    color: 'emerald',
  },
];

export default function SystemFlowVisualization() {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            END-TO-END ARCHITECTURAL PIPELINE
          </h3>
          <p className="text-[11px] text-slate-400">
            Real-time asynchronous stream flow from simulated event to safety dashboard
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 self-start sm:self-center">
          Zero external DB • Redis Streams + WebSockets only
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
        {ARCHITECTURE_STAGES.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="relative p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col items-center text-center transition hover:border-indigo-500/40"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono text-indigo-400 font-bold mb-0.5">
                STAGE 0{s.step}
              </span>
              <span className="text-xs font-bold text-slate-200 mb-1 leading-tight">
                {s.title}
              </span>
              <span className="text-[10px] font-mono text-slate-400 line-clamp-1">
                {s.tech}
              </span>
              <span className="text-[9px] text-slate-500 mt-0.5">
                {s.sub}
              </span>

              {/* Arrow indicator between cards on desktop */}
              {idx < ARCHITECTURE_STAGES.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
