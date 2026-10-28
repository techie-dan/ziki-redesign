import React from 'react';
import { 
  Bot, 
  Plus, 
  Sparkles, 
  Layers, 
  Compass, 
  HelpCircle,
  Users
} from 'lucide-react';

interface HeaderProps {
  activeView: 'issues' | 'agents';
  onSelectView: (view: 'issues' | 'agents') => void;
  onCreateAgent: () => void;
  onNewIssue: () => void;
  onOpenHowItWorks: () => void;
  awaitingSteerCount: number;
  totalIssuesCount: number;
  totalAgentsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  onCreateAgent,
  onNewIssue,
  onOpenHowItWorks,
  awaitingSteerCount,
  totalIssuesCount,
  totalAgentsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-slate-100 tracking-tight">
                ziki<span className="text-indigo-400">.dev</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Human + AI Collaboration
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              Smart issue delivery with interactive human guidance
            </p>
          </div>
        </div>

        {/* View Switcher: Issues vs Agents */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => onSelectView('issues')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'issues'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Issues</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30 text-indigo-200 ml-0.5">
              {totalIssuesCount}
            </span>
            {awaitingSteerCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" title={`${awaitingSteerCount} need input`} />
            )}
          </button>

          <button
            onClick={() => onSelectView('agents')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'agents'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>AI Agents</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30 text-indigo-200 ml-0.5">
              {totalAgentsCount}
            </span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* How it works info button */}
          <button
            onClick={onOpenHowItWorks}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="How Human-Agent Co-Steering Works"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">How It Works</span>
          </button>

          {/* Create Agent Button (Highlight) */}
          <button
            onClick={onCreateAgent}
            className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Create Agent</span>
          </button>

          {/* New Issue Button */}
          <button
            onClick={onNewIssue}
            className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">New</span> Issue
          </button>
        </div>

      </div>

      {/* Clean Notification Strip if an issue is waiting for human steer */}
      {awaitingSteerCount > 0 && (
        <div className="bg-amber-950/40 border-t border-amber-500/20 px-4 sm:px-6 py-1.5 text-xs text-amber-300 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>An agent reached a decision point and is waiting for your input.</span>
            </span>
            <button
              onClick={() => onSelectView('issues')}
              className="font-medium underline hover:text-white ml-2 text-[11px]"
            >
              Review Issue &rarr;
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
