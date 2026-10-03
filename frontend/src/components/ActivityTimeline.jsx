import React from 'react';
import {
  History,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  Zap,
  ShieldAlert,
  BookOpen,
  Activity,
  Send,
  PauseCircle,
} from 'lucide-react';

const TYPE_CONFIG = {
  EVENT_RECEIVED: {
    label: 'EVENT RECEIVED',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    icon: Send,
  },
  SIGNAL_DETECTED: {
    label: 'SIGNAL DETECTED',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    icon: Zap,
  },
  ASSESSMENT_UPDATED: {
    label: 'ASSESSMENT UPDATED',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    icon: Activity,
  },
  COOLING_OFF_ACTIVATED: {
    label: 'COOLING-OFF ACTIVATED',
    color: 'text-rose-400 bg-rose-500/15 border-rose-500/40',
    icon: PauseCircle,
  },
  REFLECTION_RECORDED: {
    label: 'REFLECTION RECORDED',
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    icon: BookOpen,
  },
};

export default function ActivityTimeline({ events = [], language = 'en' }) {
  const formatTime = (ts) => {
    if (!ts) return 'Just now';
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              {language === 'hi' ? 'लाइव गतिविधि समयरेखा' : 'LIVE ACTIVITY TIMELINE'}
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Event stream & behavioural intervention audit trail
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          {events.length} {events.length === 1 ? 'Entry' : 'Entries'}
        </span>
      </div>

      {/* Timeline items */}
      {events.length === 0 ? (
        <div className="py-7 text-center border border-dashed border-slate-800 rounded-lg p-4">
          <History className="w-7 h-7 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-300 font-medium">
            {language === 'hi' ? 'इस सत्र में कोई हालिया गतिविधि नहीं है' : 'No activity recorded in this session yet'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
            {language === 'hi'
              ? 'सिमुलेटेड निर्णय भेजने के लिए ऊपर दिए गए सिमुलेटर का उपयोग करें।'
              : 'Trigger a simulated event above to watch timeline entries populate in real-time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {events.map((ev, i) => {
            const itemType = ev.timelineType || 'EVENT_RECEIVED';
            const config = TYPE_CONFIG[itemType] || TYPE_CONFIG.EVENT_RECEIVED;
            const Icon = config.icon;
            const timeStr = formatTime(ev.timestamp || ev.receivedAt);

            const outcome = (ev.outcome || '').toUpperCase();
            let outcomeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
            if (outcome === 'WIN') outcomeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            if (outcome === 'LOSS') outcomeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';

            return (
              <div
                key={ev.timelineId || ev.eventId || ev.id || ev.streamId || i}
                className={`p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-start justify-between text-xs transition-all duration-200 hover:border-slate-700 ${
                  i === 0 ? 'border-indigo-500/30 ring-1 ring-indigo-500/20' : ''
                }`}
              >
                <div className="flex items-start space-x-3 min-w-0">
                  <div className={`p-1.5 rounded-lg border flex-shrink-0 mt-0.5 ${config.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="font-semibold text-slate-200 truncate font-mono">
                        {ev.title || ev.eventType || 'INVESTMENT_DECISION'}
                      </span>
                      {ev.amount && (
                        <span className="font-mono text-emerald-300 font-bold">
                          ₹{Number(ev.amount).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {ev.description && (
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {ev.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{timeStr}</span>
                      {ev.streamId && <span>• ID: {ev.streamId}</span>}
                    </div>
                  </div>
                </div>

                {outcome && (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase font-mono ml-2 flex-shrink-0 ${outcomeStyle}`}>
                    {outcome}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
