import React from 'react';
import { Languages } from 'lucide-react';

export default function LanguageToggle({ language, onToggle, className = '' }) {
  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center rounded-xl bg-slate-900/80 p-1 border border-slate-800 text-xs font-semibold shadow-inner ${className}`}
    >
      <Languages className="w-3.5 h-3.5 text-indigo-400 ml-1.5 mr-1" aria-hidden="true" />
      <button
        type="button"
        onClick={() => onToggle('en')}
        aria-pressed={language === 'en'}
        className={`px-2.5 py-1 rounded-lg transition-all duration-150 ${
          language === 'en'
            ? 'bg-indigo-600 text-white shadow-sm font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onToggle('hi')}
        aria-pressed={language === 'hi'}
        className={`px-2.5 py-1 rounded-lg transition-all duration-150 ${
          language === 'hi'
            ? 'bg-indigo-600 text-white shadow-sm font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}
