import React from 'react';
import { UserCheck, Users } from 'lucide-react';

const PRESET_INVESTORS = [
  { id: 'investor-001', label: 'Investor 001', role: 'Retail Trader (Simulated)' },
  { id: 'investor-002', label: 'Investor 002', role: 'Swing Investor (Simulated)' },
  { id: 'investor-003', label: 'Investor 003', role: 'High Frequency (Simulated)' },
];

export default function InvestorSelector({ selectedInvestor, onSelectInvestor }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Active Monitored Stream
            </span>
            <span className="text-sm font-bold text-white">Simulated Investor Persona</span>
          </div>
        </div>

        {/* Investor Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto">
          {PRESET_INVESTORS.map((inv) => {
            const isSelected = inv.id === selectedInvestor;
            return (
              <button
                key={inv.id}
                onClick={() => onSelectInvestor(inv.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <UserCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{inv.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
