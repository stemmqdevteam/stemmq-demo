// ─────────────────────────────────────────────────────────
//  StemmQ — App-Wide Constants
// ─────────────────────────────────────────────────────────

export const APP_NAME = 'StemmQ'
export const APP_DESCRIPTION =
  'Decision Intelligence Infrastructure for forward-thinking organizations.'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://stemmq.com'

// ── Routes ────────────────────────────────────────────────
export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  verify: '/verify',
  authError: '/error',
  authCallback: '/api/auth/callback',
  dashboard: '/dashboard',
  decisions: '/dashboard/decisions',
  newDecision: '/dashboard/decisions/new',
  assumptions: '/dashboard/assumptions',
  simulations: '/dashboard/simulations',
  analytics: '/dashboard/analytics',
  notifications: '/dashboard/notifications',
  settings: '/dashboard/settings',
  billing: '/dashboard/settings/billing',
  onboarding: '/onboarding',
  admin: '/admin',
  enterprise: '/enterprise',
  pricing: '/pricing',
} as const

// ── Pagination defaults ───────────────────────────────────
export const PER_PAGE = 20
export const MAX_PER_PAGE = 100

// ── Limits ───────────────────────────────────────────────
export const LIMITS = {
  FREE_DECISIONS: 10,
  TITLE_MAX: 160,
  DESCRIPTION_MAX: 2000,
  ASSUMPTION_MAX: 500,
  TAGS_MAX: 10,
  TAG_LENGTH_MAX: 30,
  ORG_NAME_MAX: 80,
} as const

// ── Intent labels ─────────────────────────────────────────
export const INTENT_LABELS: Record<string, string> = {
  growth: 'Growth',
  efficiency: 'Efficiency',
  risk: 'Risk',
  experiment: 'Experiment',
  other: 'Other',
}

// ── Status labels ─────────────────────────────────────────
export const DECISION_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  active: 'Active',
  resolved: 'Resolved',
  archived: 'Archived',
}

export const ASSUMPTION_STATUS_LABELS: Record<string, string> = {
  unknown: 'Unresolved',
  correct: 'Correct',
  incorrect: 'Incorrect',
  partially_correct: 'Partially Correct',
}

export const TIME_HORIZON_LABELS: Record<string, string> = {
  days:     'Days (< 1 week)',
  weeks:    'Weeks (1–4 weeks)',
  months:   'Months (1–6 months)',
  quarters: 'Quarters (3–12 months)',
  years:    'Years (1+ years)',
}

export const REVERSIBILITY_LABELS: Record<string, string> = {
  easily_reversible: 'Easily reversible',
  reversible:        'Reversible',
  difficult:         'Difficult to reverse',
  irreversible:      'Irreversible',
}

// ── Plan names ────────────────────────────────────────────
export const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

export const PLAN_PRICES: Record<string, string> = {
  free: '$0',
  pro: '$29',
  enterprise: 'Custom',
}

// ── Navigation ────────────────────────────────────────────
export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: 'LayoutDashboard' },
  { href: '/dashboard/decisions', label: 'Decisions', icon: 'GitBranch' },
  { href: '/dashboard/assumptions', label: 'Assumptions', icon: 'Brain' },
  { href: '/dashboard/simulations', label: 'Simulations', icon: 'FlaskConical', pro: true },
  { href: '/dashboard/analytics', label: 'Analytics', icon: 'BarChart3' },
  { href: '/dashboard/notifications', label: 'Notifications', icon: 'Bell' },
] as const

export const NAV_BOTTOM_ITEMS = [
  { href: '/dashboard/settings', label: 'Settings', icon: 'Settings' },
] as const

// ── Toast durations ───────────────────────────────────────
export const TOAST_DURATION = {
  short: 2500,
  default: 4000,
  long: 7000,
} as const

// ── Query keys (for future React Query integration M2+) ───
export const QUERY_KEYS = {
  decisions: 'decisions',
  decision: (id: string) => ['decisions', id] as const,
  assumptions: (decisionId: string) => ['assumptions', decisionId] as const,
  simulations: 'simulations',
  notifications: 'notifications',
  orgMembers: 'org-members',
  dashboardStats: 'dashboard-stats',
} as const
