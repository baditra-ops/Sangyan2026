import React from 'react';
import { AlertCircle, Clock, Zap, TrendingUp, ShieldCheck } from 'lucide-react';

const SIGNAL_ICONS = {
  RAPID_DECISIONS: Zap,
  CONSECUTIVE_LOSSES: AlertCircle,
  INCREASING_AMOUNT_AFTER_LOSS: TrendingUp,
  ODD_HOUR_ACTIVITY: Clock,
};

const SIGNAL_NAMES_HI = {
  RAPID_DECISIONS: 'तीव्र निर्णय',
  CONSECUTIVE_LOSSES: 'लगातार नुकसान',
  INCREASING_AMOUNT_AFTER_LOSS: 'नुकसान के बाद बढ़ती राशि (लॉस चेसिंग)',
  ODD_HOUR_ACTIVITY: 'असामान्य समय में गतिविधि (देर रात)',
};

const SEVERITY_BADGES = {
  HIGH: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  LOW: 'bg-slate-700/30 text-slate-300 border-slate-600/40',
};

const SEVERITY_HI = {
  HIGH: 'उच्च',
  MEDIUM: 'मध्यम',
  LOW: 'कम',
};

export default function BehaviourSignals({ signals = [], language = 'en' }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {language === 'hi' ? 'पहचाने गए व्यवहारिक संकेत' : 'DETECTED BEHAVIOURAL SIGNALS'}
          </h3>
          <p className="text-[11px] text-slate-500">
            {language === 'hi'
              ? 'रिस्क इंजन द्वारा निकाले गए अवलोकनीय निर्णय पैटर्न'
              : 'Observable decision patterns extracted by backend Risk Engine'}
          </p>
        </div>
        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          {signals.length} {signals.length === 1 ? (language === 'hi' ? 'संकेत' : 'Signal') : (language === 'hi' ? 'संकेत' : 'Signals')}
        </span>
      </div>

      {signals.length === 0 ? (
        <div className="py-7 text-center border border-dashed border-slate-800/80 rounded-lg p-4">
          <ShieldCheck className="w-8 h-8 text-emerald-400/80 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-300">
            {language === 'hi' ? 'कोई व्यवहारिक चेतावनी सक्रिय नहीं है' : 'No Behavioural Warnings Active'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
            {language === 'hi'
              ? 'सिम्युलेटेड गतिविधि संतुलित, संयमित निर्णयों को दर्शाती है जिसमें कोई जल्दबाजी या नुकसान की भरपाई का पैटर्न नहीं है।'
              : 'Simulated activity reflects steady, paced decisions without rapid repetition or loss-chasing patterns.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {signals.map((sig, idx) => {
            const Icon = SIGNAL_ICONS[sig.type] || AlertCircle;
            const badgeClass = SEVERITY_BADGES[sig.severity] || SEVERITY_BADGES.LOW;
            const signalTitle = language === 'hi' && SIGNAL_NAMES_HI[sig.type]
              ? SIGNAL_NAMES_HI[sig.type]
              : sig.type.replace(/_/g, ' ');

            return (
              <div
                key={`${sig.type}-${idx}`}
                className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/90 flex items-start space-x-3 transition hover:border-slate-700/80"
              >
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400 flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      {signalTitle}
                    </span>
                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}
                      >
                        {language === 'hi' ? (SEVERITY_HI[sig.severity] || sig.severity) : sig.severity}
                      </span>
                      {sig.points !== undefined && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          +{sig.points} pts
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-normal">{sig.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
