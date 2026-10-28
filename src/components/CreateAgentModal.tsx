import React, { useState } from 'react';
import { AgentActor } from '../types';
import { 
  X, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Sliders, 
  Check, 
  HelpCircle,
  Zap,
  Code2,
  Lock,
  Gauge,
  Palette,
  ArrowRight
} from 'lucide-react';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated: (agent: AgentActor) => void;
  currentOwnerHandle: string;
}

const BLUEPRINTS = [
  {
    id: 'frontend_polisher',
    title: 'Frontend & UI Polisher',
    icon: Palette,
    tagline: 'Fixes visual bugs, CSS quirks, and accessibility',
    role: 'Frontend & UI Engineer',
    specialties: ['React / TypeScript', 'Tailwind CSS', 'Responsive Mobile', 'Accessibility'],
    autonomyLevel: 'balanced' as const,
    avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=120&auto=format&fit=crop&q=80',
    guardrails: [
      'Show visual previews before committing changes',
      'Never break mobile responsive layout',
      'Follow design system components'
    ],
    instructions: 'Keep code clean and explain UI trade-offs in plain English.'
  },
  {
    id: 'backend_security',
    title: 'Backend & Security Guardian',
    icon: Lock,
    tagline: 'Patches auth loops, token leaks, and SQL race conditions',
    role: 'Backend & Security Specialist',
    specialties: ['OAuth2 & JWT', 'Race Conditions', 'Node / Express', 'Database Concurrency'],
    autonomyLevel: 'supervised' as const,
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    guardrails: [
      'Must ask human before any database schema change',
      'Zero hardcoded credentials or tokens',
      'Pause at architectural waypoints'
    ],
    instructions: 'Highlight blast radius and safety impact before touching credentials.'
  },
  {
    id: 'perf_optimizer',
    title: 'Speed & Performance Tuner',
    icon: Gauge,
    tagline: 'Squashes memory leaks, caching issues, and slow APIs',
    role: 'Performance & SRE Specialist',
    specialties: ['Memory Leaks', 'Cache Stampedes', 'Query Optimization', 'Throughput'],
    autonomyLevel: 'balanced' as const,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    guardrails: [
      'Measure before and after latency benchmarks',
      'Avoid high memory allocations',
      'Verify garbage collection stability'
    ],
    instructions: 'Always include measurable latency metrics in review comments.'
  },
  {
    id: 'independent_tester',
    title: 'Independent Tester & Verifier',
    icon: ShieldCheck,
    tagline: 'Runs neutral reproduction tests and mutation checks',
    role: 'Independent QA & Security Auditor',
    specialties: ['Reproduction Suites', 'Mutation Testing', 'Regression Verification', 'Cross-Owner Audit'],
    autonomyLevel: 'autonomous' as const,
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&auto=format&fit=crop&q=80',
    guardrails: [
      'Strictly neutral audit: cannot verify issues claimed by same human owner',
      'Run stress test matrix before issuing pass verdict',
      'Cryptographically log verification findings'
    ],
    instructions: 'Verify reproduction rigorously without bias or rubber-stamping.'
  }
];

export const CreateAgentModal: React.FC<CreateAgentModalProps> = ({
  isOpen,
  onClose,
  onAgentCreated,
  currentOwnerHandle
}) => {
  const [creationMode, setCreationMode] = useState<'blueprint' | 'prompt'>('blueprint');
  
  // Form fields
  const [agentName, setAgentName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80');
  const [autonomyLevel, setAutonomyLevel] = useState<'supervised' | 'balanced' | 'autonomous'>('balanced');
  const [specialtiesText, setSpecialtiesText] = useState('React, Bug Fixing, TypeScript');
  
  // Guardrail checkboxes (friendly non-technical rules)
  const [guardrailPauseWaypoints, setGuardrailPauseWaypoints] = useState(true);
  const [guardrailPlainEnglish, setGuardrailPlainEnglish] = useState(true);
  const [guardrailNoSecretLeaks, setGuardrailNoSecretLeaks] = useState(true);
  const [guardrailAskSchema, setGuardrailAskSchema] = useState(true);

  // Natural language prompt input
  const [naturalPrompt, setNaturalPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  // Apply a blueprint template
  const applyBlueprint = (bp: typeof BLUEPRINTS[0]) => {
    setAgentName(bp.title.split(' ')[0] + '-' + Math.floor(10 + Math.random() * 90));
    setRole(bp.role);
    setDescription(bp.tagline);
    setAvatar(bp.avatar);
    setAutonomyLevel(bp.autonomyLevel);
    setSpecialtiesText(bp.specialties.join(', '));
  };

  // Convert natural language to agent settings (Simple, AI-assisted)
  const handleGenerateFromPrompt = () => {
    if (!naturalPrompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const p = naturalPrompt.toLowerCase();
      let detectedRole = 'Full-Stack Software Assistant';
      let detectedName = 'Echo-' + Math.floor(10 + Math.random() * 90);
      let detectedAvatar = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
      let detectedSpecialties = ['General Coding', 'Issue Resolution', 'Code Quality'];
      let detectedAutonomy: 'supervised' | 'balanced' | 'autonomous' = 'balanced';

      if (p.includes('security') || p.includes('auth') || p.includes('token') || p.includes('protect')) {
        detectedRole = 'Security & Authentication Gatekeeper';
        detectedName = 'Aegis-' + Math.floor(10 + Math.random() * 90);
        detectedAvatar = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&auto=format&fit=crop&q=80';
        detectedSpecialties = ['OAuth2', 'JWT Security', 'Audit Invariants', 'Input Sanitization'];
        detectedAutonomy = 'supervised';
      } else if (p.includes('ui') || p.includes('front') || p.includes('css') || p.includes('react') || p.includes('design')) {
        detectedRole = 'Frontend & Design Systems Specialist';
        detectedName = 'Prism-' + Math.floor(10 + Math.random() * 90);
        detectedAvatar = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=120&auto=format&fit=crop&q=80';
        detectedSpecialties = ['React / TypeScript', 'Tailwind CSS', 'Responsive Layouts', 'UX Polish'];
        detectedAutonomy = 'balanced';
      } else if (p.includes('database') || p.includes('sql') || p.includes('backend') || p.includes('api')) {
        detectedRole = 'Backend Systems & Database Optimizer';
        detectedName = 'Titan-' + Math.floor(10 + Math.random() * 90);
        detectedAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80';
        detectedSpecialties = ['PostgreSQL', 'API Architecture', 'Distributed Locks', 'Latency Reduction'];
        detectedAutonomy = 'supervised';
      }

      setAgentName(detectedName);
      setRole(detectedRole);
      setDescription(naturalPrompt.slice(0, 120));
      setAvatar(detectedAvatar);
      setSpecialtiesText(detectedSpecialties.join(', '));
      setAutonomyLevel(detectedAutonomy);
      setIsGenerating(false);
      setCreationMode('blueprint');
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = agentName.trim() || 'Nova-' + Math.floor(10 + Math.random() * 90);
    const finalRole = role.trim() || 'Software Delivery Assistant';
    const finalDesc = description.trim() || 'Collaborative agent working on issues with human oversight.';

    const activeGuardrails: string[] = [];
    if (guardrailPauseWaypoints) activeGuardrails.push('Pause at architectural crossroads for human steer');
    if (guardrailPlainEnglish) activeGuardrails.push('Explain reasoning in plain English');
    if (guardrailNoSecretLeaks) activeGuardrails.push('Prevent committing secrets or credentials');
    if (guardrailAskSchema) activeGuardrails.push('Require human approval before database alterations');

    const newAgent: AgentActor = {
      id: `agent_${finalName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
      name: finalName,
      model: 'gemini-2.5-pro-coding',
      avatar,
      ownerHandle: currentOwnerHandle || '@you',
      role: finalRole,
      description: finalDesc,
      specialties: specialtiesText.split(',').map(s => s.trim()).filter(Boolean),
      autonomyLevel,
      guardrails: activeGuardrails,
      instructions: 'Keep human in the loop. Provide concise explanations and verify code before asking to merge.',
      reputation: 99.0,
      totalDelivered: 0,
      successRate: 100,
      status: 'idle'
    };

    onAgentCreated(newAgent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                Create an AI Teammate
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Simplified
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pick a ready-made role or describe what you need in plain English. No complex code or config needed.
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

        {/* Mode Switcher: 1-Click Blueprints vs Plain English Prompt */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center gap-3">
          <button
            onClick={() => setCreationMode('blueprint')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              creationMode === 'blueprint'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            1-Click Role Templates
          </button>
          <button
            onClick={() => setCreationMode('prompt')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              creationMode === 'prompt'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Describe in Plain English
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-slate-300">
          
          {/* Mode 1: Plain English Creator */}
          {creationMode === 'prompt' && (
            <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-slate-100 text-sm">
                  What kind of help do you need?
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Describe the tasks, coding style, or safety rules you want your agent to follow in normal, everyday language.
              </p>
              <textarea
                rows={3}
                value={naturalPrompt}
                onChange={(e) => setNaturalPrompt(e.target.value)}
                placeholder="Example: I need an agent that reviews PRs for accessibility and security, asks me before touching auth code, and speaks in friendly bullet points..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
              <button
                type="button"
                onClick={handleGenerateFromPrompt}
                disabled={!naturalPrompt.trim() || isGenerating}
                className="py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                {isGenerating ? 'Configuring Your Agent...' : 'Generate My Agent Configuration'}
              </button>
            </div>
          )}

          {/* Mode 2: Blueprint Quick Pick */}
          {creationMode === 'blueprint' && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
                Choose a Role Blueprint (Click to Apply):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BLUEPRINTS.map((bp) => {
                  const Icon = bp.icon;
                  return (
                    <div
                      key={bp.id}
                      onClick={() => applyBlueprint(bp)}
                      className="cursor-pointer bg-slate-950 border border-slate-800 hover:border-indigo-500/60 rounded-xl p-3.5 flex items-start gap-3 transition-all hover:bg-slate-900/60"
                    >
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                          {bp.title}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {bp.tagline}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customizable Agent Details */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Agent Name:
                </label>
                <input
                  type="text"
                  required
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g. Solaris-4, PixelCraft, Sentinel..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Role / Specialty:
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Backend Security Specialist, UI Polisher..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                What this agent focuses on:
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Handles bug fixes in authentication and concurrent database updates..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Human-Agent Interaction Level (Autonomy Slider) */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  Human-Agent Collaboration Level:
                </span>
                <span className="text-xs font-mono font-medium capitalize text-indigo-400">
                  {autonomyLevel} Mode
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setAutonomyLevel('supervised')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    autonomyLevel === 'supervised'
                      ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/40 text-amber-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs">Supervised</div>
                  <div className="text-[11px] mt-0.5 opacity-80 leading-tight">
                    Asks your approval on every decision before writing code.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAutonomyLevel('balanced')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    autonomyLevel === 'balanced'
                      ? 'bg-indigo-950/30 border-indigo-500 ring-1 ring-indigo-500/40 text-indigo-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs">Balanced (Recommended)</div>
                  <div className="text-[11px] mt-0.5 opacity-80 leading-tight">
                    Pauses at key architectural crossroads (waypoints) for your input.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAutonomyLevel('autonomous')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    autonomyLevel === 'autonomous'
                      ? 'bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500/40 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs">Autonomous</div>
                  <div className="text-[11px] mt-0.5 opacity-80 leading-tight">
                    Runs end-to-end and delivers ready-to-merge, verified PRs.
                  </div>
                </button>
              </div>
            </div>

            {/* Non-Technical Safety Guardrails */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Human Oversight Rules (Guardrails):
              </span>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={guardrailPauseWaypoints}
                    onChange={(e) => setGuardrailPauseWaypoints(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <span>Pause mid-flight when facing trade-offs (In-Flight Waypoint Protocol)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={guardrailPlainEnglish}
                    onChange={(e) => setGuardrailPlainEnglish(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <span>Explain code changes and risks in plain, human-friendly language</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={guardrailNoSecretLeaks}
                    onChange={(e) => setGuardrailNoSecretLeaks(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <span>Prevent committing API keys or credentials into the repository</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={guardrailAskSchema}
                    onChange={(e) => setGuardrailAskSchema(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <span>Require human sign-off before modifying database tables or schemas</span>
                </label>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Assigned Owner: <strong className="text-slate-200">{currentOwnerHandle || '@you'}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" />
                  Create AI Teammate
                </button>
              </div>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
