import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SystemStatus from './components/SystemStatus';
import InvestorSelector from './components/InvestorSelector';
import StreamingPipeline from './components/StreamingPipeline';
import LiveEventStream from './components/LiveEventStream';
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
import MagneticCursor from './components/MagneticCursor';
import { useWebSocket } from './hooks/useWebSocket';

export default function App() {
  const [selectedInvestor, setSelectedInvestor] = useState('investor-001');
  const [language, setLanguage] = useState('en');
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  // Health and backend status
  const [backendHealth, setBackendHealth] = useState(null);

  // Real-time stream events (rolling list of last 10 entries)
  const [streamEvents, setStreamEvents] = useState([]);
  const [activePipelineTrigger, setActivePipelineTrigger] = useState(null);

  // Rich timeline audit trail
  const [timelineEvents, setTimelineEvents] = useState([]);

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
    reconnect,
  } = useWebSocket(selectedInvestor);

  const prevAssessmentRef = useRef(null);

  // When a simulated event is sent from EventSimulator
  const handleEventSent = (event) => {
    // 1. Add to rolling stream events (max 10)
    setStreamEvents((prev) => [event, ...prev.slice(0, 9)]);

    // 2. Trigger real-time streaming pipeline packet pulse
    setActivePipelineTrigger(event.streamId || event.eventId || `${Date.now()}-${Math.random()}`);

    // 3. Add to activity timeline as EVENT RECEIVED
    const eventTimeStr = event.timestamp || new Date().toISOString();
    setTimelineEvents((prev) => [
      {
        timelineId: `ev_recv_${Date.now()}_${Math.random()}`,
        timelineType: 'EVENT_RECEIVED',
        title: event.eventType || 'INVESTMENT_DECISION',
        amount: event.amount,
        outcome: event.outcome,
        streamId: event.streamId,
        timestamp: eventTimeStr,
        description: `Ingested to Redis Stream investor-events (Stream ID: ${event.streamId || 'Pending'})`,
      },
      ...prev.slice(0, 24),
    ]);
  };

  // Watch for incoming WebSocket assessments and update timeline
  useEffect(() => {
    if (!latestAssessment) return;

    // Check if this is a newly arrived assessment
    const prev = prevAssessmentRef.current;
    if (prev && prev.evaluatedAt === latestAssessment.evaluatedAt && prev.streamId === latestAssessment.streamId) {
      return;
    }
    prevAssessmentRef.current = latestAssessment;

    const evalTime = latestAssessment.evaluatedAt || new Date().toISOString();

    // 1. If cooling-off just activated
    if (latestAssessment.coolingOff && (!prev || !prev.coolingOff)) {
      setTimelineEvents((timeline) => [
        {
          timelineId: `cool_${Date.now()}_${Math.random()}`,
          timelineType: 'COOLING_OFF_ACTIVATED',
          title: 'Cooling-Off Protocol Activated',
          timestamp: evalTime,
          description: latestAssessment.coolingOffReason || 'Safety threshold reached. Encouraging cognitive pause.',
        },
        ...timeline.slice(0, 24),
      ]);
    }

    // 2. If signals detected
    if (latestAssessment.signals && latestAssessment.signals.length > 0) {
      const signalNames = latestAssessment.signals.map((s) => s.type).join(', ');
      setTimelineEvents((timeline) => [
        {
          timelineId: `sig_${Date.now()}_${Math.random()}`,
          timelineType: 'SIGNAL_DETECTED',
          title: `${latestAssessment.signals.length} Behavioural Signal(s)`,
          timestamp: evalTime,
          description: signalNames,
        },
        ...timeline.slice(0, 24),
      ]);
    }

    // 3. Assessment updated
    setTimelineEvents((timeline) => [
      {
        timelineId: `assess_${Date.now()}_${Math.random()}`,
        timelineType: 'ASSESSMENT_UPDATED',
        title: `Risk Score: ${latestAssessment.riskScore}/100 (${latestAssessment.riskLevel})`,
        timestamp: evalTime,
        description: latestAssessment.reasons?.length
          ? latestAssessment.reasons.join(' • ')
          : 'Pacing within normal thresholds',
      },
      ...timeline.slice(0, 24),
    ]);
  }, [latestAssessment]);

  // Reset timeline and stream events when switching monitored investor (investor isolation)
  const handleSelectInvestor = (id) => {
    setSelectedInvestor(id);
    setStreamEvents([]);
    setTimelineEvents([]);
    setActivePipelineTrigger(null);
    prevAssessmentRef.current = null;
  };

  // Add a new reflection entry for the current investor
  const handleAddReflection = (newEntry) => {
    setReflections((prev) => ({
      ...prev,
      [selectedInvestor]: [newEntry, ...(prev[selectedInvestor] || [])],
    }));

    // Record REFLECTION RECORDED on timeline
    setTimelineEvents((timeline) => [
      {
        timelineId: `ref_${Date.now()}_${Math.random()}`,
        timelineType: 'REFLECTION_RECORDED',
        title: 'Reflection Logged',
        timestamp: newEntry.timestamp || new Date().toISOString(),
        description: `Driver: ${newEntry.reason} • Horizon: ${newEntry.timeHorizon}`,
      },
      ...timeline.slice(0, 24),
    ]);
  };

  // Reset local demo data
  const handleResetDemo = () => {
    setStreamEvents([]);
    setTimelineEvents([]);
    setActivePipelineTrigger(null);
    prevAssessmentRef.current = null;
  };

  const isBackendOnline = Boolean(backendHealth && backendHealth.status === 'ok');
  const isRedisReady = Boolean(backendHealth && backendHealth.redis === 'ready');
  const currentReflections = reflections[selectedInvestor] || [];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-300">
      {/* 1. Header with Language Toggle & Journal CTA & Actual Status Indicators */}
      <Header
        language={language}
        onToggleLanguage={setLanguage}
        onOpenJournal={() => setIsJournalOpen(true)}
        isBackendOnline={isBackendOnline}
        wsStatus={connectionStatus}
        isRedisReady={isRedisReady}
      />

      {/* 2. System Hero / Introduction */}
      <Hero language={language} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 3. Status & Investor Selection Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SystemStatus
            wsStatus={connectionStatus}
            onReconnect={reconnect}
            language={language}
            onHealthChange={setBackendHealth}
          />
          <InvestorSelector
            selectedInvestor={selectedInvestor}
            onSelectInvestor={handleSelectInvestor}
            language={language}
          />
        </div>

        {/* 4. Real-Time Streaming Pipeline Visualization (Part 6 & 7) */}
        <StreamingPipeline
          activeEventTrigger={activePipelineTrigger}
          language={language}
        />

        {/* 5. Live Event Stream Panel (Part 5 & 8 - Core Addition) */}
        <LiveEventStream
          streamEvents={streamEvents}
          latestEvent={streamEvents[0] || null}
          language={language}
        />

        {/* 6. Cooling-Off Intervention (Prominent conditional banner with Review CTA) */}
        {latestAssessment && latestAssessment.coolingOff && (
          <CoolingOffPanel
            coolingOff={latestAssessment.coolingOff}
            reason={latestAssessment.coolingOffReason}
            reasons={latestAssessment.reasons}
            onOpenJournal={() => setIsJournalOpen(true)}
            language={language}
          />
        )}

        {/* 7. Core 2-Column Responsive Layout */}
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

            {/* Live Activity Timeline */}
            <ActivityTimeline events={timelineEvents} language={language} />

            {/* Decision Journal: Recent Reflections History */}
            <ReflectionHistory
              reflections={currentReflections}
              selectedInvestor={selectedInvestor}
              onOpenJournal={() => setIsJournalOpen(true)}
              language={language}
            />
          </div>
        </div>

        {/* 8. End-to-End System Flow Architecture Visualization */}
        <SystemFlowVisualization />
      </main>

      {/* 9. Footer */}
      <Footer />

      {/* 10. Decision Journal Modal Dialog */}
      <DecisionJournal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        selectedInvestor={selectedInvestor}
        onSubmitReflection={handleAddReflection}
        language={language}
        onToggleLanguage={setLanguage}
      />

      {/* 11. Custom Magnetic Cursor */}
      <MagneticCursor />
    </div>
  );
}
