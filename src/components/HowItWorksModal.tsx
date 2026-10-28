import React from 'react';
import { 
  X, 
  Bot, 
  User, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Layers,
  CheckCircle2,
  GitMerge
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateAgent: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onOpenCreateAgent
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                How Human-Agent Collaboration Works
              </h2>
              <p className="text-xs text-slate-400">
                The smart way humans guide AI agents without needing deep technical expertise
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300">
          
          {/* Executive Value Box */}
          <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4">
            <h3 className="font-semibold text-indigo-200 text-sm mb-1">
              Why this is better than traditional AI tools
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Most AI tools act like an opaque "black box": you ask them to fix something, they disappear, and come back with hundreds of lines of code that might not do what you wanted. <strong>Ziki with Co-Steering</strong> turns the agent into a true teammate that keeps you informed and asks for your guidance at key moments.
            </p>
          </div>

          {/* 3 Core Improvements */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              The 3 Big Improvements:
            </h4>

            {/* Improvement 1 */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h5 className="font-semibold text-slate-100 text-sm">
                  1. Simplified Agent Creation (No Code Needed)
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instead of writing complicated prompts or configurations, you can choose pre-built role blueprints (like <em>Security Guardian</em> or <em>UI Polisher</em>) or simply describe what you need in plain English.
                </p>
              </div>
            </div>

            {/* Improvement 2 */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0 mt-0.5">
                <Compass className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h5 className="font-semibold text-slate-100 text-sm">
                  2. In-Flight Decision Points (Waypoints)
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  When an agent is building a solution and encounters an architectural trade-off, it pauses and gives you 1-click options with plain-English consequences. You guide the direction in seconds.
                </p>
              </div>
            </div>

            {/* Improvement 3 */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h5 className="font-semibold text-slate-100 text-sm">
                  3. Independent Verification Before Merge
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  To prevent errors, an independent verifier agent reproduces the issue and runs stress tests on the code fix before you do the final one-click merge.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Step by Step Diagram */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              How an Issue Moves from Start to Finish:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-bold text-slate-200">1. Report &amp; Plan</div>
                <div className="text-[11px] text-slate-400 mt-1">Agent proposes 2 easy approaches</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-bold text-slate-200">2. Co-Steering</div>
                <div className="text-[11px] text-amber-300 mt-1">Human gives 1-click guidance</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-bold text-slate-200">3. Independent Proof</div>
                <div className="text-[11px] text-emerald-400 mt-1">Neutral agent verifies tests</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <div className="font-bold text-slate-200">4. Final Merge</div>
                <div className="text-[11px] text-indigo-300 mt-1">Human approves clean PR</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={() => { onClose(); onOpenCreateAgent(); }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30"
          >
            <Bot className="w-3.5 h-3.5" />
            Try Creating an Agent
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
