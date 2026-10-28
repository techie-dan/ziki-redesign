import { ZikiIssue } from '../types';

export const INITIAL_ISSUES: ZikiIssue[] = [
  {
    id: 'ZK-2041',
    title: 'OAuth2 refresh loop race condition causing 401s during concurrent bursts',
    description: 'When multiple microservices or frontend tabs concurrently invoke authenticated API calls right as the access token expires (within 10s buffer), duplicate /oauth/token refresh requests race each other. The OAuth provider invalidates the previous refresh token on first use, resulting in subsequent concurrent requests getting 400 invalid_grant and triggering sudden logged-out states.',
    repository: 'auth-gateway / core-oauth',
    branch: 'fix/token-refresh-mutex-zk2041',
    status: 'delivering',
    priority: 'critical',
    blastRadius: 'critical_path',
    confidenceScore: 78,
    createdDate: '2026-10-28 11:20:00 UTC',
    tokenSpend: 42100,
    estTime: '18 mins remaining',
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
      ownerHandle: '@security_governance_lead',
      reputation: 99.8,
      totalDelivered: 310,
      successRate: 99.1
    },
    traditionalVsSynapseDiff: {
      traditionalIssue: 'In traditional Ziki, the agent claimed this issue and silently proceeded into Step 4 (Deliver). It chose a heavyweight Redis distributed lock without consulting Elena, introducing a 35ms latency penalty on all calls.',
      synapseAdvantage: 'With Ziki Synapse Waypoints, Solaris-4 paused mid-flight at Step 4.2 to present an In-Flight Waypoint: Redis Lock vs In-Memory Deduplication Promise. Elena steered it toward In-Memory Promise with single-flight mutex in 1 click, preserving sub-millisecond latency!'
    },
    planProposal: {
      summary: 'Deduplicate inflight token refresh promises across concurrent callers while maintaining fallback renewal buffers.',
      approaches: [
        {
          id: 'app_1',
          title: 'Single-Flight In-Memory Promise Deduplication (Recommended)',
          description: 'Share a single active Promise instance across all concurrent callers on the same instance. Subsequent callers await the existing promise rather than firing new network requests.',
          estimatedTokens: 38000,
          estimatedMinutes: 15,
          breakingRisk: 'none',
          pros: ['Zero external dependency latency', 'Eliminates 100% of local race conditions', 'Simple fallback handling'],
          cons: ['Multi-node bursts still rely on OAuth provider rotation grace period'],
          selected: true
        },
        {
          id: 'app_2',
          title: 'Distributed Redis Mutex Lock with Lease Expiry',
          description: 'Acquire a distributed lock via Redlock before calling /oauth/token. Other worker pods block and poll until the key is updated.',
          estimatedTokens: 62000,
          estimatedMinutes: 35,
          breakingRisk: 'low',
          pros: ['Guarantees exactly one node calls OAuth endpoint across cluster'],
          cons: ['Adds 20-40ms Redis round-trip latency', 'Failure modes if Redis node partitions'],
          selected: false
        }
      ],
      clarifications: [
        {
          id: 'clar_1',
          question: 'Should we introduce a 15-second grace buffer before absolute JWT expiration?',
          agentContext: 'Some upstream OAuth providers reject tokens 5 seconds before exp due to clock skew.',
          options: ['Yes, set buffer to 15s (standard)', 'Keep at current 5s', 'Make buffer dynamically configurable via env'],
          selectedOption: 'Yes, set buffer to 15s (standard)'
        }
      ]
    },
    waypoints: [
      {
        id: 'wp_1',
        title: 'Concurrency Primitive Selection: Memory Promise vs Distributed Redis Lock',
        stageName: 'Deliver (Step 4.2: Architectural Micro-Gate)',
        status: 'awaiting_human',
        dilemma: 'I discovered that our cluster runs 4 gateway replicas. An in-memory deduplication promise handles 99.2% of burst concurrency per pod with 0ms overhead, whereas Redis Distributed Lock handles cross-replica concurrency but introduces external I/O and timeout hazards.',
        agentContext: 'Static analysis shows auth-gateway already uses in-memory LRU for tokens. A single-flight promise pattern fits perfectly without modifying docker-compose or helm charts.',
        options: [
          {
            id: 'opt_promise',
            label: 'Adopt Single-Flight In-Memory Promise (Sub-millisecond, Zero infra change)',
            impact: 'Zero extra latency, clean node isolation, handles client tab bursts immediately.',
            recommended: true
          },
          {
            id: 'opt_redis',
            label: 'Implement Distributed Redis Lock with Redlock',
            impact: 'Guarantees single cluster-wide execution but adds Redis dependency & 35ms latency overhead.',
            recommended: false
          },
          {
            id: 'opt_hybrid',
            label: 'Hybrid: In-memory Single-Flight + 5s OAuth Grace Window',
            impact: 'Combines memory deduplication with server-side grace window tolerance.',
            recommended: false
          }
        ],
        chosenOptionId: undefined,
        customSteeringNote: ''
      },
      {
        id: 'wp_2',
        title: 'Error Escalation Strategy when Refresh Fails',
        stageName: 'Deliver (Step 4.4: Failure Handling)',
        status: 'pending',
        dilemma: 'If the single refresh request fails with a network 503, should awaiting callers immediately fail or retry with exponential backoff?',
        agentContext: 'Immediate failure causes 20 concurrent user requests to drop instantly. Backoff retries could stall UI threads.',
        options: [
          {
            id: 'opt_retry',
            label: 'Retry once with 250ms jitter before failing all awaiting callers',
            impact: 'Prevents transient blips from logging user out.',
            recommended: true
          },
          {
            id: 'opt_fail_fast',
            label: 'Fail fast and broadcast SessionExpiredEvent',
            impact: 'Predictable quick failure, forces clean re-authentication.',
            recommended: false
          }
        ]
      }
    ],
    executionLogs: [
      {
        id: 'log_1',
        stepNumber: 1,
        timestamp: '11:20:05 UTC',
        agent: 'agent_solaris_v4',
        type: 'audit_event',
        message: 'Event [issue.created]: Ingested issue context and stack traces from Sentry #89012.'
      },
      {
        id: 'log_2',
        stepNumber: 2,
        timestamp: '11:20:12 UTC',
        agent: 'agent_triager_3',
        type: 'audit_event',
        message: 'Event [issue.confirmed]: Verified duplicate protection; no open tickets match OAuth2 burst race.'
      },
      {
        id: 'log_3',
        stepNumber: 3,
        timestamp: '11:21:00 UTC',
        agent: 'agent_solaris_v4',
        type: 'thought',
        message: 'Synthesized plan proposal with 2 architectural variants. Requested owner authorization from @erostova.'
      },
      {
        id: 'log_4',
        stepNumber: 4,
        timestamp: '11:22:30 UTC',
        agent: 'Elena Rostova (Owner)',
        type: 'steering_received',
        message: 'Owner @erostova accepted claim [claim.accepted]. Autonomy level: Steered-Flight enabled.',
        steeredByHuman: true
      },
      {
        id: 'log_5',
        stepNumber: 5,
        timestamp: '11:24:10 UTC',
        agent: 'agent_solaris_v4',
        type: 'action',
        message: 'Reproduced failure locally: 10 concurrent requests at T=0 resulted in 10 POST /oauth/token calls and 9 invalid_grant errors.'
      },
      {
        id: 'log_6',
        stepNumber: 6,
        timestamp: '11:25:40 UTC',
        agent: 'agent_solaris_v4',
        type: 'waypoint_trigger',
        message: 'WAYPOINT TRIGGERED: Discovered architectural branch between In-Memory Single-Flight vs Redis Mutex. Halting execution for human steer.'
      }
    ],
    testVerdict: {
      reproduced: true,
      testCasesPassed: 14,
      totalTestCases: 14,
      coverageDelta: '+4.2% unit, +100% concurrency stress',
      mutationScore: '96.2%',
      verifierAgent: {
        id: 'agent_sentinel_prime',
        name: 'Sentinel-Prime (Verifier)',
        model: 'gemini-2.5-pro-coding',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&auto=format&fit=crop&q=80',
        ownerHandle: '@security_governance_lead',
        reputation: 99.8,
        totalDelivered: 310,
        successRate: 99.1
      },
      independentAuditPassed: true,
      notes: 'Independent reproduction suite confirmed: Burst of 50 concurrent requests cleanly collapsed into exactly 1 refresh call. All 50 resolved with fresh JWT.'
    },
    codeDiff: {
      filename: 'src/auth/tokenManager.ts',
      oldCode: `export async function getValidAccessToken(): Promise<string> {
  const token = currentToken();
  if (token && !isExpiring(token)) {
    return token.accessToken;
  }
  // BUG: Multiple concurrent callers execute this block simultaneously!
  const refreshed = await api.post('/oauth/token', {
    grant_type: 'refresh_token',
    refresh_token: token.refreshToken,
  });
  saveToken(refreshed);
  return refreshed.accessToken;
}`,
      newCode: `// Ziki Synapse Co-Steered Fix (Single-Flight Promise deduplication)
let activeRefreshPromise: Promise<string> | null = null;

export async function getValidAccessToken(): Promise<string> {
  const token = currentToken();
  if (token && !isExpiring(token, 15 /* 15s human-steered grace buffer */)) {
    return token.accessToken;
  }

  // Deduplicate inflight refresh requests
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      const refreshed = await api.post('/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      });
      saveToken(refreshed);
      return refreshed.accessToken;
    } finally {
      // Clear mutex on resolution or error
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}`,
      explanation: 'Replaced uncontrolled parallel requests with an in-memory single-flight promise. Any request arriving while a refresh is in-flight attaches to the ongoing promise instead of generating a duplicate HTTP call.'
    },
    sandbox: {
      type: 'token_refresh',
      title: 'Token Refresh Race Condition Simulator',
      description: 'Simulate 20 concurrent requests hitting an expiring token to inspect HTTP network calls and 401 logout events before vs after the Synapse co-steered fix.',
      parameters: {
        concurrentRequests: 20,
        networkLatencyMs: 120,
        enableSingleFlight: true,
        expiryBufferSec: 15
      },
      metrics: [
        { label: 'Outbound /oauth/token calls', before: '20 calls', after: '1 call', status: 'good' },
        { label: 'Failed 401 invalid_grant', before: '19 errors (95%)', after: '0 errors (0%)', status: 'good' },
        { label: 'Average Request Delay', before: '420ms (cascading)', after: '122ms', status: 'good' }
      ]
    }
  },
  {
    id: 'ZK-2038',
    title: 'Exponential backoff retry with full jitter for rate-limited webhooks',
    description: 'Outbound webhook dispatcher crashes or triggers thundering herds against partner endpoints (e.g. Stripe, Shopify) when receiving HTTP 429 Too Many Requests. Current retry logic uses fixed 500ms intervals, causing synchronized stampedes.',
    repository: 'event-bus / webhook-dispatcher',
    branch: 'feat/webhook-jitter-backoff-zk2038',
    status: 'authorizing',
    priority: 'high',
    blastRadius: 'moderate',
    confidenceScore: 89,
    createdDate: '2026-10-28 09:45:00 UTC',
    tokenSpend: 18500,
    estTime: 'Waiting for Owner Authorization',
    owner: {
      name: 'Marcus Chen',
      handle: '@mchen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      role: 'Principal Backend Architect'
    },
    agent: {
      id: 'agent_nexus_coder',
      name: 'Nexus-Coder (Solver)',
      model: 'gemini-2.5-pro-coding',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      ownerHandle: '@mchen',
      reputation: 98.7,
      totalDelivered: 89,
      successRate: 97.4
    },
    independentVerifier: {
      id: 'agent_sentinel_prime',
      name: 'Sentinel-Prime (Verifier)',
      model: 'gemini-2.5-pro-coding',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&auto=format&fit=crop&q=80',
      ownerHandle: '@security_governance_lead',
      reputation: 99.8,
      totalDelivered: 310,
      successRate: 99.1
    },
    traditionalVsSynapseDiff: {
      traditionalIssue: 'Traditional Ziki presents only 1 binary claim button: "Accept Claim". Marcus cannot tune the backoff ceiling or specify retry-after header precedence without writing long markdown comments and rejecting the claim.',
      synapseAdvantage: 'Ziki Synapse introduces the "Intent & Plan Alignment Canvas". Marcus can directly toggle between Full Jitter vs Decorrelated Jitter and confirm HTTP Retry-After header parsing before the agent touches a single line of code.'
    },
    planProposal: {
      summary: 'Replace static intervals with decorrelated full jitter and respect upstream Retry-After headers.',
      approaches: [
        {
          id: 'app_jitter_full',
          title: 'Full Jitter Exponential Backoff (AWS Recommendation)',
          description: 'Sleep duration = random_between(0, min(cap, base * 2 ^ attempt)). Maximum spread minimizes synchronized retries.',
          estimatedTokens: 24000,
          estimatedMinutes: 12,
          breakingRisk: 'none',
          pros: ['Lowest collision rate under high concurrency', 'Respects rate limiter windows cleanly'],
          cons: ['Slightly higher variance in delivery time'],
          selected: true
        },
        {
          id: 'app_jitter_equal',
          title: 'Equal Jitter (Half constant, half random)',
          description: 'Sleep duration = (base * 2 ^ attempt) / 2 + random_between(0, (base * 2 ^ attempt) / 2). Guarantees a minimum sleep floor.',
          estimatedTokens: 21000,
          estimatedMinutes: 10,
          breakingRisk: 'none',
          pros: ['More predictable minimum backoff floor'],
          cons: ['Slightly higher risk of cluster synchronicity than full jitter'],
          selected: false
        }
      ],
      clarifications: [
        {
          id: 'clar_retry_after',
          question: 'How should the dispatcher treat upstream Retry-After headers?',
          agentContext: 'Standard HTTP 429 response can provide Retry-After in seconds or HTTP-Date.',
          options: ['Prioritize Retry-After header if present, fallback to exponential jitter', 'Ignore Retry-After to prevent partner from starving queue', 'Enforce a maximum ceiling of 60s regardless of header'],
          selectedOption: 'Prioritize Retry-After header if present, fallback to exponential jitter'
        }
      ]
    },
    waypoints: [
      {
        id: 'wp_jitter_1',
        title: 'Max Retries vs Dead-Letter Queue Routing',
        stageName: 'Deliver (Step 4.1)',
        status: 'pending',
        dilemma: 'Should exhausted retries be dropped with a warning or pushed to our Amazon SQS Dead-Letter-Queue (DLQ)?',
        agentContext: 'Routing to DLQ requires importing the DLQ producer module.',
        options: [
          {
            id: 'opt_dlq',
            label: 'Route to DLQ after 5 attempts',
            impact: 'Zero data loss; operators can replay failed webhooks manually.',
            recommended: true
          },
          {
            id: 'opt_drop',
            label: 'Drop event after 5 attempts and log alert',
            impact: 'Simpler implementation, no queue dependency.',
            recommended: false
          }
        ]
      }
    ],
    executionLogs: [
      {
        id: 'log_j1',
        stepNumber: 1,
        timestamp: '09:45:10 UTC',
        agent: 'agent_nexus_coder',
        type: 'audit_event',
        message: 'Event [issue.created]: Parsed webhook failure spikes from Datadog alert #4992.'
      },
      {
        id: 'log_j2',
        stepNumber: 2,
        timestamp: '09:46:00 UTC',
        agent: 'agent_triager_1',
        type: 'audit_event',
        message: 'Event [issue.confirmed]: Verified no duplicate retry patches exist.'
      },
      {
        id: 'log_j3',
        stepNumber: 3,
        timestamp: '09:47:30 UTC',
        agent: 'agent_nexus_coder',
        type: 'thought',
        message: 'Plan proposed with AWS Full Jitter calculation and Retry-After support. Awaiting owner signoff.'
      }
    ],
    testVerdict: {
      reproduced: true,
      testCasesPassed: 18,
      totalTestCases: 18,
      coverageDelta: '+6.1%',
      mutationScore: '98.0%',
      verifierAgent: {
        id: 'agent_sentinel_prime',
        name: 'Sentinel-Prime (Verifier)',
        model: 'gemini-2.5-pro-coding',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&auto=format&fit=crop&q=80',
        ownerHandle: '@security_governance_lead',
        reputation: 99.8,
        totalDelivered: 310,
        successRate: 99.1
      },
      independentAuditPassed: true,
      notes: 'Monte Carlo simulation of 10,000 retry events showed 0% spike synchronization across 50 simulated partner endpoints.'
    },
    codeDiff: {
      filename: 'src/dispatcher/backoff.ts',
      oldCode: `export async function retryWithFixedDelay(fn: () => Promise<void>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      // Fixed delay stamps partner APIs synchronously!
      await new Promise(r => setTimeout(r, 500));
    }
  }
}`,
      newCode: `export function calculateJitterDelay(attempt: number, baseMs = 100, capMs = 10000, retryAfterHeader?: string): number {
  if (retryAfterHeader) {
    const parsed = parseInt(retryAfterHeader, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return Math.min(parsed * 1000, capMs);
    }
  }
  // AWS Full Jitter: Uniform random between 0 and min(cap, base * 2^attempt)
  const temp = Math.min(capMs, baseMs * Math.pow(2, attempt));
  return Math.floor(Math.random() * temp);
}`,
      explanation: 'Introduced full decorrelated jitter calculation with Retry-After header awareness to dismantle thundering herds.'
    },
    sandbox: {
      type: 'retry_jitter',
      title: 'Thundering Herd vs Full Jitter Simulator',
      description: 'Simulate 100 concurrent webhook workers getting 429 rate-limited at time T=0 to visualize the retry distribution wave.',
      parameters: {
        concurrentWorkers: 100,
        baseBackoffMs: 100,
        maxRetries: 4
      },
      metrics: [
        { label: 'Peak Request Spike per Second', before: '100 req/sec', after: '12 req/sec', status: 'good' },
        { label: 'Partner Rate Limit Cleared Rate', before: '18%', after: '99.4%', status: 'good' },
        { label: 'Total Retry Time Span', before: '1.5s (dense collisions)', after: '8.2s (smooth curve)', status: 'good' }
      ]
    }
  },
  {
    id: 'ZK-2029',
    title: 'Memory leak in WebSocket heartbeat ping listener on reconnect cascades',
    description: 'Clients on unstable connections trigger reconnect loops. The websocket client attaches a new "ping" and "pong" event listener on each reconnect attempt without calling removeAllListeners or unbinding previous abort signals, consuming 120MB heap per hour.',
    repository: 'realtime-sync / websocket-client',
    branch: 'fix/ws-listener-cleanup-zk2029',
    status: 'proving',
    priority: 'medium',
    blastRadius: 'isolated',
    confidenceScore: 94,
    createdDate: '2026-10-28 07:15:00 UTC',
    tokenSpend: 31200,
    estTime: 'Verifying with Independent Tester',
    owner: {
      name: 'Aisha Al-Mansoor',
      handle: '@aisha_m',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      role: 'Staff Frontend Engineer'
    },
    agent: {
      id: 'agent_solaris_v4',
      name: 'Solaris-4 (Solver)',
      model: 'gemini-2.5-pro-coding',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      ownerHandle: '@aisha_m',
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
      traditionalIssue: 'Traditional Ziki Step 5 (Prove) shows only a green checkmark or exit code 0. Humans do not see the mutation test suite or heap profile assertion.',
      synapseAdvantage: 'Ziki Synapse displays an interactive Independent Verifier Dashboard with memory heap snapshots before and after 500 reconnect cycles.'
    },
    planProposal: {
      summary: 'Bind heartbeat listeners using modern AbortController signals to guarantee automated teardown on disconnection.',
      approaches: [
        {
          id: 'app_abort_controller',
          title: 'AbortController Signal Cleanup (Modern Standard)',
          description: 'Pass { signal: this.abortController.signal } to addEventListener. Calling abort() cleans all handlers instantaneously.',
          estimatedTokens: 18000,
          estimatedMinutes: 8,
          breakingRisk: 'none',
          pros: ['Zero risk of orphaned listeners', 'Declarative teardown semantics'],
          cons: ['Requires modern browser or Node 16+'],
          selected: true
        }
      ],
      clarifications: []
    },
    waypoints: [
      {
        id: 'wp_ws_1',
        title: 'AbortController vs Explicit removeEventListener Registry',
        stageName: 'Deliver (Step 4.2)',
        status: 'steered',
        dilemma: 'Should we support legacy Node 14 environments without AbortController?',
        agentContext: 'Our package.json engines specifies node >= 18.0.0.',
        options: [
          {
            id: 'opt_abort',
            label: 'Use native AbortController (Cleanest, lowest memory footprint)',
            impact: 'Zero extra dependencies, modern standard.',
            recommended: true
          }
        ],
        chosenOptionId: 'opt_abort',
        customSteeringNote: 'Go ahead with native AbortController, Node 14 is fully deprecated in our fleet.',
        timestamp: '08:02:11 UTC'
      }
    ],
    executionLogs: [
      {
        id: 'log_ws1',
        stepNumber: 1,
        timestamp: '07:15:10 UTC',
        agent: 'agent_solaris_v4',
        type: 'audit_event',
        message: 'Event [issue.created]: Leak reported via Chrome DevTools Memory Heap Snapshot.'
      },
      {
        id: 'log_ws2',
        stepNumber: 2,
        timestamp: '07:16:00 UTC',
        agent: 'agent_triager_3',
        type: 'audit_event',
        message: 'Event [issue.confirmed]: Triaged as isolated memory leak.'
      },
      {
        id: 'log_ws3',
        stepNumber: 3,
        timestamp: '07:20:00 UTC',
        agent: 'Aisha Al-Mansoor (Owner)',
        type: 'steering_received',
        message: 'Event [claim.accepted]: Authorized agent Solaris-4 to proceed.'
      },
      {
        id: 'log_ws4',
        stepNumber: 4,
        timestamp: '08:02:11 UTC',
        agent: 'Aisha Al-Mansoor (Owner)',
        type: 'steering_received',
        message: 'Human Steered Waypoint: Enforced native AbortController.',
        steeredByHuman: true
      },
      {
        id: 'log_ws5',
        stepNumber: 5,
        timestamp: '08:14:00 UTC',
        agent: 'agent_solaris_v4',
        type: 'code_edit',
        message: 'Linked PR #412 [issue.pr_linked]. Handed off to Sentinel-Prime for independent verification.'
      },
      {
        id: 'log_ws6',
        stepNumber: 6,
        timestamp: '08:18:20 UTC',
        agent: 'agent_sentinel_prime (Verifier)',
        type: 'test_run',
        message: 'Simulated 500 socket disconnects. Heap stabilized at 14.2MB (down from 148.6MB).'
      }
    ],
    testVerdict: {
      reproduced: true,
      testCasesPassed: 22,
      totalTestCases: 22,
      coverageDelta: '+3.8%',
      mutationScore: '99.1%',
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
      notes: 'Passed 500-cycle stress test. Final heap retention is 0KB across 500 re-connections.'
    },
    codeDiff: {
      filename: 'src/client/wsClient.ts',
      oldCode: `connect() {
  this.socket = new WebSocket(this.url);
  // BUG: Leaks on reconnect!
  this.socket.addEventListener('message', this.handlePing);
}`,
      newCode: `connect() {
  this.disconnect(); // Abort previous controller
  this.abortCtrl = new AbortController();
  const { signal } = this.abortCtrl;

  this.socket = new WebSocket(this.url);
  this.socket.addEventListener('message', this.handlePing, { signal });
  this.socket.addEventListener('close', () => this.disconnect(), { signal });
}

disconnect() {
  if (this.abortCtrl) {
    this.abortCtrl.abort();
    this.abortCtrl = null;
  }
  if (this.socket) {
    this.socket.close();
    this.socket = null;
  }
}`,
      explanation: 'Introduced explicit AbortController lifecycle hook to tear down all WebSocket ping/pong and message event listeners simultaneously on disconnection.'
    },
    sandbox: {
      type: 'websocket_leak',
      title: 'WebSocket Reconnect Heap Simulator',
      description: 'Simulate repeated connection drops to compare memory accumulation before vs after the cleanup fix.',
      parameters: {
        reconnectCycles: 50,
        dropIntervalMs: 50
      },
      metrics: [
        { label: 'Active Event Listeners in Memory', before: '100 listeners', after: '2 listeners', status: 'good' },
        { label: 'Heap Growth Rate', before: '+2.4 MB / min', after: '0.0 MB / min (flat)', status: 'good' },
        { label: 'Garbage Collection Frequency', before: 'Spiking every 8s', after: 'Normal idle', status: 'good' }
      ]
    }
  },
  {
    id: 'ZK-2015',
    title: 'Atomic idempotency key lock in distributed billing worker',
    description: 'When webhook retries fire for invoice.payment_succeeded within milliseconds of each other, race conditions in database transaction isolation level (Read Committed) allow double-credit allocation for corporate subscriptions.',
    repository: 'billing-engine / stripe-processor',
    branch: 'fix/idempotency-key-atomic-zk2015',
    status: 'ready_merge',
    priority: 'critical',
    blastRadius: 'critical_path',
    confidenceScore: 98,
    createdDate: '2026-10-27 16:30:00 UTC',
    tokenSpend: 48900,
    estTime: 'Ready for Human Gatekeeper Merge',
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
      ownerHandle: '@finance_systems_lead',
      reputation: 99.8,
      totalDelivered: 310,
      successRate: 99.1
    },
    traditionalVsSynapseDiff: {
      traditionalIssue: 'Traditional Ziki gatekeeper is forced to read raw Git diffs without knowing if the independent verifier checked double-spend race scenarios.',
      synapseAdvantage: 'Ziki Synapse presents a Verifiable Consensus Certificate with atomic proof of non-repudiation and independent auditor sign-off.'
    },
    planProposal: {
      summary: 'PostgreSQL INSERT ... ON CONFLICT DO NOTHING with RETURNING id to create atomic row-level reservation.',
      approaches: [
        {
          id: 'app_atomic_insert',
          title: 'PostgreSQL Atomic Reservation via ON CONFLICT DO NOTHING',
          description: 'Leverage database unique constraint index on idempotency_key to lock at row level in single query.',
          estimatedTokens: 32000,
          estimatedMinutes: 14,
          breakingRisk: 'none',
          pros: ['ACID guaranteed', 'No distributed lock manager needed', 'Zero duplicate payments possible'],
          cons: ['Requires unique index on idempotency_key'],
          selected: true
        }
      ],
      clarifications: []
    },
    waypoints: [
      {
        id: 'wp_bill_1',
        title: 'Lock Expiration vs Permanent Idempotency Ledger',
        stageName: 'Deliver (Step 4.3)',
        status: 'steered',
        dilemma: 'Should idempotency keys expire after 24 hours or be retained forever in the billing audit log?',
        agentContext: 'Financial regulations require 7-year auditability of credit operations.',
        options: [
          {
            id: 'opt_permanent',
            label: 'Retain permanently in partitioned audit table',
            impact: 'Meets SOC2 and financial compliance requirements.',
            recommended: true
          }
        ],
        chosenOptionId: 'opt_permanent',
        customSteeringNote: 'Compliance requires permanent retention. Partition table by year.',
        timestamp: '17:10:04 UTC'
      }
    ],
    executionLogs: [
      {
        id: 'log_b1',
        stepNumber: 1,
        timestamp: '16:30:00 UTC',
        agent: 'agent_solaris_v4',
        type: 'audit_event',
        message: 'Event [issue.created]: Ingested Sentry duplicate payment audit incident #7721.'
      },
      {
        id: 'log_b2',
        stepNumber: 2,
        timestamp: '16:32:00 UTC',
        agent: 'agent_triager_3',
        type: 'audit_event',
        message: 'Event [issue.confirmed]: Confirmed critical financial blast radius.'
      },
      {
        id: 'log_b3',
        stepNumber: 3,
        timestamp: '16:40:00 UTC',
        agent: 'Elena Rostova (Owner)',
        type: 'steering_received',
        message: 'Event [claim.accepted]: Authorized claim with permanent audit partition constraint.'
      },
      {
        id: 'log_b4',
        stepNumber: 4,
        timestamp: '17:25:00 UTC',
        agent: 'agent_solaris_v4',
        type: 'code_edit',
        message: 'Event [issue.pr_linked]: Linked PR #941 with atomic row-level reservation.'
      },
      {
        id: 'log_b5',
        stepNumber: 5,
        timestamp: '17:42:00 UTC',
        agent: 'agent_sentinel_prime (Verifier)',
        type: 'test_run',
        message: 'Event [issue.test_verdict]: Ran 1,000 concurrent credit workers. Exactly 1 succeeded, 999 rejected with DuplicateTransactionException. 0 double credits.'
      }
    ],
    testVerdict: {
      reproduced: true,
      testCasesPassed: 30,
      totalTestCases: 30,
      coverageDelta: '+5.4%',
      mutationScore: '100%',
      verifierAgent: {
        id: 'agent_sentinel_prime',
        name: 'Sentinel-Prime (Verifier)',
        model: 'gemini-2.5-pro-coding',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&auto=format&fit=crop&q=80',
        ownerHandle: '@finance_systems_lead',
        reputation: 99.8,
        totalDelivered: 310,
        successRate: 99.1
      },
      independentAuditPassed: true,
      notes: 'Consensus verified by Sentinel-Prime. Cross-owner rule strictly honored: Verifier owner is @finance_systems_lead, Solver owner is @erostova. Anti-collusion check: PASSED.'
    },
    codeDiff: {
      filename: 'src/billing/creditAllocator.ts',
      oldCode: `export async function processPayment(paymentEvent: PaymentEvent) {
  // Vulnerable: Check-then-act race condition!
  const existing = await db.query('SELECT id FROM idempotency_keys WHERE key = $1', [paymentEvent.id]);
  if (existing.rows.length > 0) return { duplicate: true };

  await db.query('INSERT INTO idempotency_keys (key) VALUES ($1)', [paymentEvent.id]);
  await creditUserAccount(paymentEvent.userId, paymentEvent.amount);
}`,
      newCode: `export async function processPayment(paymentEvent: PaymentEvent) {
  // Ziki Synapse Atomic Reservation:
  const res = await db.query(
    'INSERT INTO idempotency_keys (key, user_id, amount, created_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (key) DO NOTHING RETURNING id',
    [paymentEvent.id, paymentEvent.userId, paymentEvent.amount]
  );

  // If no row returned, another concurrent worker won the race
  if (res.rowCount === 0) {
    logger.warn('Duplicate webhook event detected and safely dropped', { key: paymentEvent.id });
    return { duplicate: true, credited: false };
  }

  await creditUserAccount(paymentEvent.userId, paymentEvent.amount);
  return { duplicate: false, credited: true };
}`,
      explanation: 'Replaced non-atomic select-then-insert pattern with atomic PostgreSQL ON CONFLICT DO NOTHING RETURNING id to mathematically prevent double credits.'
    },
    sandbox: {
      type: 'idempotency',
      title: 'Atomic Double-Spend Simulator',
      description: 'Simulate 50 parallel webhook deliveries of the same invoice event to observe if double-crediting occurs.',
      parameters: {
        parallelWebhooks: 50,
        creditAmount: 500
      },
      metrics: [
        { label: 'Total Credits Applied to Balance', before: '$2,500 (5x over-credited!)', after: '$500 (exactly once)', status: 'good' },
        { label: 'Atomic Constraint Rejections', before: '0 (silent corruption)', after: '49 duplicate drops', status: 'good' },
        { label: 'Audit Log Integrity', before: 'Corrupted state', after: 'Cryptographically consistent', status: 'good' }
      ]
    }
  }
];
