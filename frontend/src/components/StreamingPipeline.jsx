import React, { useEffect, useState, useRef } from 'react';
import { Send, Database, Cpu, ShieldCheck, Radio, Laptop, CheckCircle2, Zap } from 'lucide-react';

const PIPELINE_STAGES = [
  {
    id: 1,
    name: 'SIMULATOR',
    sub: 'Event Dispatched',
    protocol: 'POST /events',
    icon: Send,
    color: 'indigo',
  },
  {
    id: 2,
    name: 'REDIS STREAM',
    sub: 'investor-events',
    protocol: 'XADD stream',
    icon: Database,
    color: 'emerald',
  },
  {
    id: 3,
    name: 'BEHAVIOUR WORKER',
    sub: 'behaviour-workers',
    protocol: 'XREADGROUP',
    icon: Cpu,
    color: 'amber',
  },
  {
    id: 4,
    name: 'RISK ENGINE',
    sub: 'Explainable Rules',
    protocol: 'Deterministic',
    icon: ShieldCheck,
    color: 'purple',
  },
  {
    id: 5,
    name: 'WEBSOCKET',
    sub: 'Real-Time /ws',
    protocol: 'ws://host/ws',
    icon: Radio,
    color: 'cyan',
  },
  {
    id: 6,
    name: 'LIVE DASHBOARD',
    sub: 'Safety Console',
    protocol: 'Instant Render',
    icon: Laptop,
    color: 'emerald',
  },
];

/**
 * Compact real-time streaming pipeline visualization.
 * Triggers a fast (1.2s) animated packet pulse through the 6 stages
 * whenever a REAL simulated event enters the pipeline.
 *
 * @param {Object} props
 * @param {string|number|null} props.activeEventTrigger - Changes whenever a real event is sent
 * @param {string} props.language - Current language ('en' | 'hi')
 */
export default function StreamingPipeline({ activeEventTrigger, language = 'en' }) {
  const [activeStep, setActiveStep] = useState(0); // 0 = idle, 1..6 = active stage
  const timerRef = useRef(null);

  useEffect(() => {
    if (!activeEventTrigger) return;

    // Clear any ongoing animation
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Rapid sequence through 6 stages (200ms per stage = 1200ms total)
    let current = 1;
    setActiveStep(1);

    timerRef.current = setInterval(() => {
      current += 1;
      if (current <= 6) {
        setActiveStep(current);
      } else {
        clearInterval(timerRef.current);
        timerRef.current = null;
        // Hold on stage 6 briefly then return to idle
        setTimeout(() => {
          setActiveStep(0);
        }, 300);
      }
    }, 200);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeEventTrigger]);

  const isStreaming = activeStep > 0;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm backdrop-blur-sm relative overflow-hidden transition-all duration-300">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>{language === 'hi' ? 'रीयल-टाइम स्ट्रीम पाइपलाइन' : 'REAL-TIME STREAMING PIPELINE'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-normal">
                Redis Stream: investor-events
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {language === 'hi'
                ? 'सिमुलेटर से सुरक्षा कंसोल तक डेटा पैकेट का सीधा प्रवाह'
                : 'Live asynchronous data packet transit from simulated event to safety dashboard'}
            </p>
          </div>
        </div>

        {/* Live Pipeline Status Badge */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          {isStreaming ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 animate-pulse font-mono">
              <Zap className="w-3 h-3 text-emerald-400 fill-current" />
              <span>{language === 'hi' ? `पैकेट पारगमन: स्टेज ${activeStep}/6` : `PACKET IN TRANSIT: STAGE ${activeStep}/6`}</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span>{language === 'hi' ? 'पाइपलाइन निष्क्रिय (प्रतीक्षारत)' : 'PIPELINE IDLE (LISTENING)'}</span>
            </span>
          )}
        </div>
      </div>

      {/* 6-Node Pipeline Flow Container */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-2.5 relative">
        {PIPELINE_STAGES.map((stage) => {
          const Icon = stage.icon;
          const isActive = activeStep === stage.id;
          const isPassed = activeStep > stage.id;

          let borderClass = 'border-slate-800/80 bg-slate-950/60';
          let iconColor = 'text-slate-400 bg-slate-900 border-slate-800';
          let textColor = 'text-slate-300';
          let badgeColor = 'text-slate-500';

          if (isActive) {
            borderClass = 'border-indigo-400 bg-indigo-950/40 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/20';
            iconColor = 'text-white bg-indigo-600 border-indigo-400 shadow-md';
            textColor = 'text-white font-bold';
            badgeColor = 'text-indigo-300 font-bold';
          } else if (isPassed) {
            borderClass = 'border-emerald-500/40 bg-emerald-950/20';
            iconColor = 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30';
            textColor = 'text-slate-200';
            badgeColor = 'text-emerald-400';
          }

          return (
            <div
              key={stage.id}
              className={`relative p-3 rounded-xl border flex flex-col items-center text-center transition-all duration-200 ${borderClass}`}
            >
              {/* Stage Number & Icon */}
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-2 transition-all duration-200 ${iconColor}`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Stage Name */}
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Stage 0{stage.id}
              </span>
              <span className={`text-xs tracking-tight leading-tight mt-0.5 ${textColor}`}>
                {stage.name}
              </span>

              {/* Secondary details */}
              <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {stage.sub}
              </span>
              <span className={`text-[9px] font-mono mt-1 ${badgeColor}`}>
                {stage.protocol}
              </span>

              {/* Real-time pulse indicator on active stage */}
              {isActive && (
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-indigo-400 animate-ping" />
              )}
            </div>
          );
        })}
      </div>

      {/* Real-time progression bar along bottom */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-2 font-mono text-[10px]">
          <span className="text-slate-500">Transit Protocol:</span>
          <span className="text-slate-300">HTTP → Redis Stream (XADD) → Consumer Group (XREADGROUP) → Risk Engine → WS Broadcast</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
          {isStreaming ? 'Packet Active • End-to-End ~1.2s' : 'Awaiting Next Event'}
        </span>
      </div>
    </div>
  );
}
