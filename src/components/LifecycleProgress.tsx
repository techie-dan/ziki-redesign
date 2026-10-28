import React from 'react';
import { IssueStatus } from '../types';
import { 
  FilePlus2, 
  CheckCircle2, 
  KeyRound, 
  GitPullRequest, 
  ShieldCheck, 
  GitMerge,
  Sparkles
} from 'lucide-react';

interface LifecycleProgressProps {
  status: IssueStatus;
  isSynapseMode: boolean;
  onStepClick?: (step: number) => void;
  activeTab?: string;
}

const STEPS = [
  {
    num: 1,
    name: 'Report',
    event: 'issue.created',
    icon: FilePlus2,
    synapseFeature: 'Duplicate Prevention & Context Graph'
  },
  {
    num: 2,
    name: 'Confirm',
    event: 'issue.confirmed',
    icon: CheckCircle2,
    synapseFeature: 'Blast Radius & Risk Classification'
  },
  {
    num: 3,
    name: 'Authorize',
    event: 'claim.accepted',
    icon: KeyRound,
    synapseFeature: 'Intent & Multi-Approach Canvas'
  },
  {
    num: 4,
    name: 'Deliver',
    event: 'issue.pr_linked',
    icon: GitPullRequest,
    synapseFeature: 'Live Flight Telemetry & In-Flight Waypoints'
  },
  {
    num: 5,
    name: 'Prove',
    event: 'issue.test_verdict',
    icon: ShieldCheck,
    synapseFeature: 'Independent Verifier & Live Sandbox'
  },
  {
    num: 6,
    name: 'Merge',
    event: 'issue.accepted',
    icon: GitMerge,
    synapseFeature: 'Verifiable Consensus Certificate'
  }
];

export const getStepIndexForStatus = (status: IssueStatus): number => {
  switch (status) {
    case 'created': return 1;
    case 'confirmed': return 2;
    case 'authorizing': return 3;
    case 'delivering': return 4;
    case 'proving': return 5;
    case 'ready_merge': return 6;
    case 'merged': return 6;
    default: return 1;
  }
};

export const LifecycleProgress: React.FC<LifecycleProgressProps> = ({
  status,
  isSynapseMode,
  onStepClick
}) => {
  const currentStep = getStepIndexForStatus(status);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Ziki 6-Step Lifecycle
          </span>
          {isSynapseMode && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Synapse Co-Steered
            </span>
          )}
        </div>
        <div className="text-xs text-slate-400">
          Current State: <strong className="text-indigo-300 uppercase tracking-wide">{status.replace('_', ' ')}</strong> (Step {currentStep} of 6)
        </div>
      </div>

      <div className="relative">
        {/* Connecting track */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 -translate-y-1/2 z-0">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-indigo-400 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, ((currentStep - 1) / 5) * 100))}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative z-10 flex items-start justify-between">
          {STEPS.map((step) => {
            const isCompleted = step.num < currentStep || (step.num === 6 && status === 'merged');
            const isCurrent = step.num === currentStep && status !== 'merged';
            const Icon = step.icon;

            return (
              <button
                key={step.num}
                onClick={() => onStepClick?.(step.num)}
                className="flex flex-col items-center group focus:outline-none transition-all duration-200"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : isCurrent
                      ? 'bg-indigo-600 border-2 border-indigo-300 text-white shadow-[0_0_16px_rgba(99,102,241,0.5)] scale-110'
                      : 'bg-slate-800/80 border border-slate-700 text-slate-400 group-hover:border-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="mt-2 text-center">
                  <div className={`text-xs font-semibold ${isCurrent ? 'text-indigo-300' : isCompleted ? 'text-slate-300' : 'text-slate-400'}`}>
                    {step.num}. {step.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {step.event}
                  </div>
                </div>

                {isSynapseMode && isCurrent && (
                  <div className="mt-1 max-w-[110px] text-center text-[10px] text-indigo-400 font-medium leading-tight">
                    ⚡ {step.synapseFeature}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
