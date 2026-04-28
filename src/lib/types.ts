export type StrategicIntent =
  | "Growth"
  | "Defense"
  | "Efficiency"
  | "Experiment"
  | "Risk Mitigation";

export type DecisionStatus = "draft" | "active" | "completed" | "archived";
export type AssumptionStatus = "validated" | "pending" | "challenged" | "invalidated";
export type SimulationStatus = "draft" | "running" | "completed";
export type AgentStatus = "active" | "paused" | "reviewing";
export type AgentDecisionScope = "pricing" | "campaigns" | "hiring" | "operations" | "sales" | "security" | "engineering";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type DocumentType = "PDF" | "DOCX" | "PPTX" | "CSV" | "XLSX";
export type ProcessingStatus = "processed" | "processing" | "queued" | "failed";

export interface Decision {
  id: string;
  title: string;
  description: string;
  strategicIntent: StrategicIntent;
  category: string;
  owner: PersonReference;
  status: DecisionStatus;
  dqs: number;
  diw: number;
  assumptionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Assumption {
  id: string;
  text: string;
  impactWeight: 1 | 2 | 3 | 4 | 5;
  status: AssumptionStatus;
  decisionId: string;
  decisionTitle: string;
  owner: string;
  updatedAt: string;
}

export interface Simulation {
  id: string;
  title: string;
  description: string;
  probability: number;
  status: SimulationStatus;
  outcomeCount: number;
  linkedDecisions: number;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationOutcome {
  id: string;
  label: string;
  probability: number;
  impact: "positive" | "negative" | "neutral";
}

export interface AgentRiskBoundaries {
  maxDiscountPercent?: number;
  maxSpendThreshold?: number;
  allowIrreversible: boolean;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: string;
  objective: string;
  status: AgentStatus;
  capabilities: string[];
  decisionScope: AgentDecisionScope[];
  riskBoundaries: AgentRiskBoundaries;
  instructionLayer: string;
  pendingProposals: number;
  // Performance Model
  forecastAccuracy: number;
  dqsScore: number;
  roiContribution: string;
  riskExposure: RiskLevel;
  failureRate: number;
  successRate: number;
  decisionsProcessed: number;
  lastActive: string;
}

export interface AgentProposal {
  id: string;
  agentId: string;
  agentName: string;
  // Structured Decision Object fields
  title: string;
  intent: string;
  description: string;
  assumptions: string[];
  expectedOutcomes: string[];
  riskLevel: RiskLevel;
  confidenceScore: number;
  type: "decision" | "assumption" | "simulation";
  priority: "high" | "medium" | "low";
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  forecastReliability: number;
  lastActive: string;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  processingStatus: ProcessingStatus;
  linkedDecisions: number;
}

export interface ActivityItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  targetType: "decision" | "assumption" | "simulation" | "agent" | "document" | "team";
  timestamp: string;
}

export interface MetricCardData {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down" | "flat";
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface PersonReference {
  name: string;
  type: "human" | "agent";
  avatar?: string;
}

export interface PricingTier {
  name: string;
  price: string;
  annualPrice: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

// ============================================
// New types for design system upgrade
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  company: string;
  workspaceId: string;
  onboardingCompleted: boolean;
}

export interface Session {
  accessToken: string;
  expiresAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  memberCount: number;
  plan: "starter" | "professional" | "enterprise";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "mention" | "update";
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  actor?: {
    name: string;
    avatar: string;
  };
}

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  completed: boolean;
  data: Record<string, unknown>;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  actorAvatar: string;
  resource: string;
  resourceType: "decision" | "assumption" | "simulation" | "agent" | "document" | "team" | "settings" | "auth";
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "crm" | "communication" | "project" | "analytics" | "storage" | "ai";
  status: "connected" | "available" | "coming_soon";
  connectedAt?: string;
}

export interface BillingPlan {
  name: string;
  price: number;
  interval: "monthly" | "annual";
  features: string[];
  usage: {
    decisions: { used: number; limit: number };
    members: { used: number; limit: number };
    storage: { used: number; limit: number; unit: string };
    apiCalls: { used: number; limit: number };
  };
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  downloadUrl: string;
}

export interface UsageMetric {
  label: string;
  data: { date: string; value: number }[];
  total: number;
  change: number;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
  permissions: string[];
}

export interface SecurityEvent {
  id: string;
  type: "login" | "logout" | "password_change" | "2fa_enabled" | "2fa_disabled" | "api_key_created" | "session_revoked";
  description: string;
  ipAddress: string;
  device: string;
  location: string;
  timestamp: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  current: boolean;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export interface CommandPaletteItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  href?: string;
  action?: () => void;
  category: "page" | "action" | "recent";
}

export type MarketingNavItem =
  | { label: string; href: string; children?: never }
  | { label: string; href?: never; children: { label: string; href: string; description?: string }[] };
