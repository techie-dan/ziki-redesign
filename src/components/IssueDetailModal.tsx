import React, { useState } from 'react';
import { ZikiIssue, Waypoint, PlanApproach } from '../types';
import { LifecycleProgress, getStepIndexForStatus } from './LifecycleProgress';
import { SandboxRunner } from './SandboxRunner';
import { 
  X, 
  Bot, 
  User, 
  Compass, 
  Sparkles, 
  Code2, 
  ShieldCheck, 
  Play, 
  Activity, 
  History, 
  Layers, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  GitMerge,
  GitPullRequest,
  Clock,
  Coins,
  Check
} from 'lucide-react';

interface IssueDetailModalProps {
  issue: ZikiIssue;
  isOpen: boolean;
  isSynapseMode: boolean;
  onClose: () => void;
  onUpdateIssue: (updatedIssue: ZikiIssue) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  isOpen,
  isSynapseMode,
  onClose,
  onUpdateIssue
}) => {
  const [activeTab, setActiveTab] = useState<'flight_deck' | 'intent_plan' | 'diff' | 'prove' | 'sandbox' | 'audit'>('flight_deck');
  const [customSteeringNote, setCustomSteeringNote] = useState('');
  const [liveTerminalInput, setLiveTerminalInput] = useState('');
  const [selectedApproachId, setSelectedApproachId] = useState<string>(
    issue.planProposal.approaches.find(a => a.selected)?.id || issue.planProposal.approaches[0]?.id || ''
  );
  const [mergedSuccess, setMergedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentStep = getStepIndexForStatus(issue.status);
  const awaitingWaypoint = issue.waypoints.find(w => w.status === 'awaiting_human');

  // Handle Steering a Waypoint
  const handleSteerWaypoint = (waypointId: string, optionId: string) => {
    const targetWp = issue.waypoints.find(w => w.id === waypointId);
    if (!targetWp) return;

    const chosenOpt = targetWp.options.find(o => o.id === optionId);
    const updatedWaypoints: Waypoint[] = issue.waypoints.map(w => {
      if (w.id === waypointId) {
        return {
          ...w,
          status: 'steered',
          chosenOptionId: optionId,
          customSteeringNote: customSteeringNote.trim() || undefined,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
        };
      }
      return w;
    });

    const newLogItem = {
      id: `log_steer_${Date.now()}`,
      stepNumber: issue.executionLogs.length + 1,
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      agent: `${issue.owner.name} (Owner)`,
      type: 'steering_received' as const,
      message: `Human Steered Waypoint [${targetWp.title}]: Selected "${chosenOpt?.label || optionId}". Note: "${customSteeringNote || 'Proceed with selected approach'}"`,
      steeredByHuman: true
    };

    const agentResumeLog = {
      id: `log_resume_${Date.now() + 1}`,
      stepNumber: issue.executionLogs.length + 2,
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      agent: issue.agent.name,
      type: 'thought' as const,
      message: `Waypoint resolved via Human Direction. Synthesizing single-flight promise pattern with zero redis dependencies. Generating commit and AST validation.`
    };

    onUpdateIssue({
      ...issue,
      waypoints: updatedWaypoints,
      confidenceScore: Math.min(100, issue.confidenceScore + 12),
      executionLogs: [...issue.executionLogs, newLogItem, agentResumeLog]
    });

    setCustomSteeringNote('');
  };

  // Handle Ad-hoc Live Terminal Steer
  const handleSendTerminalSteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTerminalInput.trim()) return;

    const promptText = liveTerminalInput.trim();
    setLiveTerminalInput('');

    const newLogItem = {
      id: `log_adhoc_${Date.now()}`,
      stepNumber: issue.executionLogs.length + 1,
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      agent: `${issue.owner.name} (Owner)`,
      type: 'steering_received' as const,
      message: `In-Flight Direction: "${promptText}"`,
      steeredByHuman: true
    };

    const agentAck = {
      id: `log_ack_${Date.now() + 1}`,
      stepNumber: issue.executionLogs.length + 2,
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      agent: issue.agent.name,
      type: 'thought' as const,
      message: `Acknowledged human mid-flight guidance: "${promptText}". Updating AST synthesis buffer.`
    };

    onUpdateIssue({
      ...issue,
      executionLogs: [...issue.executionLogs, newLogItem, agentAck]
    });
  };

  // Advance to Deliver (Step 3 -> Step 4)
  const handleAuthorizeClaim = () => {
    const updatedApproaches: PlanApproach[] = issue.planProposal.approaches.map(a => ({
      ...a,
      selected: a.id === selectedApproachId
    }));

    const newLogs = [
      ...issue.executionLogs,
      {
        id: `log_auth_${Date.now()}`,
        stepNumber: issue.executionLogs.length + 1,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        agent: `${issue.owner.name} (Owner)`,
        type: 'steering_received' as const,
        message: `Event [claim.accepted]: Authorized agent claim with approach "${updatedApproaches.find(a => a.selected)?.title}".`,
        steeredByHuman: true
      }
    ];

    onUpdateIssue({
      ...issue,
      status: 'delivering',
      planProposal: {
        ...issue.planProposal,
        approaches: updatedApproaches
      },
      executionLogs: newLogs
    });

    setActiveTab('flight_deck');
  };

  // Advance to Prove (Step 4 -> Step 5)
  const handleAdvanceToProve = () => {
    const newLogs = [
      ...issue.executionLogs,
      {
        id: `log_prove_${Date.now()}`,
        stepNumber: issue.executionLogs.length + 1,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        agent: issue.agent.name,
        type: 'action' as const,
        message: `Event [issue.pr_linked]: Linked PR for branch ${issue.branch}. Handing off to independent verifier ${issue.independentVerifier.name}.`
      }
    ];

    onUpdateIssue({
      ...issue,
      status: 'proving',
      executionLogs: newLogs
    });

    setActiveTab('prove');
  };

  // Advance to Ready to Merge (Step 5 -> Step 6)
  const handlePassVerification = () => {
    const newLogs = [
      ...issue.executionLogs,
      {
        id: `log_verdict_${Date.now()}`,
        stepNumber: issue.executionLogs.length + 1,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        agent: issue.independentVerifier.name,
        type: 'test_run' as const,
        message: `Event [issue.test_verdict]: All ${issue.testVerdict.totalTestCases} tests passed. Independent audit verified.`
      }
    ];

    onUpdateIssue({
      ...issue,
      status: 'ready_merge',
      executionLogs: newLogs
    });
  };

  // Final Gatekeeper Merge
  const handleMergePr = () => {
    const newLogs = [
      ...issue.executionLogs,
      {
        id: `log_merge_${Date.now()}`,
        stepNumber: issue.executionLogs.length + 1,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        agent: `${issue.owner.name} (Gatekeeper)`,
        type: 'audit_event' as const,
        message: `Event [issue.accepted]: PR merged into main branch. Consensus verified across human owner and independent auditor.`
      }
    ];

    onUpdateIssue({
      ...issue,
      status: 'merged',
      executionLogs: newLogs
    });

    setMergedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <span className="font-mono text-xs font-bold text-indigo-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
              {issue.id}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  {issue.title}
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  ({issue.repository})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Owner: <strong className="text-slate-300">{issue.owner.name} ({issue.owner.handle})</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  Solver: <strong className="text-indigo-300 font-mono">{issue.agent.name}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verifier: <strong className="text-emerald-300 font-mono">{issue.independentVerifier.name}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 6-Step Lifecycle Progress Tracker */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40">
          <LifecycleProgress
            status={issue.status}
            isSynapseMode={isSynapseMode}
            onStepClick={(step) => {
              if (step === 3) setActiveTab('intent_plan');
              else if (step === 4) setActiveTab('flight_deck');
              else if (step === 5) setActiveTab('prove');
              else if (step === 6) setActiveTab('audit');
            }}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-900/70 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('flight_deck')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'flight_deck'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            Flight Deck & Waypoints
            {awaitingWaypoint && isSynapseMode && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('intent_plan')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'intent_plan'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Intent & Plan Canvas (Step 3)
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'diff'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Code & Semantic Diff
          </button>
          <button
            onClick={() => setActiveTab('prove')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'prove'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Independent Verifier (Step 5)
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Interactive Live Sandbox
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            Event Audit Trail
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300">
          
          {/* TAB 1: FLIGHT DECK & WAYPOINTS */}
          {activeTab === 'flight_deck' && (
            <div className="space-y-6">
              
              {/* Waypoint Awaiting Steer Notification (Core ZIP-04 Innovation) */}
              {isSynapseMode && awaitingWaypoint ? (
                <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/30 border-2 border-amber-500/50 rounded-2xl p-5 shadow-xl shadow-amber-950/30">
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-amber-500/30">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <Compass className="w-5 h-5 animate-spin" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                            IN-FLIGHT WAYPOINT REACHED
                          </span>
                          <span className="text-xs text-amber-300 font-mono">
                            {awaitingWaypoint.stageName}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-100 mt-1">
                          {awaitingWaypoint.title}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Awaiting Human Direction
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                      <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block mb-1">
                        Agent Dilemma:
                      </span>
                      <p className="text-slate-300 leading-relaxed font-sans">{awaitingWaypoint.dilemma}</p>
                      <p className="text-slate-400 mt-2 font-mono text-[11px] bg-slate-900 p-2 rounded">
                        Context: {awaitingWaypoint.agentContext}
                      </p>
                    </div>

                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider pt-2">
                      Select Human Direction (One-Click Protocol Steer):
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {awaitingWaypoint.options.map((option) => (
                        <div
                          key={option.id}
                          className="bg-slate-950 border border-slate-800 hover:border-indigo-500/60 rounded-xl p-4 flex flex-col justify-between transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-semibold text-slate-200 text-xs">{option.label}</span>
                              {option.recommended && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  Agent Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{option.impact}</p>
                          </div>

                          <button
                            onClick={() => handleSteerWaypoint(awaitingWaypoint.id, option.id)}
                            className="mt-3 w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Direct Agent to Implement This
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Optional custom instruction box */}
                    <div className="pt-2">
                      <label className="text-xs text-slate-400 block mb-1 font-medium">
                        Optional: Add Custom Engineer Notes to Injection:
                      </label>
                      <input
                        type="text"
                        value={customSteeringNote}
                        onChange={(e) => setCustomSteeringNote(e.target.value)}
                        placeholder="e.g. Ensure we also export the type definition and add 15s leeway buffer..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Waypoint History (Resolved) */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-400" />
                    Waypoint Checkpoints in this Task
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {issue.waypoints.filter(w => w.status === 'steered').length} of {issue.waypoints.length} Steered
                  </span>
                </div>

                <div className="space-y-2">
                  {issue.waypoints.map((w) => (
                    <div key={w.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        {w.status === 'steered' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : w.status === 'awaiting_human' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400" />
                        )}
                        <div>
                          <span className="font-semibold text-slate-200">{w.title}</span>
                          <span className="text-slate-400 text-[11px] block">{w.stageName}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        {w.status === 'steered' ? (
                          <span className="text-emerald-400 text-[11px] font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                            Steered: {w.chosenOptionId?.replace('opt_', '')}
                          </span>
                        ) : w.status === 'awaiting_human' ? (
                          <span className="text-amber-400 text-[11px] font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/50">
                            Action Required
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Upcoming</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Execution Stream */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Live Solver Agent Thought Stream & Telemetry
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Model: {issue.agent.model}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2">
                  {issue.executionLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`p-3 rounded-lg text-xs leading-relaxed transition-all ${
                        log.steeredByHuman
                          ? 'bg-indigo-950/40 border border-indigo-500/40 text-indigo-200 shadow-sm'
                          : log.type === 'waypoint_trigger'
                          ? 'bg-amber-950/30 border border-amber-500/30 text-amber-200'
                          : log.type === 'audit_event'
                          ? 'bg-slate-900/90 border border-slate-800 text-slate-300'
                          : 'bg-slate-900/50 border border-slate-800/60 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                          {log.steeredByHuman ? <User className="w-3 h-3 text-indigo-400" /> : <Bot className="w-3 h-3 text-slate-400" />}
                          {log.agent}
                        </span>
                        <span className="text-slate-400">{log.timestamp}</span>
                      </div>
                      <p className="font-sans">{log.message}</p>
                    </div>
                  ))}
                </div>

                {/* In-Flight Steering Bar (Allows sending directives at any time!) */}
                {isSynapseMode && (
                  <form onSubmit={handleSendTerminalSteer} className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                    <input
                      type="text"
                      value={liveTerminalInput}
                      onChange={(e) => setLiveTerminalInput(e.target.value)}
                      placeholder="Co-steer agent in real-time (e.g. 'Prioritize backward compatibility for legacy clients')..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={!liveTerminalInput.trim()}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Steer
                    </button>
                  </form>
                )}
              </div>

              {/* Advance Button if Ready */}
              {issue.status === 'delivering' && !awaitingWaypoint && (
                <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-200">Implementation Complete</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Code synthesized and waypoints resolved. Link PR and hand off to Independent Verifier.</p>
                  </div>
                  <button
                    onClick={handleAdvanceToProve}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                  >
                    <GitPullRequest className="w-3.5 h-3.5" />
                    Link PR &amp; Hand Off to Verifier (Step 5)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTENT & PLAN CANVAS (Step 3: Authorize Improvement) */}
          {activeTab === 'intent_plan' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Step 3 Innovation: Intent &amp; Multi-Approach Canvas
                  </h3>
                  <span className="text-xs text-indigo-400 font-mono">ZIP-04 Feature</span>
                </div>
                <p className="text-xs text-slate-400">
                  Instead of presenting 1 single opaque claim, Ziki Synapse agents formulate multiple architectural candidates with token estimates, blast radius analysis, and proactive clarification questions for human sign-off.
                </p>
              </div>

              {/* Approaches */}
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Architectural Approaches Formulated by {issue.agent.name}:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {issue.planProposal.approaches.map((appr) => {
                    const isSelected = appr.id === selectedApproachId;
                    return (
                      <div
                        key={appr.id}
                        onClick={() => setSelectedApproachId(appr.id)}
                        className={`cursor-pointer rounded-xl p-5 border transition-all ${
                          isSelected
                            ? 'bg-indigo-950/30 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-100 text-sm">{appr.title}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isSelected ? 'Selected' : 'Select'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                          {appr.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 p-2.5 rounded-lg mb-3">
                          <span>Tokens: ~{appr.estimatedTokens.toLocaleString()}</span>
                          <span>Time: ~{appr.estimatedMinutes} mins</span>
                          <span>Breaking Risk: <strong className={appr.breakingRisk === 'none' ? 'text-emerald-400' : 'text-amber-400'}>{appr.breakingRisk}</strong></span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <div className="text-emerald-400 font-medium">Pros:</div>
                          {appr.pros.map((p, i) => (
                            <div key={i} className="text-slate-300 flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clarification Questions */}
              {issue.planProposal.clarifications.length > 0 && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Proactive Clarification Queries:
                  </div>
                  {issue.planProposal.clarifications.map((q) => (
                    <div key={q.id} className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 text-xs space-y-2">
                      <div className="font-semibold text-slate-200">{q.question}</div>
                      <p className="text-slate-400 text-[11px] italic font-mono">{q.agentContext}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {q.options.map((opt, i) => (
                          <button
                            key={i}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              opt === q.selectedOption
                                ? 'bg-indigo-600 text-white border-indigo-500'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Authorize Button if in authorizing state */}
              {issue.status === 'authorizing' && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-300">Ready to Authorize Claim</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Authorize agent to commence implementation with the selected approach.</p>
                  </div>
                  <button
                    onClick={handleAuthorizeClaim}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Authorize Claim [claim.accepted]
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CODE & SEMANTIC DIFF */}
          {activeTab === 'diff' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-semibold text-indigo-400">
                    {issue.codeDiff.filename}
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">
                    Single-Flight Mutex Patch
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <strong className="text-slate-100">Semantic Impact:</strong> {issue.codeDiff.explanation}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Old Code */}
                <div className="bg-slate-950 border border-rose-950/60 rounded-xl overflow-hidden font-mono text-xs">
                  <div className="bg-rose-950/30 px-4 py-2 border-b border-rose-900/40 text-rose-300 font-semibold flex items-center justify-between">
                    <span>Original Code (Vulnerable)</span>
                    <span className="text-[10px]">Unsynchronized</span>
                  </div>
                  <pre className="p-4 text-slate-300 overflow-x-auto leading-relaxed">
                    {issue.codeDiff.oldCode}
                  </pre>
                </div>

                {/* New Code */}
                <div className="bg-slate-950 border border-emerald-950/60 rounded-xl overflow-hidden font-mono text-xs">
                  <div className="bg-emerald-950/30 px-4 py-2 border-b border-emerald-900/40 text-emerald-300 font-semibold flex items-center justify-between">
                    <span>Synapse Co-Steered Code</span>
                    <span className="text-[10px] text-emerald-400">Single-Flight Promise</span>
                  </div>
                  <pre className="p-4 text-emerald-200 overflow-x-auto leading-relaxed">
                    {issue.codeDiff.newCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INDEPENDENT VERIFIER & PROVE (Step 5) */}
          {activeTab === 'prove' && (
            <div className="space-y-6">
              
              {/* Verifier Agent Profile Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                        {issue.independentVerifier.name}
                      </h3>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Independent Auditor
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Owner: <strong className="text-slate-300">{issue.independentVerifier.ownerHandle}</strong> (Strict Ziki Invariant: Different human owner from solver agent <strong className="text-indigo-400">{issue.agent.ownerHandle}</strong>)
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs font-mono">
                  <div className="text-emerald-400 font-bold">{issue.independentVerifier.reputation}% Reputation</div>
                  <div className="text-slate-400">{issue.independentVerifier.totalDelivered} tasks verified</div>
                </div>
              </div>

              {/* Verification Metrics Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400">Reproduction Stress Test</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {issue.testVerdict.testCasesPassed} / {issue.testVerdict.totalTestCases} Passed
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Simulated 50 concurrent client bursts</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400">Mutation Coverage Delta</div>
                  <div className="text-lg font-bold text-indigo-300 mt-1">
                    {issue.testVerdict.mutationScore}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{issue.testVerdict.coverageDelta}</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400">Anti-Sybil Separation</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    Verified Clean
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Zero cross-owner bias detected</p>
                </div>
              </div>

              {/* Independent Verdict Notes */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
                <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                  Auditor Verification Statement:
                </div>
                <p className="text-slate-300 leading-relaxed font-mono">
                  {issue.testVerdict.notes}
                </p>
              </div>

              {/* Advance to Ready to Merge if in proving state */}
              {issue.status === 'proving' && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-300">Independent Verdict: Confirmed</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Certify consensus and send to Human Gatekeeper for final merge.</p>
                  </div>
                  <button
                    onClick={handlePassVerification}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Accept Verdict &amp; Mark Ready for Merge (Step 6)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: INTERACTIVE LIVE SANDBOX */}
          {activeTab === 'sandbox' && (
            <div className="space-y-4">
              <SandboxRunner sandbox={issue.sandbox} issueId={issue.id} />
            </div>
          )}

          {/* TAB 6: EVENT AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-bold text-slate-100 mb-1">
                  Immutable Cryptographic Audit Trail
                </h3>
                <p className="text-xs text-slate-400">
                  Every step, waypoint steer, approach authorization, and test verdict is recorded on the tamper-proof Ziki ledger.
                </p>
              </div>

              <div className="space-y-2">
                {issue.executionLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs font-mono flex items-start gap-3">
                    <span className="text-slate-400 font-semibold">{log.timestamp}</span>
                    <span className="text-indigo-400 font-bold">[{log.type}]</span>
                    <span className="text-slate-300 flex-1">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Bar (Bottom Gatekeeper Controls) */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {mergedSuccess || issue.status === 'merged' ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Issue resolved &amp; PR merged into main branch!
              </span>
            ) : (
              <span>
                Owner-First Autonomy Status: <strong className="text-slate-300">Authorized by {issue.owner.name}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {issue.status === 'ready_merge' && (
              <button
                onClick={handleMergePr}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
              >
                <GitMerge className="w-4 h-4" />
                Human Gatekeeper Sign-Off &amp; Merge PR
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
