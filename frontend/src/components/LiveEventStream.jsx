import React from 'react';
import { Database, Radio, Check, Clock, ArrowDownRight, ArrowUpRight, Minus, Hash, Activity } from 'lucide-react';

/**
 * Live Event Stream Visualization Component.
 * Displays the active Redis Stream (investor-events), latest ingested event,
 * processing stages (Received -> Streamed -> Processed), and a rolling list of recent stream entries.
 *
 * Driven by REAL events from the backend/simulator.
 */
export default function LiveEventStream({ streamEvents = [], latestEvent = null, language = 'en' }) {
  const currentEvent = latestEvent || (streamEvents.length > 0 ? streamEvents[0] : null);

  const formatCurrency = (amt) => {
    if (typeof amt !== 'number') return null;
    return `₹${amt.toLocaleString('en-IN')}`;
  };

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
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm backdrop-blur-sm space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                {language === 'hi' ? 'लाइव इवेंट स्ट्रीम' : 'LIVE EVENT STREAM'}
              </h3>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono mt-0.5">
              <span>Redis Stream:</span>
              <strong className="text-emerald-400 font-semibold">investor-events</strong>
            </div>
          </div>
        </div>

        {/* Stream metadata */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
          <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800">
            Consumer Group: <span className="text-indigo-300">behaviour-workers</span>
          </span>
          <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
            {streamEvents.length} {streamEvents.length === 1 ? 'Event' : 'Events'}
          </span>
        </div>
      </div>

      {/* Latest Event Card */}
      {currentEvent ? (
        <div className="rounded-xl border border-slate-700/80 bg-slate-950/80 p-4 space-y-3 relative overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
              <span>{language === 'hi' ? 'नवीनतम स्ट्रीम प्रविष्टि' : 'LATEST STREAM ENTRY'}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
              <Clock className="w-2.5 h-2.5 text-slate-500" />
              <span>{formatTime(currentEvent.timestamp || currentEvent.receivedAt)}</span>
            </span>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Event Type</span>
              <span className="text-xs font-bold text-white font-mono truncate block mt-0.5">
                {currentEvent.eventType || 'INVESTMENT_DECISION'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Investor ID</span>
              <span className="text-xs font-bold text-indigo-300 font-mono truncate block mt-0.5">
                {currentEvent.investorId || 'investor-001'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Simulated Amount</span>
              <span className="text-xs font-bold text-emerald-400 font-mono truncate block mt-0.5">
                {currentEvent.amount ? formatCurrency(currentEvent.amount) : 'N/A'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Outcome</span>
              <div className="flex items-center space-x-1 mt-0.5">
                {currentEvent.outcome === 'WIN' && (
                  <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> WIN
                  </span>
                )}
                {currentEvent.outcome === 'LOSS' && (
                  <span className="text-xs font-bold text-rose-400 font-mono flex items-center gap-1">
                    <ArrowDownRight className="w-3.5 h-3.5" /> LOSS
                  </span>
                )}
                {(!currentEvent.outcome || currentEvent.outcome === 'NEUTRAL') && (
                  <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1">
                    <Minus className="w-3.5 h-3.5" /> NEUTRAL
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Redis Stream ID */}
          <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-400">
              <Hash className="w-3.5 h-3.5 text-indigo-400" />
              <span>Redis Stream ID:</span>
              <span className="text-slate-100 font-bold select-all">
                {currentEvent.streamId || 'Pending ingestion...'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Key: investor-events</span>
          </div>

          {/* Stage Verification Status Checklist */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[10px] font-mono">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <Check className="w-3 h-3 stroke-[3]" />
              <span className="font-bold">EVENT RECEIVED</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <Check className="w-3 h-3 stroke-[3]" />
              <span className="font-bold">STREAMED (XADD)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <Check className="w-3 h-3 stroke-[3]" />
              <span className="font-bold">PROCESSED (XACK)</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-7 text-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-4 space-y-1.5">
          <Activity className="w-6 h-6 text-slate-600 mx-auto mb-1 animate-pulse" />
          <p className="text-xs font-semibold text-slate-300">
            {language === 'hi' ? 'रेडिस स्ट्रीम में घटना की प्रतीक्षा' : 'Awaiting Events in Redis Stream'}
          </p>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto font-mono">
            Target Stream: investor-events • Click PACED, RAPID DECISIONS, or LOSS CHASING to publish.
          </p>
        </div>
      )}

      {/* Rolling Recent Stream Events List (Part 8) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
          <span>{language === 'hi' ? 'हाल की स्ट्रीम प्रविष्टियाँ (रोलिंग लॉग)' : 'RECENT STREAM ENTRIES (ROLLING LOG)'}</span>
          <span>Max 10 retained</span>
        </div>

        {streamEvents.length === 0 ? (
          <div className="text-center py-3 text-[11px] text-slate-600 font-mono">
            Log empty. Run a simulation scenario above.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {streamEvents.slice(0, 10).map((ev, idx) => {
              const timeStr = formatTime(ev.timestamp || ev.receivedAt);
              const outcome = (ev.outcome || 'NEUTRAL').toUpperCase();
              let outcomeBadge = 'text-slate-400 border-slate-700 bg-slate-800';
              if (outcome === 'WIN') outcomeBadge = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
              if (outcome === 'LOSS') outcomeBadge = 'text-rose-400 border-rose-500/30 bg-rose-500/10';

              return (
                <div
                  key={ev.streamId || ev.eventId || ev.id || idx}
                  className={`p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/90 flex items-center justify-between text-xs font-mono transition-all duration-200 hover:border-slate-700 ${
                    idx === 0 ? 'border-indigo-500/40 bg-slate-950/90 shadow-sm' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-slate-400 text-[11px] flex-shrink-0">{timeStr}</span>
                    <span className="font-bold text-slate-200 truncate">
                      {ev.eventType || 'INVESTMENT_DECISION'}
                    </span>
                    <span className="text-indigo-300 font-semibold flex-shrink-0">
                      {ev.investorId}
                    </span>
                    {ev.amount && (
                      <span className="text-slate-300 font-bold flex-shrink-0">
                        {formatCurrency(ev.amount)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${outcomeBadge}`}>
                      {outcome}
                    </span>
                    {ev.streamId && (
                      <span className="text-[10px] text-slate-500 hidden md:inline truncate max-w-[120px]">
                        ID: {ev.streamId}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
