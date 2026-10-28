export type IssueStatus = 
  | 'created' 
  | 'confirmed' 
  | 'authorizing' 
  | 'delivering' 
  | 'proving' 
  | 'ready_merge' 
  | 'merged';

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type BlastRadius = 'isolated' | 'moderate' | 'critical_path';

export interface HumanOwner {
  name: string;
  handle: string;
  avatar: string;
  role: string;
}

export interface AgentActor {
  id: string;
  name: string;
  model: string;
  avatar: string;
  ownerHandle: string;
  reputation: number;
  totalDelivered: number;
  successRate: number;
  role?: string;
  description?: string;
  specialties?: string[];
  autonomyLevel?: 'supervised' | 'balanced' | 'autonomous';
  guardrails?: string[];
  instructions?: string;
  status?: 'idle' | 'working' | 'awaiting_feedback';
}

export interface PlanApproach {
  id: string;
  title: string;
  description: string;
  estimatedTokens: number;
  estimatedMinutes: number;
  breakingRisk: 'none' | 'low' | 'high';
  pros: string[];
  cons: string[];
  selected: boolean;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  agentContext: string;
  options: string[];
  selectedOption?: string;
  humanCustomNote?: string;
}

export interface Waypoint {
  id: string;
  title: string;
  stageName: string;
  status: 'pending' | 'awaiting_human' | 'steered' | 'skipped';
  dilemma: string;
  agentContext: string;
  options: {
    id: string;
    label: string;
    impact: string;
    recommended?: boolean;
  }[];
  chosenOptionId?: string;
  customSteeringNote?: string;
  timestamp?: string;
}

export interface ExecutionLogItem {
  id: string;
  stepNumber: number;
  timestamp: string;
  agent: string;
  type: 'thought' | 'action' | 'waypoint_trigger' | 'steering_received' | 'code_edit' | 'test_run' | 'audit_event';
  message: string;
  details?: string;
  codeSnippet?: string;
  steeredByHuman?: boolean;
}

export interface TestVerdict {
  reproduced: boolean;
  testCasesPassed: number;
  totalTestCases: number;
  coverageDelta: string;
  mutationScore: string;
  verifierAgent: AgentActor;
  independentAuditPassed: boolean;
  notes: string;
}

export interface CodeDiff {
  filename: string;
  oldCode: string;
  newCode: string;
  explanation: string;
}

export interface SandboxSimulation {
  type: 'token_refresh' | 'retry_jitter' | 'websocket_leak' | 'idempotency';
  title: string;
  description: string;
  parameters: { [key: string]: number | boolean | string };
  metrics: { label: string; before: string; after: string; status: 'good' | 'bad' | 'neutral' }[];
}

export interface ZikiIssue {
  id: string;
  title: string;
  description: string;
  repository: string;
  branch: string;
  status: IssueStatus;
  priority: Priority;
  blastRadius: BlastRadius;
  confidenceScore: number;
  createdDate: string;
  tokenSpend: number;
  estTime: string;
  owner: HumanOwner;
  agent: AgentActor;
  independentVerifier: AgentActor;
  traditionalVsSynapseDiff: {
    traditionalIssue: string;
    synapseAdvantage: string;
  };
  planProposal: {
    summary: string;
    approaches: PlanApproach[];
    clarifications: ClarificationQuestion[];
  };
  waypoints: Waypoint[];
  executionLogs: ExecutionLogItem[];
  testVerdict: TestVerdict;
  codeDiff: CodeDiff;
  sandbox: SandboxSimulation;
}
