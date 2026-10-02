import React from 'react';
import { PauseCircle, Sparkles, BookOpen, ShieldAlert } from 'lucide-react';
import LanguageToggle from './LanguageToggle';

export default function Header({ language, onToggleLanguage, onOpenJournal }) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <PauseCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">PAUSE</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                SAFETY ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide hidden sm:block">
              {language === 'hi'
                ? 'रियल-टाइम निवेशक व्यवहारिक सुरक्षा'
                : 'REAL-TIME INVESTOR BEHAVIOURAL SAFETY'}
            </p>
          </div>
        </div>

        {/* Prototype Environment Pill (Centered or right) */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="tracking-wide">SIMULATED DATA • PROTOTYPE ENVIRONMENT</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick-Action: Review Decision */}
          <button
            type="button"
            onClick={onOpenJournal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-semibold text-indigo-300 hover:text-white transition shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'hi' ? 'निर्णय समीक्षा' : 'Review My Decision'}
            </span>
          </button>

          {/* Language Toggle: EN | हिंदी */}
          <LanguageToggle language={language} onToggle={onToggleLanguage} />
        </div>
      </div>
    </header>
  );
}
