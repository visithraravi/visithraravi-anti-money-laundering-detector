export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type PatternType = 
  | 'NORMAL'
  | 'POSSIBLE_LAYERING'
  | 'RAPID_MOVEMENT'
  | 'CIRCULAR_TRANSFER'
  | 'HIGH_VALUE'
  | 'UNUSUAL_RELATIONSHIP'
  | 'SPLIT_TRANSACTIONS';

export type CaseStatus = 'OPEN' | 'UNDER_REVIEW' | 'ESCALATED' | 'CLOSED' | 'RESOLVED';

export interface Transaction {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  timestamp: string; // ISO string or HH:mm
  date: string;
  risk: RiskLevel;
  pattern: PatternType;
  status: 'SETTLED' | 'FLAGGED' | 'BLOCKED' | 'UNDER_INVESTIGATION';
  category?: string;
  notes?: string;
}

export interface AccountInfo {
  id: string;
  name: string;
  type: 'INDIVIDUAL' | 'SHELL_COMPANY' | 'CORPORATE' | 'EXCHANGE' | 'UNKNOWN';
  risk: RiskLevel;
  ageMonths: number;
  totalInflow: number;
  totalOutflow: number;
  transactionCount: number;
  firstSeen: string;
  lastSeen: string;
  connectedAccounts: string[];
  riskIndicators: string[];
  jurisdiction: string;
  balance: number;
}

export interface EvidenceItem {
  id: string;
  title: string;
  pattern?: PatternType;
  severity: RiskLevel;
  description: string;
  supportingTransactionIds?: string[];
  metrics?: { [key: string]: string | number };
  confidence?: number;
}

export interface InvestigationTimelineStep {
  id?: string;
  time?: string;
  timestamp?: string;
  from?: string;
  to?: string;
  amount?: number;
  txId?: string;
  description: string;
  event?: string;
  actor?: string;
}

export interface CaseAuditNote {
  id: string;
  author: string;
  timestamp: string;
  content: string;
}

export interface InvestigationCase {
  id: string;
  title: string;
  risk: RiskLevel;
  pattern: PatternType;
  amount: number;
  accounts: string[];
  status: CaseStatus;
  createdAt: string;
  primaryAccount: string;
  description: string;
  assignedInvestigator: string;
  evidence: EvidenceItem[];
  timeline: InvestigationTimelineStep[];
  aiSummary?: string;
  recommendedActions?: string[];
  relatedTransactionIds: string[];
  notes?: CaseAuditNote[];
}

export interface AmlSettings {
  highValueThreshold: number; // e.g. 1000000 (10 Lakh)
  rapidMovementWindowMinutes: number; // e.g. 10
  minLayeringHops: number; // e.g. 3
  alertOnCircularFlow: boolean;
  rapidTransferWindowMinutes: number;
  amountMatchingPercentage: number;
  circularTransferDepthHops: number;
  enableAutoSarGeneration: boolean;
  strictShellProfiling: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  read: boolean;
  linkPage?: string;
  entityId?: string;
}

export type PageId = 
  | 'dashboard'
  | 'transactions'
  | 'network'
  | 'cases'
  | 'investigation'
  | 'ai-investigator'
  | 'reports'
  | 'scenarios'
  | 'settings';
