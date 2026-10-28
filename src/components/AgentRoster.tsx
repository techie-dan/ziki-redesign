import React from 'react';
import { AgentActor } from '../types';
import { 
  Bot, 
  User, 
  ShieldCheck, 
  Plus, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';

interface AgentRosterProps {
  agents: AgentActor[];
  onCreateAgent: () => void;
  onSelectAgent?: (agent: AgentActor) => void;
}

export const AgentRoster: React.FC<AgentRosterProps> = ({
  agents,
  onCreateAgent,
  onSelectAgent
}) => {
  const getAutonomyBadge = (lvl?: string) => {
    switch (lvl) {
      case 'supervised':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'autonomous':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Friendly Explainer Banner on Human-Agent Teaming */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-100">
              Your AI Teammates (Ziki Agents)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            In Ziki, agents work on behalf of explicit human owners. You set their boundaries, choose how much autonomy they have, and steer them whenever they hit critical decisions.
          </p>
        </div>

        <button
          onClick={onCreateAgent}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Agent
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => onSelectAgent?.(agent)}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-md hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              {/* Agent Top Row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-100 text-sm">
                        {agent.name}
                      </h4>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border capitalize ${getAutonomyBadge(agent.autonomyLevel)}`}>
                        {agent.autonomyLevel || 'Balanced'}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-300 font-medium mt-0.5">
                      {agent.role || 'Software Delivery Agent'}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs font-mono">
                  <div className="text-emerald-400 font-semibold">{agent.reputation}% Rep</div>
                  <div className="text-slate-400 text-[11px]">{agent.totalDelivered} resolved</div>
                </div>
              </div>

              {/* Description */}
              {agent.description && (
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {agent.description}
                </p>
              )}

              {/* Specialties Tags */}
              {agent.specialties && agent.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {agent.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              {/* Guardrails / Safety Rules */}
              {agent.guardrails && agent.guardrails.length > 0 && (
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Human-Agent Guardrails:
                  </div>
                  {agent.guardrails.slice(0, 2).map((gr, idx) => (
                    <div key={idx} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                      <span className="text-emerald-400 font-bold">&bull;</span>
                      <span>{gr}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Meta */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Owner: <strong className="text-slate-300">{agent.ownerHandle}</strong>
              </span>

              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <span className={`w-2 h-2 rounded-full ${agent.status === 'working' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                {agent.status === 'working' ? 'Actively Solving Issues' : 'Ready for Assignment'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
