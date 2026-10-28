import React, { useState } from 'react';
import { SandboxSimulation } from '../types';
import { Play, RotateCcw, CheckCircle2, XCircle, Activity, Sparkles } from 'lucide-react';

interface SandboxRunnerProps {
  sandbox: SandboxSimulation;
  issueId: string;
}

export const SandboxRunner: React.FC<SandboxRunnerProps> = ({ sandbox }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [useSynapseFix, setUseSynapseFix] = useState(true);
  const [simResults, setSimResults] = useState<{
    totalSent: number;
    succeeded: number;
    failed: number;
    activeCalls: number;
    logs: string[];
  } | null>(null);

  const runSimulation = () => {
    setIsRunning(true);
    setSimResults({
      totalSent: 0,
      succeeded: 0,
      failed: 0,
      activeCalls: 0,
      logs: [`[T=0ms] Initializing concurrency stress test (${sandbox.parameters.concurrentRequests || 20} requests)...`]
    });

    let currentSent = 0;
    const total = (sandbox.parameters.concurrentRequests as number) || 20;

    const interval = setInterval(() => {
      currentSent += 4;
      if (currentSent >= total) {
        clearInterval(interval);
        setIsRunning(false);

        if (useSynapseFix) {
          setSimResults({
            totalSent: total,
            succeeded: total,
            failed: 0,
            activeCalls: 1,
            logs: [
              `[T=0ms] Concurrent burst fired: ${total} calls initiated simultaneously.`,
              `[T=12ms] Single-flight mutex acquired by Request #1. Active promise shared across remaining ${total - 1} callers.`,
              `[T=120ms] Outbound /oauth/token returned 200 OK with refreshed JWT.`,
              `[T=122ms] Cache updated with 15s grace buffer. Mutex released cleanly.`,
              `[T=125ms] All ${total} requests resolved successfully. Zero 401 errors, zero logout interruptions.`
            ]
          });
        } else {
          const failedCount = total - 1;
          setSimResults({
            totalSent: total,
            succeeded: 1,
            failed: failedCount,
            activeCalls: total,
            logs: [
              `[T=0ms] Concurrent burst fired: ${total} calls initiated simultaneously without single-flight lock.`,
              `[T=15ms] ⚠️ Race condition: ${total} duplicate POST /oauth/token requests dispatched upstream!`,
              `[T=120ms] Request #1 succeeded. Refresh token rotated and invalidated.`,
              `[T=124ms] ❌ Requests #2-${total} rejected with HTTP 400 invalid_grant: "Refresh token already consumed".`,
              `[T=130ms] 🚨 FAILURE: 19 user requests failed. Auth subsystem emitted SessionExpiredEvent. User force-logged out.`
            ]
          });
        }
      } else {
        setSimResults((prev) => ({
          totalSent: currentSent,
          succeeded: useSynapseFix ? currentSent : 1,
          failed: useSynapseFix ? 0 : Math.max(0, currentSent - 1),
          activeCalls: useSynapseFix ? 1 : currentSent,
          logs: [...(prev?.logs || []), `[T+${currentSent * 15}ms] In-flight burst: dispatching batch of 4 concurrent calls...`]
        }));
      }
    }, 180);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-base font-semibold text-slate-100">{sandbox.title}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">{sandbox.description}</p>
        </div>

        {/* Mode Selector Toggle */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setUseSynapseFix(false)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              !useSynapseFix 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Before Fix (Un-steered)
          </button>
          <button
            onClick={() => setUseSynapseFix(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              useSynapseFix 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            With Synapse Fix
          </button>
        </div>
      </div>

      {/* Simulator Control & Visualizer */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Simulation Config</div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Concurrent Burst Size:</span>
              <span className="font-mono font-semibold text-indigo-300">{sandbox.parameters.concurrentRequests || 20} requests</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Simulated Latency:</span>
              <span className="font-mono text-slate-400">120ms roundtrip</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Active Implementation:</span>
              <span className={`font-medium ${useSynapseFix ? 'text-emerald-400' : 'text-rose-400'}`}>
                {useSynapseFix ? 'Single-Flight Mutex' : 'Unsynchronized Parallel'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                isRunning
                  ? 'bg-indigo-600/50 text-indigo-200 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              {isRunning ? 'Running Burst Stress Test...' : 'Run Concurrency Test'}
            </button>
            <button
              onClick={() => setSimResults(null)}
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Metrics Checklist */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-slate-300">Expected Ergonomic Delta:</div>
            {sandbox.metrics.map((m, idx) => (
              <div key={idx} className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-2.5 text-xs">
                <div className="text-slate-400">{m.label}</div>
                <div className="flex items-center justify-between mt-1 font-mono">
                  <span className="text-rose-400/80 line-through text-[11px]">{m.before}</span>
                  <span className="text-emerald-400 font-semibold">{m.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Simulation Display */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
            <span className="text-slate-400 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : simResults ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              Terminal Emulation Output
            </span>
            {simResults && (
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" />
                  {simResults.succeeded} OK
                </span>
                {simResults.failed > 0 && (
                  <span className="text-rose-400 flex items-center gap-1 text-[11px]">
                    <XCircle className="w-3 h-3" />
                    {simResults.failed} FAIL
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[220px] max-h-[300px] overflow-y-auto mt-3 space-y-1.5 text-xs">
            {!simResults ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <Activity className="w-8 h-8 mb-2 opacity-30 text-indigo-400" />
                <p>Click "Run Concurrency Test" above to trigger simulated burst.</p>
                <p className="text-[11px] text-slate-400 mt-1">Experience the difference between un-steered vs co-steered logic.</p>
              </div>
            ) : (
              simResults.logs.map((log, i) => (
                <div 
                  key={i} 
                  className={`leading-relaxed ${
                    log.includes('❌') || log.includes('🚨')
                      ? 'text-rose-400 bg-rose-950/20 px-2 py-1 rounded border-l-2 border-rose-500'
                      : log.includes('⚠️')
                      ? 'text-amber-300'
                      : log.includes('Single-flight') || log.includes('resolved successfully')
                      ? 'text-emerald-300 bg-emerald-950/20 px-2 py-1 rounded border-l-2 border-emerald-500'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
