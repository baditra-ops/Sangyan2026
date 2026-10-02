import React from 'react';
import { UserCheck, Users, Sparkles } from 'lucide-react';

const PRESET_INVESTORS = [
  { id: 'investor-001', label: 'investor-001', role: 'Retail Persona' },
  { id: 'investor-002', label: 'investor-002', role: 'Swing Persona' },
  { id: 'investor-003', label: 'investor-003', role: 'Active Persona' },
];

export default function InvestorSelector({ selectedInvestor, onSelectInvestor, language = 'en' }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'hi' ? 'सक्रिय मॉनिटर स्ट्रीम' : 'ACTIVE MONITORED STREAM'}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                SIMULATED
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
              <span>{language === 'hi' ? 'निवेशक पहचान:' : 'INVESTOR'}</span>
              <span className="font-mono text-indigo-300">{selectedInvestor}</span>
            </div>
          </div>
        </div>

        {/* Investor Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto">
          {PRESET_INVESTORS.map((inv) => {
            const isSelected = inv.id === selectedInvestor;
            return (
              <button
                key={inv.id}
                type="button"
                onClick={() => onSelectInvestor(inv.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <UserCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span className="font-mono">{inv.label}</span>
                <span className="text-[9px] text-slate-400 hidden lg:inline">({inv.role})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
