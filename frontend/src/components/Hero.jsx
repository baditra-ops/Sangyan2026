import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function Hero({ language = 'en' }) {
  return (
    <section className="relative overflow-hidden pt-6 pb-5 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/60 via-slate-950/40 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs text-indigo-300">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold tracking-wide font-mono text-[11px]">
                {language === 'hi'
                  ? 'संज्ञान निवेशक सहनशीलता प्रोटोटाइप'
                  : 'SANGYAN INVESTOR RESILIENCE PROTOTYPE'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {language === 'hi'
                ? 'अगले निर्णय से पहले एक विराम लें।'
                : 'PAUSE BEFORE THE NEXT DECISION.'}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              {language === 'hi'
                ? 'व्यवहारिक पैटर्नों का पता लगाएं, समझें कि उन्हें क्या ट्रिगर करता है, और आत्म-चिंतन के लिए एक पल बनाएं।'
                : 'Detect behavioural patterns, explain what triggered them, and create a moment for reflection.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
                SIMULATED DATA • PROTOTYPE ENVIRONMENT
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono">
                {language === 'hi' ? 'गैर-व्यापारिक सुरक्षा परत' : 'BEHAVIOURAL SAFETY INFRASTRUCTURE'}
              </span>
            </div>
          </div>

          {/* Educational notice card */}
          <div className="flex-shrink-0 w-full lg:w-96 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start space-x-3 shadow-inner">
            <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-200 block text-xs">
                {language === 'hi' ? 'व्यवहारिक सुरक्षा कंसोल' : 'Cognitive Speed Bump Architecture'}
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {language === 'hi'
                  ? 'यह एक ट्रेडिंग डैशबोर्ड नहीं है। यह प्रणाली केवल कृत्रिम सिमुलेशन डेटा पर कार्य करती है और कोई निवेश सिफारिश या वित्तीय सलाह प्रदान नहीं करती है।'
                  : 'PAUSE operates as behavioural safety infrastructure. It evaluates synthetic decision pacing and outcome patterns without financial recommendations, price forecasts, or broker integrations.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
