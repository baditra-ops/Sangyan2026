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
import SystemFlowVisualization from './components/SystemFlowVisualization';
import ExplainabilityPanel from './components/ExplainabilityPanel';
import Footer from './components/Footer';
import { useWebSocket } from './hooks/useWebSocket';

export default function App() {
  const [selectedInvestor, setSelectedInvestor] = useState('investor-001');
  const [simulatedEvents, setSimulatedEvents] = useState([]);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-300">
      {/* 1. Header */}
      <Header />

      {/* 2. System Hero / Introduction */}
      <Hero />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 3. Status & Investor Selection Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SystemStatus wsStatus={connectionStatus} onReconnect={reconnect} />
          <InvestorSelector
            selectedInvestor={selectedInvestor}
            onSelectInvestor={handleSelectInvestor}
          />
        </div>

        {/* 4. Cooling-Off Intervention (Prominent conditional banner) */}
        {latestAssessment && latestAssessment.coolingOff && (
          <CoolingOffPanel
            coolingOff={latestAssessment.coolingOff}
            reason={latestAssessment.coolingOffReason}
            reasons={latestAssessment.reasons}
          />
        )}

        {/* 5. Core 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Behavioural Assessment & Signals (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Risk Indicator Gauge */}
            <RiskIndicator assessment={latestAssessment} />

            {/* Behavioural Signals List */}
            <BehaviourSignals signals={latestAssessment?.signals || []} />

            {/* Transparent Explainability Breakdown */}
            <ExplainabilityPanel assessment={latestAssessment} />
          </div>

          {/* Right Column: Interactive Event Simulator & Timeline (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Event Simulator & One-Click Demo Presets */}
            <EventSimulator
              selectedInvestor={selectedInvestor}
              onEventSent={handleEventSent}
            />

            {/* Activity Timeline */}
            <ActivityTimeline events={simulatedEvents} />
          </div>
        </div>

        {/* 6. End-to-End System Flow Architecture Visualization */}
        <SystemFlowVisualization />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
