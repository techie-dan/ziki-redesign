import React, { useState } from 'react';
import { ZikiIssue, AgentActor } from './types';
import { INITIAL_ISSUES } from './data/mockIssues';
import { INITIAL_AGENTS } from './data/mockAgents';
import { Header } from './components/Header';
import { IssueCard } from './components/IssueCard';
import { IssueDetailModal } from './components/IssueDetailModal';
import { CreateAgentModal } from './components/CreateAgentModal';
import { AgentRoster } from './components/AgentRoster';
import { HowItWorksModal } from './components/HowItWorksModal';
import { NewIssueModal } from './components/NewIssueModal';
import { VercelDeployModal } from './components/VercelDeployModal';
import { 
  Search, 
  Sparkles, 
  Compass, 
  Bot, 
  Users, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [issues, setIssues] = useState<ZikiIssue[]>(INITIAL_ISSUES);
  const [agents, setAgents] = useState<AgentActor[]>(INITIAL_AGENTS);
  
  // Navigation View
  const [activeView, setActiveView] = useState<'issues' | 'agents'>('issues');

  // Modals
  const [selectedIssue, setSelectedIssue] = useState<ZikiIssue | null>(null);
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isNewIssueOpen, setIsNewIssueOpen] = useState<boolean>(false);
  const [isVercelOpen, setIsVercelOpen] = useState<boolean>(false);

  // Filters for issues
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentOwner = '@erostova';

  // Handle agent creation
  const handleAgentCreated = (newAgent: AgentActor) => {
    setAgents((prev) => [newAgent, ...prev]);
    setActiveView('agents');
  };

  // Handle update from modal
  const handleUpdateIssue = (updated: ZikiIssue) => {
    setIssues((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedIssue(updated);
  };

  const handleAddIssue = (newIssue: ZikiIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    setSelectedIssue(newIssue);
  };

  // Filtered issues
  const filteredIssues = issues.filter((issue) => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = issue.id.toLowerCase().includes(q);
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchRepo = issue.repository.toLowerCase().includes(q);
      const matchAgent = issue.agent.name.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchRepo && !matchAgent) return false;
    }
    return true;
  });

  const awaitingSteerCount = issues.reduce(
    (acc, iss) => acc + iss.waypoints.filter((w) => w.status === 'awaiting_human').length,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Clean, Non-Technical Header */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        onCreateAgent={() => setIsCreateAgentOpen(true)}
        onNewIssue={() => setIsNewIssueOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        awaitingSteerCount={awaitingSteerCount}
        totalIssuesCount={issues.length}
        totalAgentsCount={agents.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Friendly Hero Banner: Human-Agent Interaction */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Human + AI Teamwork
                </span>
                <span className="text-xs text-slate-400">
                  {agents.length} Specialized Agents Active
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                Guide AI Agents with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Simple Human Direction</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Agents propose plans, pause for your input at key decisions (waypoints), and have their code verified by independent tester agents before you merge.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto flex-shrink-0">
              <button
                onClick={() => setIsCreateAgentOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                Create an AI Teammate
              </button>
              <button
                onClick={() => setIsHowItWorksOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
              >
                Learn How Co-Steering Works
              </button>
            </div>
          </div>
        </div>

        {/* View Switch: Issues vs Agents */}
        {activeView === 'agents' ? (
          <AgentRoster
            agents={agents}
            onCreateAgent={() => setIsCreateAgentOpen(true)}
          />
        ) : (
          <div className="space-y-6">
            
            {/* Quick Stats Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Awaiting Your Input</span>
                </div>
                <div className="text-xl font-bold text-slate-100 mt-1 font-mono">
                  {awaitingSteerCount} <span className="text-xs font-normal text-amber-400 font-sans">{awaitingSteerCount > 0 ? 'Decisions Needed' : 'All Clear'}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">1-click guidance requests</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Your AI Teammates</span>
                </div>
                <div className="text-xl font-bold text-slate-100 mt-1 font-mono">
                  {agents.length} <span className="text-xs font-normal text-indigo-300 font-sans">Ready</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Configured with guardrails</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Independent Testing</span>
                </div>
                <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
                  100% <span className="text-xs text-slate-400 font-normal">Audited</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Zero self-approving agents</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>First-Pass Accuracy</span>
                </div>
                <div className="text-xl font-bold text-cyan-300 mt-1 font-mono">
                  98.6%
                </div>
                <div className="text-[11px] text-slate-400 mt-1">High consensus before merge</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3">
              
              {/* Simple Stage Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-medium">
                {[
                  { id: 'all', label: 'All Issues' },
                  { id: 'authorizing', label: 'Reviewing Plan' },
                  { id: 'delivering', label: 'In Progress' },
                  { id: 'proving', label: 'Testing' },
                  { id: 'ready_merge', label: 'Ready to Merge' },
                  { id: 'merged', label: 'Merged' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`py-1.5 px-3 rounded-lg transition-all whitespace-nowrap ${
                      statusFilter === tab.id
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search issues, repos, agents..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Issues Cards Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Showing <strong className="text-slate-200">{filteredIssues.length}</strong> issues</span>
                <span>Click any issue to open the <strong className="text-slate-300">Co-Steering Panel</strong></span>
              </div>

              {filteredIssues.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
                  <AlertCircle className="w-8 h-8 text-indigo-400 mx-auto opacity-40" />
                  <h3 className="text-sm font-semibold text-slate-200">No issues found</h3>
                  <p className="text-xs max-w-sm mx-auto">Try clearing search filters or create a new issue.</p>
                  <button
                    onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      isSynapseMode={true}
                      onSelect={(item) => setSelectedIssue(item)}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-5 px-4 sm:px-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">ziki.dev</span>
            <span>&bull;</span>
            <span>Human-Agent Interactive Software Delivery</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="hover:text-indigo-300 underline"
            >
              How Human-Agent Co-Steering Works
            </button>
            <button
              onClick={() => setIsCreateAgentOpen(true)}
              className="hover:text-indigo-300 underline"
            >
              Create an Agent
            </button>
            <button
              onClick={() => setIsVercelOpen(true)}
              className="hover:text-indigo-300 underline text-slate-400"
            >
              Deploy on Vercel
            </button>
          </div>
        </div>
      </footer>

      {/* Detail / Co-Steering Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          isOpen={!!selectedIssue}
          isSynapseMode={true}
          onClose={() => setSelectedIssue(null)}
          onUpdateIssue={handleUpdateIssue}
        />
      )}

      {/* Create Agent Modal (Simplified) */}
      <CreateAgentModal
        isOpen={isCreateAgentOpen}
        onClose={() => setIsCreateAgentOpen(false)}
        onAgentCreated={handleAgentCreated}
        currentOwnerHandle={currentOwner}
      />

      {/* How It Works Modal (Plain English) */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onOpenCreateAgent={() => setIsCreateAgentOpen(true)}
      />

      {/* New Issue Modal */}
      <NewIssueModal
        isOpen={isNewIssueOpen}
        onClose={() => setIsNewIssueOpen(false)}
        onAddIssue={handleAddIssue}
      />

      {/* Vercel Deploy Modal (available from footer) */}
      <VercelDeployModal
        isOpen={isVercelOpen}
        onClose={() => setIsVercelOpen(false)}
      />
    </div>
  );
}
