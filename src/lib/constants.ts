import type { NavItem, PricingTier, FeatureItem, MarketingNavItem } from "./types";

export const ROUTES = {
  home: "/",
  product: "/product",
  features: "/features",
  pricing: "/pricing",
  about: "/about",
  aiAgents: "/ai-agents",
  decisionIntelligence: "/decision-intelligence",
  useCases: "/use-cases",
  marketingIntegrations: "/integrations",
  marketingSecurity: "/security",
  blog: "/blog",
  docs: "/docs",
  changelog: "/changelog",
  careers: "/careers",
  auth: "/auth",
  login: "/login",
  signup: "/signup",
  oauth: "/oauth",
  privacy: "/privacy",
  terms: "/terms",
  dashboard: "/dashboard",
  decisions: "/dashboard/decisions",
  assumptions: "/dashboard/assumptions",
  simulations: "/dashboard/simulations",
  agents: "/dashboard/agents",
  strategyGraph: "/dashboard/strategy-graph",
  documents: "/dashboard/documents",
  analytics: "/dashboard/analytics",
  team: "/dashboard/team",
  settings: "/dashboard/settings",
  notifications: "/dashboard/notifications",
  integrations: "/dashboard/integrations",
  auditLogs: "/dashboard/audit-logs",
  billing: "/dashboard/billing",
  usage: "/dashboard/usage",
  apiKeys: "/dashboard/api-keys",
  security: "/dashboard/security",
  activity: "/dashboard/activity",
  onboarding: "/auth/onboarding",
  // Admin routes
  admin: "/admin",
  adminUsers: "/admin/users",
  adminOrganizations: "/admin/organizations",
  adminSubscriptions: "/admin/subscriptions",
  adminLeads: "/admin/enterprise-leads",
  adminAuditLogs: "/admin/audit-logs",
} as const;

export const MARKETING_NAV: MarketingNavItem[] = [
  { label: "Product", href: ROUTES.product },
  {
    label: "Solutions",
    children: [
      { label: "Decision Intelligence", href: ROUTES.decisionIntelligence, description: "Structured decision objects, quality scoring, and outcome tracking" },
      { label: "AI Agents", href: ROUTES.aiAgents, description: "Create and govern AI agents that operate as decision-making systems" },
      { label: "Use Cases", href: ROUTES.useCases, description: "See how teams across every function use StemmQ" },
    ],
  },
  // {
  //   label: "Developers",
  //   children: [
  //     { label: "Documentation", href: ROUTES.docs, description: "Guides, API reference, and SDKs" },
  //     { label: "Integrations", href: ROUTES.marketingIntegrations, description: "Connect StemmQ to your existing stack" },
  //     { label: "Changelog", href: ROUTES.changelog, description: "Latest updates and product releases" },
  //   ],
  // },
  {
    label: "Company",
    children: [
      { label: "About", href: ROUTES.about, description: "Our mission, team, and story" },
      { label: "Blog", href: ROUTES.blog, description: "Insights on decision intelligence and AI governance" },
      { label: "Careers", href: ROUTES.careers, description: "Join us in building decision infrastructure" },
      { label: "Security", href: ROUTES.marketingSecurity, description: "Enterprise-grade security and compliance" },
    ],
  },
  { label: "Pricing", href: ROUTES.pricing },
];

export const SIDEBAR_NAV: NavItem[] = [
  { label: "Overview", href: ROUTES.dashboard, icon: "LayoutDashboard" },
  { label: "Decisions", href: ROUTES.decisions, icon: "GitBranch", badge: 12 },
  { label: "Assumptions", href: ROUTES.assumptions, icon: "Target" },
  { label: "Simulations", href: ROUTES.simulations, icon: "Activity" },
  { label: "Agents", href: ROUTES.agents, icon: "Bot", badge: 3 },
  { label: "Strategy Graph", href: ROUTES.strategyGraph, icon: "Network" },
  { label: "Documents", href: ROUTES.documents, icon: "FileText" },
  { label: "Analytics", href: ROUTES.analytics, icon: "BarChart3" },
  { label: "Team", href: ROUTES.team, icon: "Users" },
  { label: "Settings", href: ROUTES.settings, icon: "Settings" },
];

export const SIDEBAR_SECONDARY_NAV: NavItem[] = [
  { label: "Notifications", href: ROUTES.notifications, icon: "Bell", badge: 5 },
  { label: "Integrations", href: ROUTES.integrations, icon: "Plug" },
  { label: "Audit Logs", href: ROUTES.auditLogs, icon: "ScrollText" },
  { label: "Activity", href: ROUTES.activity, icon: "Clock" },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: "$49",
    annualPrice: "$39",
    description: "For teams getting started with structured decision-making.",
    features: [
      "Up to 10 team members",
      "100 decisions per month",
      "Basic assumption tracking",
      "Decision quality scoring",
      "Email support",
      "Standard analytics",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    price: "$149",
    annualPrice: "$119",
    description: "For organizations scaling decision intelligence across teams.",
    features: [
      "Up to 50 team members",
      "Unlimited decisions",
      "Advanced assumption calibration",
      "AI-powered simulations",
      "Autonomous Agent Layer with Decision Gate",
      "Strategy graph visualization",
      "Document intelligence",
      "Priority support",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    annualPrice: "Custom",
    description: "For enterprises requiring full strategic decision infrastructure.",
    features: [
      "Unlimited team members",
      "Unlimited everything",
      "Institutional continuity engine",
      "Autonomous audit trails",
      "CRM validation layer",
      "Advanced pattern recognition",
      "SSO & SAML",
      "Dedicated success manager",
      "Custom SLA",
      "On-premise deployment option",
    ],
    cta: "Contact Sales",
  },
];

export const FEATURES_LIST: FeatureItem[] = [
  {
    icon: "Brain",
    title: "Decision Intelligence Engine",
    description:
      "Capture every strategic decision as a Structured Decision Object with context, assumptions, and projected outcomes.",
  },
  {
    icon: "Target",
    title: "Assumption Calibration",
    description:
      "Track, validate, and challenge the assumptions behind every decision. Never let unexamined beliefs drive strategy.",
  },
  {
    icon: "ScanSearch",
    title: "Pattern Recognition",
    description:
      "Detect recurring decision patterns, behavioral biases, and organizational tendencies across your decision history.",
  },
  {
    icon: "Gauge",
    title: "Confidence Scoring",
    description:
      "Quantify decision quality with composite scores based on assumption validity, data coverage, and historical accuracy.",
  },
  {
    icon: "Activity",
    title: "Projection & Simulation",
    description:
      "Model probabilistic outcomes and simulate future scenarios before committing to a strategic direction.",
  },
  {
    icon: "Building2",
    title: "Institutional Continuity",
    description:
      "Preserve strategic context through leadership transitions. Generate decision briefs and rationale histories.",
  },
  {
    icon: "Network",
    title: "Decision Graph",
    description:
      "Visualize relationships between decisions, assumptions, and outcomes as an interactive knowledge graph.",
  },
  {
    icon: "BarChart3",
    title: "Visual Intelligence",
    description:
      "Executive dashboards with real-time KPIs, trend analysis, and strategic health indicators.",
  },
  {
    icon: "FileText",
    title: "Document Intelligence",
    description:
      "Extract decisions, assumptions, and strategic signals from PDFs, documents, and presentations automatically.",
  },
  {
    icon: "Handshake",
    title: "CRM Validation",
    description:
      "Cross-reference strategic decisions with CRM data to validate assumptions against real customer outcomes.",
  },
  {
    icon: "Bot",
    title: "Autonomous Agent Layer",
    description:
      "Create AI agents with a no-code builder. Every agent action generates a structured decision that flows through the Decision Gate with organizational memory.",
  },
  {
    icon: "ShieldCheck",
    title: "Autonomous Audit",
    description:
      "Complete decision audit trails with immutable logs, compliance tracking, and regulatory readiness.",
  },
];

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: ROUTES.features },
    { label: "Pricing", href: ROUTES.pricing },
    { label: "Changelog", href: ROUTES.changelog },
    { label: "Integrations", href: ROUTES.marketingIntegrations },
  ],
  platform: [
    { label: "Decision Intelligence", href: ROUTES.decisionIntelligence },
    { label: "Assumption Tracking", href: ROUTES.features },
    { label: "Simulations", href: ROUTES.features },
    { label: "AI Agents", href: ROUTES.aiAgents },
    { label: "Strategy Graph", href: ROUTES.features },
  ],
  solutions: [
    { label: "Use Cases", href: ROUTES.useCases },
    { label: "Enterprise Strategy", href: ROUTES.useCases },
    { label: "Product Teams", href: ROUTES.useCases },
    { label: "Risk Management", href: ROUTES.decisionIntelligence },
  ],
  resources: [
    { label: "Documentation", href: ROUTES.docs },
    { label: "Blog", href: ROUTES.blog },
    { label: "Guides", href: ROUTES.docs },
    { label: "Changelog", href: ROUTES.changelog },
  ],
  company: [
    { label: "About", href: ROUTES.about },
    { label: "Careers", href: ROUTES.careers },
    { label: "Security", href: ROUTES.marketingSecurity },
    { label: "Contact", href: ROUTES.about },
  ],
  legal: [
    { label: "Privacy Policy", href: ROUTES.privacy },
    { label: "Terms of Service", href: ROUTES.terms },
    { label: "Security", href: ROUTES.marketingSecurity },
    { label: "Cookie Policy", href: ROUTES.privacy },
  ],
  developers: [
    { label: "API Reference", href: ROUTES.docs },
    { label: "SDKs", href: ROUTES.docs },
    { label: "Webhooks", href: ROUTES.marketingIntegrations },
    { label: "Status Page", href: ROUTES.changelog },
  ],
};
