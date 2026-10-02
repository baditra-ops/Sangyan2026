import React from 'react';
import { History, ArrowUpRight, ArrowDownRight, Minus, Clock, Radio } from 'lucide-react';

export default function ActivityTimeline({ events = [], language = 'en' }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {language === 'hi' ? 'लाइव सिमुलेटेड गतिविधि' : 'LIVE SIMULATED ACTIVITY'}
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              {language === 'hi'
                ? 'रेडिस स्ट्रीम: investor-events'
                : 'Redis Stream: investor-events'}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          {events.length} {events.length === 1 ? 'Event' : 'Events'}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="py-7 text-center border border-dashed border-slate-800 rounded-lg p-4">
          <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-300 font-medium">
            {language === 'hi' ? 'इस स्ट्रीम में कोई हालिया निर्णय नहीं है' : 'No recent decisions in this stream'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
            {language === 'hi'
              ? 'सिमुलेटेड निवेशक निर्णय भेजने के लिए ऊपर दिए गए सिमुलेटर का उपयोग करें।'
              : 'Use the Synthetic Event Simulator above to trigger simulated investor decisions.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {events.map((ev, i) => {
            const timeStr = ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : 'Just now';
            const outcome = (ev.outcome || 'NEUTRAL').toUpperCase();

            let outcomeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
            let Icon = Minus;

            if (outcome === 'WIN') {
              outcomeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
              Icon = ArrowUpRight;
            } else if (outcome === 'LOSS') {
              outcomeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
              Icon = ArrowDownRight;
            }

            return (
              <div
                key={ev.eventId || ev.id || ev.streamId || i}
                className={`p-3 rounded-lg bg-slate-950/70 border border-slate-800/90 flex items-center justify-between text-xs transition hover:border-slate-700 ${
                  i === 0 ? 'ring-1 ring-indigo-500/30 shadow-sm animate-in fade-in duration-300' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded-lg border ${outcomeStyle}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-200">{ev.eventType || 'INVESTMENT_DECISION'}</span>
                      {ev.amount && (
                        <span className="font-mono text-slate-300 font-bold">
                          ₹{Number(ev.amount).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{timeStr}</span>
                      {ev.streamId && <span>• ID: {ev.streamId}</span>}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${outcomeStyle}`}>
                  {outcome}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
