import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, Flame, ShieldAlert, Info } from 'lucide-react';

const LEVEL_STYLES = {
  LOW: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    label: 'LOW BEHAVIOURAL RISK',
    labelHi: 'कम व्यवहारिक जोखिम',
    desc: 'Normal simulated behavioural patterns detected.',
    descHi: 'सामान्य सिम्युलेटेड व्यवहारिक पैटर्न दर्ज किए गए।',
    icon: ShieldCheck,
  },
  MODERATE: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    label: 'MODERATE BEHAVIOURAL RISK',
    labelHi: 'मध्यम व्यवहारिक जोखिम',
    desc: 'Elevated activity or early behavioural warning signals observed.',
    descHi: 'बढ़ी हुई गतिविधि या प्रारंभिक व्यवहारिक चेतावनी संकेत पाए गए।',
    icon: AlertTriangle,
  },
  HIGH: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    label: 'HIGH BEHAVIOURAL RISK',
    labelHi: 'उच्च व्यवहारिक जोखिम',
    desc: 'Strong behavioural bias indicators detected.',
    descHi: 'मजबूत व्यवहारिक पूर्वाग्रह संकेतक पाए गए।',
    icon: Flame,
  },
  CRITICAL: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/40',
    text: 'text-rose-400',
    label: 'CRITICAL BEHAVIOURAL RISK',
    labelHi: 'गंभीर व्यवहारिक जोखिम',
    desc: 'Severe compound signals (loss-chasing, rapid decisions).',
    descHi: 'गंभीर संयुक्त संकेत (नुकसान की भरपाई, तीव्र निर्णय)।',
    icon: ShieldAlert,
  },
};

export default function RiskIndicator({ assessment, language = 'en' }) {
  if (!assessment) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center shadow-sm backdrop-blur-sm flex flex-col items-center justify-center min-h-[220px]">
        <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-3 animate-pulse">
          <Activity className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-200 mb-1">
          {language === 'hi' ? 'गतिविधि की प्रतीक्षा में' : 'WAITING FOR ACTIVITY'}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          {language === 'hi'
            ? 'इस सत्र के लिए अभी तक कोई व्यवहारिक निर्णय दर्ज नहीं किया गया है। विश्लेषण शुरू करने के लिए नीचे दिए गए सिमुलेटर का उपयोग करें।'
            : 'No behavioural decisions recorded yet for this session. Simulate an event below to begin live analysis.'}
        </p>
      </div>
    );
  }

  const { riskScore = 0, riskLevel = 'LOW' } = assessment;
  const config = LEVEL_STYLES[riskLevel] || LEVEL_STYLES.LOW;
  const Icon = config.icon;

  // Circular SVG gauge calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(riskScore, 100) / 100) * circumference;

  const strokeColor =
    riskScore >= 80
      ? '#f43f5e' // rose
      : riskScore >= 60
      ? '#f97316' // orange
      : riskScore >= 30
      ? '#f59e0b' // amber
      : '#10b981'; // emerald

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Gauge on left */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke={strokeColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.6s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                {riskScore}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                out of 100
              </span>
            </div>
          </div>
        </div>

        {/* Details on right */}
        <div className="flex-1 text-center md:text-left space-y-2.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {language === 'hi' ? 'व्यवहारिक जोखिम स्कोर' : 'BEHAVIOURAL RISK SCORE'}
              </span>
              <p className="text-[11px] text-amber-400/90 font-medium">
                {language === 'hi'
                  ? 'प्रोटोटाइप व्यवहारिक संकेतक — वित्तीय जोखिम स्कोर नहीं।'
                  : 'Prototype behavioural indicator — not a financial risk score.'}
              </p>
            </div>

            {/* Level Badge */}
            <div
              className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${config.bg} ${config.border} ${config.text} self-center md:self-start`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? config.labelHi : config.label}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'hi' ? config.descHi : config.desc}
          </p>

          {/* Scale bar */}
          <div className="pt-2">
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(riskScore, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>0 LOW</span>
              <span>30 MODERATE</span>
              <span>60 HIGH</span>
              <span>80+ CRITICAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
