import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit,
  X,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { translations } from '../utils/reflectionTranslations';
import LanguageToggle from './LanguageToggle';

export default function DecisionJournal({
  isOpen,
  onClose,
  selectedInvestor,
  onSubmitReflection,
  language = 'en',
  onToggleLanguage,
}) {
  const t = translations[language] || translations.en;

  // Form State
  const [selectedDriver, setSelectedDriver] = useState('');
  const [otherDriverText, setOtherDriverText] = useState('');
  const [timeHorizon, setTimeHorizon] = useState('');
  const [whatChanged, setWhatChanged] = useState('');
  const [reconsiderationPoint, setReconsiderationPoint] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setValidationError('');
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsSubmitted(false);
    setValidationError('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDriver) {
      setValidationError(
        language === 'hi'
          ? 'कृपया निर्णय का एक मुख्य कारण चुनें (अनिवार्य)।'
          : 'Please select what is driving your decision (Required).'
      );
      return;
    }

    if (!timeHorizon) {
      setValidationError(
        language === 'hi'
          ? 'कृपया अपनी अपेक्षित समय सीमा चुनें (अनिवार्य)।'
          : 'Please select your expected time horizon (Required).'
      );
      return;
    }

    const driverLabel =
      selectedDriver === 'OTHER' && otherDriverText.trim()
        ? otherDriverText.trim()
        : t.driverOptions[selectedDriver] || selectedDriver;

    const entry = {
      id: `ref_${Date.now()}`,
      investorId: selectedInvestor,
      timestamp: new Date().toISOString(),
      reason: driverLabel,
      reasonKey: selectedDriver,
      timeHorizon: t.timeHorizonOptions[timeHorizon] || timeHorizon,
      timeHorizonKey: timeHorizon,
      whatChanged: whatChanged.trim() || null,
      reconsiderationPoint: reconsiderationPoint.trim() || null,
      language,
    };

    onSubmitReflection(entry);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setSelectedDriver('');
    setOtherDriverText('');
    setTimeHorizon('');
    setWhatChanged('');
    setReconsiderationPoint('');
    setIsSubmitted(false);
    setValidationError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-heading"
      ref={modalRef}
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl overflow-hidden ring-1 ring-white/10 my-auto">
        {/* Subtle decorative top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-teal-400 to-amber-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md flex-shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 font-mono block">
                {t.journalTag} • {selectedInvestor}
              </span>
              <h2
                id="journal-heading"
                className="text-base sm:text-lg font-bold text-white tracking-tight"
              >
                {t.journalTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <LanguageToggle language={language} onToggle={onToggleLanguage} />

            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label={t.close}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 text-slate-200">
          {isSubmitted ? (
            /* ================= COMPLETION STATE ================= */
            <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {t.recordedBadge}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {t.completionHeading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t.completionMessage}
                </p>
              </div>

              {/* Reflection Summary Card */}
              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>{t.reasonLabel}:</span>
                  <span className="text-slate-200 font-semibold">
                    {t.driverOptions[selectedDriver] || selectedDriver}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t.timeHorizonLabel}:</span>
                  <span className="text-slate-200 font-semibold">
                    {t.timeHorizonOptions[timeHorizon] || timeHorizon}
                  </span>
                </div>
                {whatChanged && (
                  <div className="pt-2 border-t border-slate-700/40">
                    <span className="text-slate-400 block mb-1">{t.q1Label}:</span>
                    <span className="text-slate-300 italic">"{whatChanged}"</span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition focus-visible:ring-2 focus-visible:ring-indigo-400 min-h-[44px]"
                >
                  {t.close}
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition flex items-center justify-center space-x-1.5 min-h-[44px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'नया चिंतन दर्ज करें' : 'Record Another'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= JOURNAL FORM ================= */
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-xs sm:text-sm text-slate-300">
                {t.journalSubtitle}
              </p>

              {validationError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {validationError}
                </div>
              )}

              {/* 1. What is driving this decision? (REQUIRED) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-indigo-400" />
                    <span>{t.driverHeading}</span>
                  </label>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {language === 'hi' ? 'अनिवार्य' : 'Required'}
                  </span>
                </div>

                <div
                  role="radiogroup"
                  aria-label={t.driverHeading}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                >
                  {Object.entries(t.driverOptions).map(([key, label]) => {
                    const isSelected = selectedDriver === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          setSelectedDriver(key);
                          setValidationError('');
                        }}
                        className={`text-left p-3.5 rounded-xl border text-xs font-medium transition-all duration-150 flex items-center justify-between min-h-[48px] ${
                          isSelected
                            ? 'bg-indigo-600/25 border-indigo-400 text-white shadow-md ring-2 ring-indigo-500/50'
                            : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected
                                ? 'border-indigo-400 bg-indigo-500'
                                : 'border-slate-600 bg-slate-900'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className={isSelected ? 'font-bold' : ''}>{label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedDriver === 'OTHER' && (
                  <input
                    type="text"
                    value={otherDriverText}
                    onChange={(e) => setOtherDriverText(e.target.value)}
                    placeholder={
                      language === 'hi'
                        ? 'कृपया अपने कारण का संक्षेप में वर्णन करें...'
                        : 'Describe what is driving this decision...'
                    }
                    className="w-full mt-2 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                  />
                )}
              </div>

              {/* 2. Expected Time Horizon (REQUIRED) */}
              <div className="space-y-3 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span>{t.timeHorizonHeading}</span>
                  </label>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {language === 'hi' ? 'अनिवार्य' : 'Required'}
                  </span>
                </div>

                <div
                  role="radiogroup"
                  aria-label={t.timeHorizonHeading}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                >
                  {Object.entries(t.timeHorizonOptions).map(([key, label]) => {
                    const isSelected = timeHorizon === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          setTimeHorizon(key);
                          setValidationError('');
                        }}
                        className={`text-center p-3 rounded-xl border text-xs font-medium transition-all duration-150 min-h-[48px] flex items-center justify-center ${
                          isSelected
                            ? 'bg-teal-500/25 border-teal-400 text-white shadow-md ring-2 ring-teal-500/50 font-bold'
                            : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Optional Reflection Prompts */}
              <div className="space-y-4 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{t.reflectionHeading}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                    {t.optionalBadge}
                  </span>
                </div>

                {/* Q1 */}
                <div className="space-y-1.5">
                  <label htmlFor="q1-input" className="text-xs text-slate-300 font-medium block">
                    {t.q1Label}
                  </label>
                  <textarea
                    id="q1-input"
                    rows={2}
                    value={whatChanged}
                    onChange={(e) => setWhatChanged(e.target.value)}
                    placeholder={t.q1Placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                  />
                </div>

                {/* Q2 */}
                <div className="space-y-1.5">
                  <label htmlFor="q2-input" className="text-xs text-slate-300 font-medium block">
                    {t.q2Label}
                  </label>
                  <textarea
                    id="q2-input"
                    rows={2}
                    value={reconsiderationPoint}
                    onChange={(e) => setReconsiderationPoint(e.target.value)}
                    placeholder={t.q2Placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                  />
                </div>
              </div>

              {/* Regulatory Assurance Notice */}
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 flex items-start space-x-2.5 text-[11px] text-slate-300">
                <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>
                  {language === 'hi'
                    ? 'PAUSE एक सुरक्षा परत है जो आपके निर्णय की सुविचारित समीक्षा में सहायता करती है। यह कोई वित्तीय या व्यापारिक सलाह प्रदान नहीं करती है।'
                    : 'PAUSE is a behavioural safety layer designed to foster deliberate reflection. It does not provide financial or trading advice.'}
                </span>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition min-h-[44px]"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 focus-visible:ring-2 focus-visible:ring-indigo-400 min-h-[44px]"
                >
                  <span>{t.submitButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
