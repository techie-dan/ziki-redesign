import React from 'react';
import { ZikiIssue } from '../types';
import { getStepIndexForStatus } from './LifecycleProgress';
import { 
  Bot, 
  User, 
  GitBranch, 
  Compass, 
  Clock, 
  Coins, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface IssueCardProps {
  issue: ZikiIssue;
  isSynapseMode: boolean;
  onSelect: (issue: ZikiIssue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  isSynapseMode,
  onSelect
}) => {
  const currentStep = getStepIndexForStatus(issue.status);
  const activeWaypoint = issue.waypoints.find(w => w.status === 'awaiting_human');

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'critical':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'high':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'medium':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'delivering':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'authorizing':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'proving':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'ready_merge':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'merged':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div 
      onClick={() => onSelect(issue)}
      className={`group relative bg-slate-900/90 hover:bg-slate-850 border rounded-2xl p-5 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
        activeWaypoint && isSynapseMode
          ? 'border-amber-500/50 shadow-amber-950/20 ring-1 ring-amber-500/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Metadata Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {issue.id}
          </span>
          <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded border ${getStatusBadge(issue.status)}`}>
            {issue.status.replace('_', ' ')}
          </span>
          <span className={`text-[10px] font-medium uppercase px-1.5 py-0.5 rounded border ${getPriorityBadge(issue.priority)}`}>
            {issue.priority}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-slate-400" />
            {issue.tokenSpend.toLocaleString()} tok
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {issue.estTime}
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
        {issue.title}
      </h3>
      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
        {issue.description}
      </p>

      {/* Active Waypoint Alert Banner (Synapse Feature) */}
      {isSynapseMode && activeWaypoint && (
        <div className="mt-3.5 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-2.5">
          <Compass className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 animate-spin" />
          <div className="text-xs">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <span>Waypoint Requires Human Steering:</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-200 px-1.5 py-0.2 rounded border border-amber-500/30">Action Needed</span>
            </div>
            <p className="text-amber-200/90 text-[11px] mt-0.5 font-sans">
              {activeWaypoint.title}
            </p>
          </div>
        </div>
      )}

      {/* Comparison Snippet */}
      <div className="mt-3.5 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px]">
        {isSynapseMode ? (
          <div className="text-indigo-300 flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-200">Synapse Edge:</strong> {issue.traditionalVsSynapseDiff.synapseAdvantage}</span>
          </div>
        ) : (
          <div className="text-slate-400 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-300">Traditional Bottleneck:</strong> {issue.traditionalVsSynapseDiff.traditionalIssue}</span>
          </div>
        )}
      </div>

      {/* Mini 6-Step Progress Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((st) => (
              <div
                key={st}
                className={`w-4 h-1.5 rounded-full transition-all ${
                  st < currentStep || (st === 6 && issue.status === 'merged')
                    ? 'bg-emerald-500'
                    : st === currentStep
                    ? 'bg-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-slate-800'
                }`}
                title={`Step ${st}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 ml-1">
            Step {currentStep}/6
          </span>
        </div>

        {/* Human Owner + Agent Badges */}
        <div className="flex items-center gap-3">
          {/* Solver Agent */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-slate-300">{issue.agent.name.split(' ')[0]}</span>
          </div>

          {/* Owner */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{issue.owner.handle}</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
};
