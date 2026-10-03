import React, { useState } from 'react';
import { PauseCircle, CheckCircle2, ShieldQuestion, BookOpen, AlertCircle } from 'lucide-react';
import { translations } from '../utils/reflectionTranslations';

export default function CoolingOffPanel({
  coolingOff,
  reason,
  reasons = [],
  onOpenJournal,
  language = 'en',
}) {
  const [isDismissed, setIsDismissed] = useState(false);
  const t = translations[language] || translations.en;

  // If not in cooling off state, or if user explicitly acknowledged for this cycle
  if (!coolingOff || isDismissed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-slate-900/95 to-slate-900/95 p-6 shadow-xl backdrop-blur-md transition-all duration-300 cooling-off-glow">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400" />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-md">
            <PauseCircle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 font-mono">
                {language === 'hi' ? 'सुरक्षा हस्तक्षेप सक्रिय' : 'SAFETY INTERVENTION ACTIVE'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {language === 'hi' ? 'कूलिंग-ऑफ प्रोटोकॉल' : 'Cooling-Off Protocol'}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {language === 'hi' ? 'एक ठहराव लें।' : 'TAKE A PAUSE.'}
            </h2>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {language === 'hi'
                ? 'आपकी हालिया गतिविधि कई व्यवहारिक संकेतों को दर्शाती है। आगे बढ़ने से पहले थोड़ा समय लें और अपने कारणों की समीक्षा करें।'
                : 'Your recent activity shows several behavioural signals. Take a moment before continuing to review your reasoning.'}
            </p>

            {/* Why PAUSE Activated */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2 font-mono">
                {language === 'hi' ? 'सक्रिय होने के कारण:' : 'Why PAUSE Activated:'}
              </span>
              {reasons.length > 0 ? (
                <ul className="space-y-1.5">
                  {reasons.map((r, i) => (
                    <li key={i} className="text-xs text-slate-200 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="font-medium">{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  {reason || (language === 'hi' ? 'संयुक्त व्यवहारिक पैटर्न सुरक्षा सीमा से अधिक हुए।' : 'Compound behavioural patterns exceeded safety thresholds.')}
                </p>
              )}
            </div>

            {/* Safety boundary assurance */}
            <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-400">
              <ShieldQuestion className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span>
                {language === 'hi'
                  ? 'PAUSE लेन-देन को ब्लॉक नहीं करता है और न ही वित्तीय सलाह देता है। यह विशुद्ध रूप से संज्ञानात्मक चिंतन के लिए है।'
                  : 'PAUSE does not block transactions, cancel orders, or offer financial advice. This intervention exists strictly for cognitive reflection.'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Panel: Prominent Review My Decision Button */}
        <div className="flex-shrink-0 flex flex-col sm:items-end justify-center self-center md:self-start pt-2 space-y-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenJournal}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all duration-200 active:scale-95 flex items-center justify-center space-x-2 font-mono min-h-[44px]"
          >
            <BookOpen className="w-4 h-4 text-slate-950" />
            <span>{t.reviewDecisionButton}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold tracking-wide border border-slate-700/80 transition flex items-center justify-center space-x-1.5 active:scale-95 min-h-[44px]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'hi' ? 'स्वीकार किया गया' : 'I Acknowledge & Reflect'}</span>
          </button>

          <span className="text-[10px] text-slate-500 text-center sm:text-right block font-mono">
            {language === 'hi' ? '5 मिनट का संज्ञानात्मक विराम अनुशंसित' : 'Encouraged 5-min cognitive break'}
          </span>
        </div>
      </div>
    </div>
  );
}
