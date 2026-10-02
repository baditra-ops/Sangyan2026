import React, { useState } from 'react';
import { Play, Zap, Flame, Clock, ShieldAlert, Check, Loader2, Sparkles } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EventSimulator({ selectedInvestor, onEventSent }) {
  const [amount, setAmount] = useState('2500');
  const [outcome, setOutcome] = useState('LOSS');
  const [isOddHour, setIsOddHour] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const sendEvent = async (payload) => {
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Event rejected by backend');
      }

      const data = await res.json();
      setStatusMessage({ type: 'success', text: `Event ingested! Stream ID: ${data.streamId}` });
      if (onEventSent) {
        onEventSent(data.event);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manual Trigger
  const handleManualSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid positive amount' });
      return;
    }

    let timestamp = new Date().toISOString();
    if (isOddHour) {
      // 02:30 AM IST = 21:00 UTC of previous day
      timestamp = '2026-10-02T21:00:00.000Z';
    }

    sendEvent({
      investorId: selectedInvestor,
      eventType: 'INVESTMENT_DECISION',
      amount: numAmount,
      outcome: outcome || 'NEUTRAL',
      timestamp,
    });
  };

  // Demo Preset 1: Normal Activity
  const runNormalDemo = async () => {
    await sendEvent({
      investorId: selectedInvestor,
      eventType: 'INVESTMENT_DECISION',
      amount: 2000,
      outcome: 'WIN',
      timestamp: new Date().toISOString(),
    });
  };

  // Demo Preset 2: Rapid Decisions (3 rapid events in sequence)
  const runRapidDemo = async () => {
    setIsSubmitting(true);
    setStatusMessage({ type: 'info', text: 'Executing 3 rapid simulated decisions...' });
    for (let i = 1; i <= 3; i++) {
      await sendEvent({
        investorId: selectedInvestor,
        eventType: 'INVESTMENT_DECISION',
        amount: 1500 * i,
        outcome: 'NEUTRAL',
        timestamp: new Date().toISOString(),
      });
      await new Promise((r) => setTimeout(r, 350));
    }
    setIsSubmitting(false);
  };

  // Demo Preset 3: Loss Chasing (1000 -> 2500 -> 5000 consecutive losses)
  const runLossChasingDemo = async () => {
    setIsSubmitting(true);
    setStatusMessage({ type: 'info', text: 'Simulating loss escalation sequence (₹1,000 -> ₹2,500 -> ₹5,000)...' });
    const sequence = [1000, 2500, 5000];
    for (const amt of sequence) {
      await sendEvent({
        investorId: selectedInvestor,
        eventType: 'INVESTMENT_DECISION',
        amount: amt,
        outcome: 'LOSS',
        timestamp: new Date().toISOString(),
      });
      await new Promise((r) => setTimeout(r, 400));
    }
    setIsSubmitting(false);
  };

  // Demo Preset 4: Odd Hour Activity (02:30 AM IST)
  const runOddHourDemo = async () => {
    await sendEvent({
      investorId: selectedInvestor,
      eventType: 'INVESTMENT_DECISION',
      amount: 3000,
      outcome: 'NEUTRAL',
      timestamp: '2026-10-02T21:00:00.000Z', // 02:30 AM IST
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm space-y-5">
      <div>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            SYNTHETIC EVENT SIMULATOR
          </h3>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Simulate retail investor decision events to feed the real-time Redis Stream pipeline.
        </p>
      </div>

      {/* Demo Preset Shortcuts */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          One-Click Demo Scenarios
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={runNormalDemo}
            disabled={isSubmitting}
            className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 text-left transition flex flex-col justify-between disabled:opacity-50"
          >
            <div className="flex items-center space-x-1.5 text-emerald-400 mb-1">
              <Check className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Paced Trade</span>
            </div>
            <span className="text-[10px] text-slate-400">Normal WIN (Low Risk)</span>
          </button>

          <button
            type="button"
            onClick={runRapidDemo}
            disabled={isSubmitting}
            className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 text-left transition flex flex-col justify-between disabled:opacity-50"
          >
            <div className="flex items-center space-x-1.5 text-amber-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Rapid Pacing</span>
            </div>
            <span className="text-[10px] text-slate-400">3 decisions in 1 sec</span>
          </button>

          <button
            type="button"
            onClick={runLossChasingDemo}
            disabled={isSubmitting}
            className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 text-left transition flex flex-col justify-between disabled:opacity-50"
          >
            <div className="flex items-center space-x-1.5 text-rose-400 mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Loss Chasing</span>
            </div>
            <span className="text-[10px] text-slate-400">Escalating losses (₹1k-5k)</span>
          </button>

          <button
            type="button"
            onClick={runOddHourDemo}
            disabled={isSubmitting}
            className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 text-left transition flex flex-col justify-between disabled:opacity-50"
          >
            <div className="flex items-center space-x-1.5 text-indigo-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Odd Hours</span>
            </div>
            <span className="text-[10px] text-slate-400">02:30 AM IST decision</span>
          </button>
        </div>
      </div>

      {/* Manual Input Form */}
      <form onSubmit={handleManualSubmit} className="pt-3 border-t border-slate-800/80 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Amount input */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Simulated Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              min="1"
              step="100"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Simulated Outcome */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Simulated Outcome
            </label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="LOSS">LOSS</option>
              <option value="WIN">WIN</option>
              <option value="NEUTRAL">NEUTRAL</option>
            </select>
          </div>

          {/* Odd hour toggle */}
          <div className="flex items-end">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer p-1.5 bg-slate-950 rounded-lg border border-slate-800 w-full">
              <input
                type="checkbox"
                checked={isOddHour}
                onChange={(e) => setIsOddHour(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="text-[11px]">Simulate Odd-Hour (02:30 IST)</span>
            </label>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-[10px] text-slate-500 italic">
            Targeting: <strong className="text-slate-300 font-mono">{selectedInvestor}</strong> (No real capital is transferred)
          </span>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold tracking-wide shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing to Stream...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Decision</span>
              </>
            )}
          </button>
        </div>

        {/* Feedback message */}
        {statusMessage && (
          <div
            className={`p-2.5 rounded-lg text-xs font-medium border ${
              statusMessage.type === 'error'
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </form>
    </div>
  );
}
