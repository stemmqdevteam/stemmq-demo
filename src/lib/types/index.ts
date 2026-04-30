// ─────────────────────────────────────────────────────────
//  StemmQ — Centralised Type Definitions
//  Import from '@/types' throughout the app.
// ─────────────────────────────────────────────────────────

// ── Enums ─────────────────────────────────────────────────
export type PlanType = 'free' | 'pro' | 'enterprise'
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'pending'
export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer'
export type DecisionIntent = 'growth' | 'efficiency' | 'risk' | 'experiment' | 'other'
export type DecisionStatus = 'draft' | 'active' | 'resolved' | 'archived'
export type AssumptionStatus = 'unknown' | 'correct' | 'incorrect' | 'partially_correct'
export type NotificationType = 'info' | 'success' | 'warning' | 'error'
export type NotificationSource =
  | 'decision'
  | 'assumption'
  | 'onboarding'
  | 'system'
  | 'ai'
  | 'billing'
  | 'security'
  | 'team'
// export type SimulationStatus = 'pending' | 'running' | 'completed' | 'failed'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected'
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked'
export type AuditAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'status_changed'
  | 'member_added'
  | 'member_removed'
  | 'plan_changed'
  | 'login'
  | 'logout'
  | 'invited'
  | 'assumption_resolved'

// ── Organization ──────────────────────────────────────────
export interface OrgConfig {
  onboarding_completed:     boolean
  strategy_focus:           string | null   // e.g. 'growth', 'efficiency'
  decision_culture:         string | null   // e.g. 'data_driven', 'consensus'
  risk_profile:             'conservative' | 'moderate' | 'aggressive'
  industry:                 string | null   // e.g. 'Technology'
  size:                     string | null   // e.g. '1-10', '11-50'
  stage:                    string | null   // e.g. 'mvp', 'growth'
  ai_suggestions_enabled:   boolean
  notification_preferences: Record<string, boolean>
}

export interface Organization {
  industry: string
  size: undefined
  stage: undefined
  website: string
  id:         string
  name:       string
  slug:       string
  plan:       PlanType
  config:     OrgConfig
  created_at: string
  updated_at: string
}

// ── User ──────────────────────────────────────────────────
export interface UserProfile {
  id:          string
  full_name:   string | null
  avatar_url:  string | null
  job_title:   string | null
  timezone:    string
  is_admin:    boolean
  preferences: Record<string, unknown>  // UI prefs: theme, notifications, etc.
  created_at:  string
  updated_at:  string
}

export interface OrgMember {
  id: string
  org_id: string
  user_id: string
  role: OrgRole
  joined_at: string
  user_profiles?: UserProfile
}

export interface Invitation {
  id: string
  org_id: string
  invited_by: string
  email: string
  role: OrgRole
  token: string
  status: InvitationStatus
  expires_at: string
  accepted_at: string | null
  created_at: string
}

// ── Subscription ──────────────────────────────────────────
export interface Subscription {
  id: string
  org_id: string
  plan: PlanType
  status: SubscriptionStatus
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  trial_ends_at: string | null
  seats: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

// ── Decision ──────────────────────────────────────────────
export interface ExpectedOutcome {
  id: string
  title: string
  metric?: string
  target_value?: string
  timeframe?: string
}

export interface AiEvaluation {
  summary: string
  strengths: string[]
  risks: string[]
  suggestions: string[]
  confidence: number
  evaluated_at: string
}

export interface Decision {
  id: string
  org_id: string
  created_by: string
  title: string
  description: string | null
  intent: DecisionIntent
  status: DecisionStatus
  category: string | null
  expected_outcomes: ExpectedOutcome[]
  stakeholders: string[]
  alternatives: string[]
  reasoning: string | null
  financial_exposure: number | null
  time_horizon: 'days' | 'weeks' | 'months' | 'quarters' | 'years' | null
  reversibility: 'easily_reversible' | 'reversible' | 'difficult' | 'irreversible' | null
  tags: string[]
  resolved_at: string | null
  resolution_notes: string | null
  quality_score: number | null
  confidence_score: number | null
  ai_evaluated: boolean
  ai_evaluation: AiEvaluation | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // Joined relations (optional)
  assumptions?: Assumption[]
  outcomes?: Outcome[]
  author?: UserProfile
}

// ── Assumption ────────────────────────────────────────────
export interface Assumption {
  id: string
  decision_id: string
  org_id: string
  created_by: string
  content: string
  rationale: string | null
  status: AssumptionStatus
  confidence: number | null
  ai_generated: boolean
  resolved_at: string | null
  resolved_by: string | null
  resolution_note: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

// ── Outcome ───────────────────────────────────────────────
export interface Outcome {
  id: string
  decision_id: string
  org_id: string
  created_by: string
  title: string
  description: string | null
  expected_value: string | null
  actual_value: string | null
  metric_type: string | null
  deviation_pct: number | null
  measured_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// ── Simulation ────────────────────────────────────────────
export interface SimulationResult {
  summary: string
  projected_outcomes: Array<{
    scenario: string
    probability: number
    impact: string
  }>
  key_variables: string[]
  recommendations: string[]
}

export interface RiskIndicator {
  name: string
  level: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

export interface Simulation {
  id: string
  org_id: string
  decision_id: string | null
  created_by: string
  title: string
  scenario: string
  status: SimulationStatus
  parameters: Record<string, unknown>
  results: SimulationResult | null
  probability_range: { min: number; max: number; likely: number } | null
  risk_indicators: RiskIndicator[]
  ai_reasoning: string | null
  error_message: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

// ── Notification ──────────────────────────────────────────
export interface Notification {
  id: string
  user_id: string
  org_id: string | null
  type: NotificationType
  source: NotificationSource
  title: string
  body: string | null
  action_url: string | null
  action_label: string | null
  read: boolean
  read_at: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// ── Audit Log ─────────────────────────────────────────────
export interface AuditLog {
  id: string
  org_id: string | null
  user_id: string | null
  action: AuditAction
  resource_type: string
  resource_id: string | null
  before_state: Record<string, unknown> | null
  after_state: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// ── Enterprise Lead ───────────────────────────────────────
export interface EnterpriseLead {
  id: string
  full_name: string
  email: string
  company: string
  company_size: string | null
  role: string | null
  use_case: string | null
  status: LeadStatus
  notes: string | null
  converted_org_id: string | null
  contacted_at: string | null
  converted_at: string | null
  created_at: string
  updated_at: string
}

// ── Plan Feature Gates ────────────────────────────────────
export interface PlanFeatures {
  max_decisions: number | null
  max_members: number | null
  ai_suggestions: boolean
  simulations: boolean
  document_intelligence: boolean
  agents: boolean
  api_access: boolean
  priority_support: boolean
  sso: boolean
  audit_logs: boolean
  advanced_analytics: boolean
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  free: {
    max_decisions: 10,
    max_members: 1,
    ai_suggestions: false,
    simulations: false,
    document_intelligence: false,
    agents: false,
    api_access: false,
    priority_support: false,
    sso: false,
    audit_logs: false,
    advanced_analytics: false,
  },
  pro: {
    max_decisions: null,
    max_members: 10,
    ai_suggestions: true,
    simulations: true,
    document_intelligence: false,
    agents: false,
    api_access: false,
    priority_support: true,
    sso: false,
    audit_logs: true,
    advanced_analytics: true,
  },
  enterprise: {
    max_decisions: null,
    max_members: null,
    ai_suggestions: true,
    simulations: true,
    document_intelligence: true,
    agents: true,
    api_access: true,
    priority_support: true,
    sso: true,
    audit_logs: true,
    advanced_analytics: true,
  },
}

// ── Dashboard Stats ───────────────────────────────────────
export interface DashboardStats {
  total_decisions: number
  active_decisions: number
  resolved_decisions: number
  avg_quality_score: number | null
  assumption_accuracy: number | null
  pending_assumptions: number
  decisions_this_month: number
}

// ── API Responses ─────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  per_page: number
  total_pages: number
}

// ── Server Action Results ─────────────────────────────────
export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Record<string, string[]>
}

// ── Simulations ───────────────────────────────────────────

export type SimulationType = 'assumption_flip' | 'alternative_decision' | 'risk_scenario'
export type SimulationStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface SimulationVariable {
  id:          string
  label:       string
  description: string
  type:        'boolean' | 'scale' | 'text'
  value:       string | number | boolean
}

export interface SimulationResult {
  confidence:       number       // 0-100
  impact_score:     number       // -100 to +100 (negative = bad)
  key_findings:     string[]
  risk_factors:     string[]
  opportunities:    string[]
  recommendation:   string
  assumption_delta: Record<string, string>  // assumption id → predicted outcome
}

export interface Simulation {
  id:           string
  org_id:       string
  created_by:   string
  decision_id:  string | null
  title:        string
  description:  string | null
  type:         SimulationType
  status:       SimulationStatus
  variables:    SimulationVariable[]
  result:       SimulationResult | null
  created_at:   string
  completed_at: string | null
  decisions?:   { title: string; intent: string; quality_score: number | null } | null
}
