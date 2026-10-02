import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-indigo-300 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold tracking-wide">SANGYAN INVESTOR RESILIENCE PROTOTYPE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              PAUSE BEFORE THE NEXT DECISION.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              PAUSE monitors simulated investor activity in real time and highlights observable behavioural
              patterns—such as rapid decisions, loss-chasing, or odd-hour execution—encouraging a reflective pause
              before subsequent actions.
            </p>
          </div>

          {/* Educational notice card */}
          <div className="flex-shrink-0 w-full md:w-80 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start space-x-3 shadow-inner">
            <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-200 block">Educational Safety Console</span>
              <p className="text-slate-400 text-[11px] leading-normal">
                This console operates solely on synthetic simulation data. It does not provide financial advice, price predictions, or broker routing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
