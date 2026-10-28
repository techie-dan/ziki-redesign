import React, { useState } from 'react';
import { ZikiIssue } from '../types';
import { X, Plus, Sparkles, Bot, ShieldCheck } from 'lucide-react';

interface NewIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIssue: (issue: ZikiIssue) => void;
}

const TEMPLATES = [
  {
    title: 'Cache stampede in user activity feed under high load',
    repo: 'feed-service / cache-layer',
    description: 'When Redis key for top-100 feeds expires every 60s, 500 concurrent worker threads miss the cache and simultaneously issue heavy SQL joins to PostgreSQL, spiking database CPU to 99%.',
    priority: 'high' as const,
    blastRadius: 'critical_path' as const
  },
  {
    title: 'PostgreSQL connection pool exhaustion during slow downstream webhook calls',
    repo: 'billing-engine / webhook-worker',
    description: 'Database connections held open across network I/O calls without query timeout, blocking subsequent transactional requests.',
    priority: 'critical' as const,
    blastRadius: 'critical_path' as const
  },
  {
    title: 'Stale closure bug in React hook causing stale auth token capture',
    repo: 'web-dashboard / auth-context',
    description: 'useCallback references stale state across token rotation cycles, sending expired Bearer token on second action.',
    priority: 'medium' as const,
    blastRadius: 'isolated' as const
  }
];

export const NewIssueModal: React.FC<NewIssueModalProps> = ({
  isOpen,
  onClose,
  onAddIssue
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repo, setRepo] = useState('core-platform / services');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  if (!isOpen) return null;

  const loadTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setTitle(tmpl.title);
    setDescription(tmpl.description);
    setRepo(tmpl.repo);
    setPriority(tmpl.priority);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newId = `ZK-${Math.floor(2100 + Math.random() * 800)}`;
    const newIssue: ZikiIssue = {
      id: newId,
      title: title.trim(),
      description: description.trim(),
      repository: repo,
      branch: `fix/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)}-${newId.toLowerCase()}`,
      status: 'authorizing',
      priority,
      blastRadius: priority === 'critical' ? 'critical_path' : 'moderate',
      confidenceScore: 82,
      createdDate: new Date().toISOString().substring(0, 19).replace('T', ' ') + ' UTC',
      tokenSpend: 16500,
      estTime: '20 mins remaining',
      owner: {
        name: 'Elena Rostova',
        handle: '@erostova',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        role: 'Staff Security Engineer'
      },
      agent: {
        id: 'agent_solaris_v4',
        name: 'Solaris-4 (Solver)',
        model: 'gemini-2.5-pro-coding',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        ownerHandle: '@erostova',
        reputation: 99.4,
        totalDelivered: 142,
        successRate: 98.6
      },
      independentVerifier: {
        id: 'agent_sentinel_prime',
        name: 'Sentinel-Prime (Verifier)',
        model: 'gemini-2.5-pro-coding',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&auto=format&fit=crop&q=80',
        ownerHandle: '@qa_security_audit',
        reputation: 99.8,
        totalDelivered: 310,
        successRate: 99.1
      },
      traditionalVsSynapseDiff: {
        traditionalIssue: 'Traditional Ziki would proceed with 1 rigid plan without asking your architecture preferences.',
        synapseAdvantage: 'Ziki Synapse immediately prepares an Intent & Multi-Approach Canvas and in-flight waypoints.'
      },
      planProposal: {
        summary: `Resolve ${title} with adaptive co-steering and verified tests.`,
        approaches: [
          {
            id: 'app_custom_1',
            title: 'Probabilistic Early Expiration (XFetch Algorithm)',
            description: 'Recalculate cache asynchronously before key expires based on read frequency and computation time.',
            estimatedTokens: 32000,
            estimatedMinutes: 15,
            breakingRisk: 'none',
            pros: ['Zero spike under 10,000 req/s', 'Zero latency degradation on reads'],
            cons: ['Requires slight mathematical tuning of beta factor'],
            selected: true
          },
          {
            id: 'app_custom_2',
            title: 'Mutex Locking with Stale-While-Revalidate',
            description: 'Serve stale cached entry for 5 seconds while background worker refreshes database.',
            estimatedTokens: 28000,
            estimatedMinutes: 12,
            breakingRisk: 'none',
            pros: ['Simple to reason about'],
            cons: ['Clients may see 5s stale data'],
            selected: false
          }
        ],
        clarifications: [
          {
            id: 'clar_c1',
            question: 'Is 5-second staleness acceptable for non-critical user profile data?',
            agentContext: 'Stale-While-Revalidate reduces DB hits by 98% with minimal user visibility.',
            options: ['Yes, 5s staleness is totally fine', 'No, strictly fresh data required', 'Make configurable per tenant'],
            selectedOption: 'Yes, 5s staleness is totally fine'
          }
        ]
      },
      waypoints: [
        {
          id: 'wp_custom_1',
          title: 'Algorithmic Selection: Probabilistic Early Refresh vs Distributed Mutex',
          stageName: 'Deliver (Step 4.2: Architectural Waypoint)',
          status: 'awaiting_human',
          dilemma: 'Should we introduce probabilistic early refresh (XFetch algorithm) or rely on Redis distributed lock mutex?',
          agentContext: 'Static analysis indicates Redis cluster is shared across 3 microservices.',
          options: [
            {
              id: 'opt_xfetch',
              label: 'Implement XFetch Probabilistic Early Expiration',
              impact: 'Mathematically avoids thundering herds with zero distributed locking overhead.',
              recommended: true
            },
            {
              id: 'opt_mutex',
              label: 'Implement Distributed Redis Mutex',
              impact: 'Strictly guarantees single DB query but adds network lock roundtrips.',
              recommended: false
            }
          ]
        }
      ],
      executionLogs: [
        {
          id: 'log_n1',
          stepNumber: 1,
          timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
          agent: 'Elena Rostova (Owner)',
          type: 'audit_event',
          message: `Event [issue.created]: Filed new issue ${newId}: ${title.trim()}`
        },
        {
          id: 'log_n2',
          stepNumber: 2,
          timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
          agent: 'agent_triager_3',
          type: 'audit_event',
          message: `Event [issue.confirmed]: Verified report and duplicate protection clean. Assigned solver Solaris-4.`
        },
        {
          id: 'log_n3',
          stepNumber: 3,
          timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
          agent: 'Solaris-4 (Solver)',
          type: 'thought',
          message: `Synthesized 2 architectural approaches for ${title.trim()}. Awaiting owner authorization.`
        }
      ],
      testVerdict: {
        reproduced: true,
        testCasesPassed: 16,
        totalTestCases: 16,
        coverageDelta: '+4.5%',
        mutationScore: '97.5%',
        verifierAgent: {
          id: 'agent_sentinel_prime',
          name: 'Sentinel-Prime (Verifier)',
          model: 'gemini-2.5-pro-coding',
          avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&auto=format&fit=crop&q=80',
          ownerHandle: '@qa_security_audit',
          reputation: 99.8,
          totalDelivered: 310,
          successRate: 99.1
        },
        independentAuditPassed: true,
        notes: 'Independent stress verification suite ready.'
      },
      codeDiff: {
        filename: 'src/cache/feedCache.ts',
        oldCode: `// Previous implementation subject to stampede
const val = await redis.get(key);
if (!val) {
  const fresh = await db.query(heavySql);
  await redis.set(key, fresh, 60);
  return fresh;
}`,
        newCode: `// Synapse Co-Steered Fix: XFetch probabilistic delta
const entry = await redis.getWithTtl(key);
const delta = computeDelta(entry.ttl, beta, computationTime);
if (!entry.val || delta > threshold) {
  // Asynchronous early renewal before hard expiration
  renewCacheInBackground(key);
}
return entry.val;`,
        explanation: 'Replaced naive cache-aside pattern with early probabilistic renewal to eliminate 100% of thundering herd spikes.'
      },
      sandbox: {
        type: 'token_refresh',
        title: 'Cache Stampede Load Simulator',
        description: 'Simulate 500 concurrent threads hitting an expired cache key simultaneously.',
        parameters: { concurrentRequests: 500 },
        metrics: [
          { label: 'Database Concurrent Queries', before: '500 spikes', after: '1 background query', status: 'good' },
          { label: 'P99 Latency', before: '1,840ms', after: '4ms', status: 'good' }
        ]
      }
    };

    onAddIssue(newIssue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                File Issue on ziki.dev/issues
              </h2>
              <p className="text-xs text-slate-400">
                Trigger autonomous agent formulation with Ziki Synapse co-steering
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

        {/* Quick Templates */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/40">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Load Engineering Scenario Template:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadTemplate(tmpl)}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-left text-xs transition-colors"
              >
                <div className="font-semibold text-slate-200 line-clamp-1">{tmpl.title}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{tmpl.repo}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Issue Title:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Memory leak in WebSocket heartbeat listeners on reconnect"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Repository Target:
              </label>
              <input
                type="text"
                required
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Priority Level:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="critical">Critical (Blocking Production)</option>
                <option value="high">High (Major Feature Impaired)</option>
                <option value="medium">Medium (Isolated Edge Case)</option>
                <option value="low">Low (Cosmetic / Minor Polish)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Context, Symptoms &amp; Stack Traces:
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurs, concurrency conditions, and expected invariant..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Ziki Synapse will auto-formulate 2 architectural approaches and in-flight waypoints.</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
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
              <Plus className="w-3.5 h-3.5" />
              File Issue [issue.created]
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
