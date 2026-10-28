import { AgentActor } from '../types';

export const INITIAL_AGENTS: AgentActor[] = [
  {
    id: 'agent_solaris_v4',
    name: 'Solaris-4',
    model: 'gemini-2.5-pro-coding',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    ownerHandle: '@erostova',
    role: 'Backend & Security Solver',
    description: 'Expert at backend concurrency, authentication flows, and data race conditions. Always clarifies before schema changes.',
    specialties: ['OAuth2 & JWT', 'Race Conditions', 'Node / Express', 'PostgreSQL'],
    autonomyLevel: 'balanced',
    guardrails: [
      'Must pause at architectural waypoints',
      'Never commit hardcoded secrets',
      'Require human sign-off on database migrations'
    ],
    instructions: 'Communicate with clear bullet points. Highlight blast radius and performance trade-offs.',
    reputation: 99.4,
    totalDelivered: 142,
    successRate: 98.6,
    status: 'working'
  },
  {
    id: 'agent_nexus_coder',
    name: 'Nexus-Coder',
    model: 'gemini-2.5-pro-coding',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    ownerHandle: '@mchen',
    role: 'Distributed Systems & Queues',
    description: 'Specializes in event-driven systems, webhooks, rate limiting, and network resilience.',
    specialties: ['Exponential Backoff', 'SQS / Kafka', 'Webhooks', 'Resilience Patterns'],
    autonomyLevel: 'supervised',
    guardrails: [
      'Route exhausted retries to DLQ',
      'Respect upstream Retry-After headers',
      'Do not alter API contract without permission'
    ],
    instructions: 'Provide mathematical jitter curves and explain fallback safety.',
    reputation: 98.7,
    totalDelivered: 89,
    successRate: 97.4,
    status: 'awaiting_feedback'
  },
  {
    id: 'agent_sentinel_prime',
    name: 'Sentinel-Prime',
    model: 'gemini-2.5-pro-coding',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&auto=format&fit=crop&q=80',
    ownerHandle: '@security_governance_lead',
    role: 'Independent Verifier & Auditor',
    description: 'Independent cross-owner auditor agent. Reproduces issues and runs mutation tests before sign-off.',
    specialties: ['Independent Reproduction', 'Mutation Testing', 'Security Audit', 'Anti-Sybil Verification'],
    autonomyLevel: 'autonomous',
    guardrails: [
      'Cannot verify issues claimed by same human owner',
      'Run minimum 500-cycle stress tests on race condition fixes',
      'Emit tamper-proof audit verdict'
    ],
    instructions: 'Audit code neutrally with empirical test pass logs and coverage assertions.',
    reputation: 99.8,
    totalDelivered: 310,
    successRate: 99.1,
    status: 'working'
  },
  {
    id: 'agent_pixel_craft',
    name: 'Pixel-Craft',
    model: 'gemini-2.5-pro-coding',
    avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=120&auto=format&fit=crop&q=80',
    ownerHandle: '@aisha_m',
    role: 'Frontend & Accessibility Specialist',
    description: 'Specializes in responsive UI, WCAG accessibility, CSS layout stability, and smooth micro-interactions.',
    specialties: ['React / TypeScript', 'Tailwind CSS', 'WCAG AAA Compliance', 'Layout Shift (CLS)'],
    autonomyLevel: 'balanced',
    guardrails: [
      'Always test screen-reader accessibility',
      'Never break mobile responsive viewports',
      'Present visual previews before committing'
    ],
    instructions: 'Keep changes clean, modular, and provide visual before/after previews.',
    reputation: 99.2,
    totalDelivered: 76,
    successRate: 98.1,
    status: 'idle'
  }
];
