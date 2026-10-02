import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SystemStatus from './components/SystemStatus';
import InvestorSelector from './components/InvestorSelector';
import RiskIndicator from './components/RiskIndicator';
import BehaviourSignals from './components/BehaviourSignals';
import CoolingOffPanel from './components/CoolingOffPanel';
import EventSimulator from './components/EventSimulator';
import ActivityTimeline from './components/ActivityTimeline';
import ReflectionHistory from './components/ReflectionHistory';
import DecisionJournal from './components/DecisionJournal';
import SystemFlowVisualization from './components/SystemFlowVisualization';
import ExplainabilityPanel from './components/ExplainabilityPanel';
import Footer from './components/Footer';
import { useWebSocket } from './hooks/useWebSocket';

export default function App() {
  const [selectedInvestor, setSelectedInvestor] = useState('investor-001');
  const [simulatedEvents, setSimulatedEvents] = useState([]);
  const [language, setLanguage] = useState('en');
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  // Local simulated reflections state per investor
  const [reflections, setReflections] = useState({
    'investor-001': [
      {
        id: 'ref_init_1',
        investorId: 'investor-001',
        timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
        reason: 'Reviewing my existing plan',
        reasonKey: 'REVIEWING_EXISTING_PLAN',
        timeHorizon: 'Medium-term',
        timeHorizonKey: 'MEDIUM_TERM',
        whatChanged: 'Revisiting asset allocation after recent volatility.',
        reconsiderationPoint: 'Will wait 24 hours if consecutive losses occur.',
        language: 'en',
      },
    ],
    'investor-002': [],
    'investor-003': [],
  });

  // Live WebSocket hook for the selected simulated investor
  const {
    connectionStatus,
    latestAssessment,
    isRegistered,
    reconnect,
  } = useWebSocket(selectedInvestor);

  // When a simulated event is sent from EventSimulator, update local timeline
  const handleEventSent = (event) => {
    setSimulatedEvents((prev) => [event, ...prev.slice(0, 19)]);
  };

  // Reset timeline when changing monitored investor
  const handleSelectInvestor = (id) => {
    setSelectedInvestor(id);
    setSimulatedEvents([]);
  };

  // Add a new reflection entry for the current investor
  const handleAddReflection = (newEntry) => {
    setReflections((prev) => ({
      ...prev,
      [selectedInvestor]: [newEntry, ...(prev[selectedInvestor] || [])],
    }));
  };

  // Reset local demo data
  const handleResetDemo = () => {
    setSimulatedEvents([]);
  };

  const currentReflections = reflections[selectedInvestor] || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-300">
      {/* 1. Header with Language Toggle & Journal CTA */}
      <Header
        language={language}
        onToggleLanguage={setLanguage}
        onOpenJournal={() => setIsJournalOpen(true)}
      />

      {/* 2. System Hero / Introduction */}
      <Hero language={language} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 3. Status & Investor Selection Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SystemStatus wsStatus={connectionStatus} onReconnect={reconnect} language={language} />
          <InvestorSelector
            selectedInvestor={selectedInvestor}
            onSelectInvestor={handleSelectInvestor}
            language={language}
          />
        </div>

        {/* 4. Cooling-Off Intervention (Prominent conditional banner with Review CTA) */}
        {latestAssessment && latestAssessment.coolingOff && (
          <CoolingOffPanel
            coolingOff={latestAssessment.coolingOff}
            reason={latestAssessment.coolingOffReason}
            reasons={latestAssessment.reasons}
            onOpenJournal={() => setIsJournalOpen(true)}
            language={language}
          />
        )}

        {/* 5. Core 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Behavioural Assessment & Signals (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Risk Indicator Gauge */}
            <RiskIndicator assessment={latestAssessment} language={language} />

            {/* Behavioural Signals List */}
            <BehaviourSignals signals={latestAssessment?.signals || []} language={language} />

            {/* Transparent Explainability Breakdown */}
            <ExplainabilityPanel assessment={latestAssessment} />
          </div>

          {/* Right Column: Interactive Event Simulator, Timeline & Reflection History (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Event Simulator & One-Click Demo Presets */}
            <EventSimulator
              selectedInvestor={selectedInvestor}
              onEventSent={handleEventSent}
              onReset={handleResetDemo}
              language={language}
            />

            {/* Decision Journal: Recent Reflections History */}
            <ReflectionHistory
              reflections={currentReflections}
              selectedInvestor={selectedInvestor}
              onOpenJournal={() => setIsJournalOpen(true)}
              language={language}
            />

            {/* Activity Timeline */}
            <ActivityTimeline events={simulatedEvents} language={language} />
          </div>
        </div>

        {/* 6. End-to-End System Flow Architecture Visualization */}
        <SystemFlowVisualization />
      </main>

      {/* 7. Footer */}
      <Footer />

      {/* 8. Decision Journal Modal Dialog */}
      <DecisionJournal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        selectedInvestor={selectedInvestor}
        onSubmitReflection={handleAddReflection}
        language={language}
        onToggleLanguage={setLanguage}
      />
    </div>
  );
}
