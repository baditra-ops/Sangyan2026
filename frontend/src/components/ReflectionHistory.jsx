import React from 'react';
import { BookOpen, Clock, BrainCircuit, PlusCircle } from 'lucide-react';
import { translations } from '../utils/reflectionTranslations';

export default function ReflectionHistory({
  reflections = [],
  selectedInvestor,
  onOpenJournal,
  language = 'en',
}) {
  const t = translations[language] || translations.en;

  // Format time nicely
  const formatTime = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return t.justNow;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 flex-shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {t.historyHeading}
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono">
                {t.historyBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {selectedInvestor} • {reflections.length} {reflections.length === 1 ? 'entry' : 'entries'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenJournal}
          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-semibold transition flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-indigo-400 min-h-[38px]"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{t.reviewDecisionButton}</span>
        </button>
      </div>

      {/* History List */}
      {reflections.length === 0 ? (
        <div className="py-7 text-center space-y-2 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-4">
          <BrainCircuit className="w-8 h-8 mx-auto text-slate-600 mb-1" />
          <p className="text-xs text-slate-300 font-medium">
            {language === 'hi' ? 'कोई चिंतन दर्ज नहीं है' : 'No reflections recorded yet'}
          </p>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
            {t.historyEmpty}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reflections.slice(0, 5).map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2 transition hover:border-slate-700/80"
            >
              {/* Top row: Timestamp & Time Horizon Badge */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center space-x-1 text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{formatTime(entry.timestamp)}</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-teal-300 border border-slate-700">
                  {entry.timeHorizon}
                </span>
              </div>

              {/* Reason */}
              <div className="text-xs">
                <span className="text-slate-400 font-medium mr-1.5">{t.reasonLabel}:</span>
                <span className="text-slate-200 font-semibold">{entry.reason}</span>
              </div>

              {/* Time Horizon line */}
              <div className="text-xs text-slate-300">
                <span className="text-slate-400 font-medium mr-1.5">{t.timeHorizonLabel}:</span>
                <span className="text-slate-200">{entry.timeHorizon}</span>
              </div>

              {/* Reflection quote if provided */}
              {(entry.whatChanged || entry.reconsiderationPoint) && (
                <div className="pt-2 border-t border-slate-800/80 text-xs space-y-1.5">
                  {entry.whatChanged && (
                    <p className="text-slate-300 italic bg-slate-900/80 p-2 rounded-lg border border-slate-800/70">
                      "{entry.whatChanged}"
                    </p>
                  )}
                  {entry.reconsiderationPoint && (
                    <p className="text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-400">
                        {language === 'hi' ? 'पुनर्विचार स्थिति:' : 'Reconsider condition:'}
                      </span>{' '}
                      "{entry.reconsiderationPoint}"
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
