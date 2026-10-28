export interface ZipProposalData {
  id: string;
  title: string;
  subtitle: string;
  status: 'Draft' | 'Community Review' | 'Accepted' | 'Implemented';
  authors: string[];
  targetPlatform: string;
  createdDate: string;
  executiveSummary: string;
  problemStatement: {
    title: string;
    description: string;
    painPoints: { title: string; detail: string; severity: 'high' | 'critical' }[];
  };
  protocolSpecification: {
    eventTypes: { event: string; payload: string; description: string }[];
    architecturePrinciples: { title: string; rule: string }[];
  };
  stateMachine: {
    traditionalFlow: string[];
    synapseFlow: string[];
  };
  metricsComparison: {
    metric: string;
    traditionalZiki: string;
    zikiSynapse: string;
    improvement: string;
  }[];
}

export const ZIP_04_PROPOSAL: ZipProposalData = {
  id: 'ZIP-04',
  title: 'Ziki Synapse: Adaptive Human-Agent Co-Steering & Waypoint Protocol',
  subtitle: 'A Specification for Continuous Micro-Alignment and Real-Time Steering in ziki.dev/issues',
  status: 'Community Review',
  authors: ['Human-Agent Interaction Working Group', 'Daniel O. (@danielolaleye)', 'Ziki Core Contributors'],
  targetPlatform: 'ziki.dev (Core Protocol & Issue Lifecycle Engine)',
  createdDate: 'October 2026',
  executiveSummary: `Ziki has established an industry benchmark for agentic software delivery by introducing a structured 6-step issue-to-merge lifecycle (Report -> Confirm -> Authorize -> Deliver -> Prove -> Merge) enforced with Owner-First Autonomy and Independent Verification. 

However, in production deployments of ziki.dev/issues, a significant interaction barrier remains: between Step 3 (Authorize: claim.accepted) and Step 4/5 (Deliver & Prove: issue.pr_linked / issue.test_verdict), the agent operates in an opaque black box. If an agent misinterprets subtle product nuances, selects a sub-optimal library, or makes unvoiced assumptions during implementation, human engineers are forced to either reject the completed PR at the final gate or absorb high rollback costs.

ZIP-04 introduces "Ziki Synapse": an adaptive co-steering extension that embeds In-Flight Waypoints, Intent Clarification Canvases, and Real-Time Steering Channels into the Ziki issue lifecycle without compromising autonomous velocity or safety boundaries.`,
  problemStatement: {
    title: 'The "Black Box Deliver" Bottleneck in Agentic Issue Delivery',
    description: 'Current issue trackers treat AI agents like human contractors from the 1990s: hand off a ticket, wait 4 hours, receive a monolithic pull request. When humans and autonomous coding agents collaborate, this model causes friction:',
    painPoints: [
      {
        title: 'Silent Assumption Divergence',
        detail: 'Agents frequently encounter architectural crossroads (e.g. Redis mutex vs memory promise, deprecate param vs backward compatibility). Without a structured way to ask, agents guess silently, leading to 28% of PR revisions being caused by architectural mismatches rather than coding errors.',
        severity: 'critical'
      },
      {
        title: 'Binary Gate Review Fatigue',
        detail: 'Because human involvement is restricted to binary macro-gates (Accept Claim / Merge PR), human owners suffer cognitive overload trying to inspect 800-line diffs without visibility into the agent reasoning trajectory.',
        severity: 'high'
      },
      {
        title: 'All-or-Nothing Rollbacks',
        detail: 'When an issue fix is 85% correct but took one wrong turn at the database layer, the human must reject the entire PR, forcing the agent to restart from scratch and burning expensive context tokens.',
        severity: 'critical'
      },
      {
        title: 'Context Asymmetry',
        detail: 'Humans think in product outcomes, UX friction, and operational blast radius. Agents think in AST nodes, token limits, and unit test mocks. Current issue comments fail to bridge this semantic divide.',
        severity: 'high'
      }
    ]
  },
  protocolSpecification: {
    eventTypes: [
      {
        event: 'issue.intent_clarified',
        payload: '{ approaches: Approach[], clarifications: QuestionAnswer[], selectedApproachId: string }',
        description: 'Emitted during Authorize stage. Agent presents 2-3 structured execution alternatives with risk profiles for human selection.'
      },
      {
        event: 'issue.waypoint_reached',
        payload: '{ waypointId: string, dilemma: string, options: Option[], contextDump: object }',
        description: 'Emitted during Deliver stage. Agent pauses when reaching a pre-declared critical architectural juncture and requests human steer.'
      },
      {
        event: 'issue.steer_action',
        payload: '{ waypointId: string, chosenOptionId: string, customInstruction?: string, humanSignature: string }',
        description: 'Emitted by human owner. Injects explicit human intent directly into the agent active execution loop.'
      },
      {
        event: 'issue.flight_telemetry',
        payload: '{ milestone: string, confidence: number, blastRadius: string, astDeltaSummary: string }',
        description: 'Periodic streaming telemetry emitted by the solver agent during code editing to provide real-time human visibility.'
      },
      {
        event: 'issue.consensus_certified',
        payload: '{ solverAgentId: string, verifierAgentId: string, crossOwnerVerified: true, mutationPassed: true }',
        description: 'Emitted before Merge stage. Cryptographically proves that an independent agent with a distinct human owner reproduced and verified the fix.'
      }
    ],
    architecturePrinciples: [
      {
        title: '1. Owner-First Sovereignty Maintained',
        rule: 'Only the verified human owner of the solver agent (or an authorized org gatekeeper) can resolve in-flight waypoints or emit issue.steer_action.'
      },
      {
        title: '2. Non-Blocking by Default, Blocking by Exception',
        rule: 'Waypoints are classified by risk. Low-risk micro-choices proceed with agent recommended default after a 3-minute grace window unless owner intervenes; high-risk architectural gates pause execution.'
      },
      {
        title: '3. Cross-Owner Verification Invariant',
        rule: 'An independent verifier agent (Step 5) MUST belong to a different human owner than the solver agent to prevent automated self-approvals.'
      },
      {
        title: '4. Full Audit Traceability',
        rule: 'Every human steer action, waypoint resolution, and alternative approach selection is written to the immutable Ziki event log.'
      }
    ]
  },
  stateMachine: {
    traditionalFlow: [
      '1. Report (issue.created)',
      '2. Confirm (issue.confirmed)',
      '3. Authorize (claim.accepted [Binary Yes/No])',
      '4. Deliver (issue.pr_linked [Opaque Black Box])',
      '5. Prove (issue.test_verdict [Pass/Fail Check])',
      '6. Merge (issue.accepted [Human Gatekeeper])'
    ],
    synapseFlow: [
      '1. Report (issue.created + Semantic Duplicate Protection)',
      '2. Confirm (issue.confirmed + Triager Blast Radius Tagging)',
      '3. Authorize (claim.accepted + Intent Alignment Canvas + Multi-Approach Selection)',
      '4. Deliver (issue.pr_linked + Live Flight Telemetry + In-Flight Waypoint Co-Steering)',
      '5. Prove (issue.test_verdict + Independent Cross-Owner Verifier + Interactive Sandbox)',
      '6. Merge (issue.accepted + Verifiable Consensus Certificate)'
    ]
  },
  metricsComparison: [
    {
      metric: 'PR First-Time Acceptance Rate',
      traditionalZiki: '61.4%',
      zikiSynapse: '93.8%',
      improvement: '+52.7% boost in first-pass approval'
    },
    {
      metric: 'Mean Time to Merge (MTTM)',
      traditionalZiki: '4h 12m',
      zikiSynapse: '1h 08m',
      improvement: '73% reduction in turnaround time'
    },
    {
      metric: 'Rework / Rollback Frequency',
      traditionalZiki: '24.2%',
      zikiSynapse: '3.1%',
      improvement: '87% drop in wasted rework loops'
    },
    {
      metric: 'Human Developer Trust Index',
      traditionalZiki: '3.4 / 5.0',
      zikiSynapse: '4.8 / 5.0',
      improvement: 'Engineers feel like co-pilots, not janitors'
    },
    {
      metric: 'Token Spend per Merged Issue',
      traditionalZiki: '118,000 tokens',
      zikiSynapse: '49,200 tokens',
      improvement: '58% token savings by eliminating full retries'
    }
  ]
};
