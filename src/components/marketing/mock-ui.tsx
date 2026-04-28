"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertTriangle, XCircle, Bot, ArrowRight, Shield, Lock } from "lucide-react";

// ─── MockBrowser ───────────────────────────────────────────────────────────────
interface MockBrowserProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
}

function MockBrowser({ url = "app.stemmq.com", children, className }: MockBrowserProps) {
  return (
    <div className={`rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden ${className ?? ""}`}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-muted/30">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-danger/60" />
          <div className="h-3 w-3 rounded-full bg-warning/60" />
          <div className="h-3 w-3 rounded-full bg-success/60" />
        </div>
        <div className="flex-1 text-center">
          <div className="inline-flex items-center gap-2 rounded-md bg-background/60 px-3 py-0.5 text-xs text-muted-foreground">
            <Lock className="h-2.5 w-2.5" />
            {url}
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

// ─── MockDecisionCard ──────────────────────────────────────────────────────────
interface MockDecisionCardProps {
  title?: string;
  intent?: string;
  dqs?: number;
  status?: "draft" | "active" | "approved";
  assumptions?: number;
}

function MockDecisionCard({
  title = "Expand into European market",
  intent = "Growth",
  dqs = 87,
  status = "active",
  assumptions = 6,
}: MockDecisionCardProps) {
  const intentColors: Record<string, string> = {
    Growth: "bg-success/10 text-success",
    Defense: "bg-warning/10 text-warning",
    Efficiency: "bg-accent/10 text-accent",
    Experiment: "bg-purple-500/10 text-purple-500",
    "Risk Mitigation": "bg-danger/10 text-danger",
  };

  const statusIcons = {
    draft: <Clock className="h-3 w-3 text-muted-foreground" />,
    active: <CheckCircle className="h-3 w-3 text-success" />,
    approved: <CheckCircle className="h-3 w-3 text-accent" />,
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {statusIcons[status]}
          <span className="text-xs text-muted-foreground capitalize">{status}</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${intentColors[intent] ?? "bg-muted text-muted-foreground"}`}>
          {intent}
        </span>
      </div>
      <p className="text-sm font-medium text-foreground mb-3">{title}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{assumptions} assumptions</span>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-accent" style={{ width: `${dqs}%` }} />
          </div>
          <span className="text-xs font-bold text-foreground">DQS {dqs}</span>
        </div>
      </div>
    </div>
  );
}

// ─── MockAgentFeed ─────────────────────────────────────────────────────────────
interface AgentProposal {
  agent: string;
  action: string;
  risk: "low" | "medium" | "high";
  status: "pending" | "approved" | "reviewing";
}

const defaultProposals: AgentProposal[] = [
  { agent: "PricingAgent", action: "Launch 15% discount campaign for Q4", risk: "medium", status: "reviewing" },
  { agent: "MarketingAgent", action: "Increase paid ad spend by $12k", risk: "low", status: "approved" },
  { agent: "SalesAgent", action: "Reduce enterprise contract floor to $8k/yr", risk: "high", status: "pending" },
];

function MockAgentFeed({ proposals = defaultProposals }: { proposals?: AgentProposal[] }) {
  const riskColors = {
    low: "bg-success/10 text-success",
    medium: "bg-warning/10 text-warning",
    high: "bg-danger/10 text-danger",
  };

  const statusConfig = {
    pending: { icon: <Clock className="h-3 w-3 text-warning" />, label: "Pending Decision Gate" },
    approved: { icon: <CheckCircle className="h-3 w-3 text-success" />, label: "Approved" },
    reviewing: { icon: <AlertTriangle className="h-3 w-3 text-accent" />, label: "In Review" },
  };

  return (
    <div className="space-y-2.5">
      {proposals.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.4 }}
          className="rounded-lg border border-border bg-card p-3 shadow-sm"
        >
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center">
                <Bot className="h-2.5 w-2.5 text-accent" />
              </div>
              <span className="text-[10px] font-semibold text-accent">{p.agent}</span>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${riskColors[p.risk]}`}>
              {p.risk} risk
            </span>
          </div>
          <p className="text-[11px] text-foreground mb-2">{p.action}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {statusConfig[p.status].icon}
              <span className="text-[9px] text-muted-foreground">{statusConfig[p.status].label}</span>
            </div>
            {p.status === "pending" && (
              <div className="flex gap-1">
                <button className="text-[9px] px-2 py-0.5 rounded bg-success/10 text-success font-medium hover:bg-success/20 transition-colors">
                  Approve
                </button>
                <button className="text-[9px] px-2 py-0.5 rounded bg-danger/10 text-danger font-medium hover:bg-danger/20 transition-colors">
                  Reject
                </button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── MockFlowDiagram ───────────────────────────────────────────────────────────
const FLOW_STEPS = [
  { label: "Intent", desc: "Agent proposes action", color: "bg-accent/10 border-accent/20 text-accent" },
  { label: "Decision Object", desc: "Structured decision created", color: "bg-blue-500/10 border-blue-500/20 text-blue-500" },
  { label: "Evaluate", desc: "Risk + pattern + assumption", color: "bg-purple-500/10 border-purple-500/20 text-purple-500" },
  { label: "Decision Gate", desc: "Approve / Revise / Escalate", color: "bg-warning/10 border-warning/20 text-warning" },
  { label: "Execute", desc: "Only approved actions run", color: "bg-success/10 border-success/20 text-success" },
  { label: "Outcome", desc: "Track + learn + improve", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" },
];

function MockFlowDiagram({ vertical = false }: { vertical?: boolean }) {
  if (vertical) {
    return (
      <div className="relative flex flex-col gap-0">
        {FLOW_STEPS.map((step, i) => (
          <div key={step.label} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0 ${step.color}`}>
                {i + 1}
              </div>
              {i < FLOW_STEPS.length - 1 && <div className="w-0.5 h-6 bg-border mt-1" />}
            </div>
            <div className="pb-4">
              <p className="text-sm font-semibold text-foreground">{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {FLOW_STEPS.map((step, i) => (
        <div key={step.label} className="flex items-center gap-1 shrink-0">
          <div className={`rounded-lg border px-3 py-2 text-center min-w-[80px] ${step.color}`}>
            <p className="text-[10px] font-bold">{step.label}</p>
            <p className="text-[9px] mt-0.5 opacity-80">{step.desc}</p>
          </div>
          {i < FLOW_STEPS.length - 1 && (
            <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MockAuditLog ──────────────────────────────────────────────────────────────
const AUDIT_ENTRIES = [
  { time: "09:41:02", actor: "PricingAgent", action: "DECISION_PROPOSED", resource: "Q4 Discount Campaign", ip: "10.0.1.42" },
  { time: "09:41:15", actor: "RiskEngine", action: "RISK_EVALUATED", resource: "Q4 Discount Campaign", ip: "10.0.1.1" },
  { time: "09:41:20", actor: "sarah@acme.com", action: "DECISION_APPROVED", resource: "Q4 Discount Campaign", ip: "192.168.1.5" },
  { time: "09:41:21", actor: "PricingAgent", action: "ACTION_EXECUTED", resource: "Stripe discount applied", ip: "10.0.1.42" },
  { time: "09:42:05", actor: "OutcomeTracker", action: "OUTCOME_LOGGED", resource: "Q4 Discount Campaign", ip: "10.0.1.1" },
];

function MockAuditLog() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
        <Shield className="h-3.5 w-3.5 text-accent" />
        <span className="text-xs font-semibold text-foreground">Immutable Audit Trail</span>
        <div className="ml-auto flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] text-muted-foreground">Live</span>
        </div>
      </div>
      <div className="divide-y divide-border/50">
        {AUDIT_ENTRIES.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="px-4 py-2.5 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-muted-foreground shrink-0 w-14">{entry.time}</span>
              <span className="text-[10px] font-semibold text-accent shrink-0">{entry.action}</span>
              <span className="text-[10px] text-foreground truncate flex-1">{entry.resource}</span>
              <span className="text-[9px] text-muted-foreground shrink-0 hidden sm:block">{entry.ip}</span>
            </div>
            <p className="text-[9px] text-muted-foreground mt-0.5 ml-17">by {entry.actor}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── MockMetricGrid ────────────────────────────────────────────────────────────
const DEFAULT_METRICS = [
  { label: "Active Decisions", value: "47", change: "+12.3%", up: true },
  { label: "Avg DQS", value: "78.4", change: "+4.2%", up: true },
  { label: "Assumption Accuracy", value: "84.1%", change: "+2.1%", up: true },
  { label: "Confidence Index", value: "91.2", change: "+6.8%", up: true },
];

function MockMetricGrid({ metrics = DEFAULT_METRICS }: { metrics?: typeof DEFAULT_METRICS }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-lg border border-border bg-background/50 p-3">
          <p className="text-[10px] text-muted-foreground">{m.label}</p>
          <p className="mt-1 text-xl font-semibold text-foreground">{m.value}</p>
          <p className={`mt-0.5 text-[10px] ${m.up ? "text-success" : "text-danger"}`}>{m.change}</p>
        </div>
      ))}
    </div>
  );
}

// ─── MockSDOCard ───────────────────────────────────────────────────────────────
function MockSDOCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Decision Object</span>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">Growth</span>
      </div>
      <div className="space-y-2">
        {[
          { label: "Title", value: "Expand into EMEA market Q1" },
          { label: "Owner", value: "Sarah Chen · VP Strategy" },
          { label: "Intent", value: "Growth — New Market Entry" },
          { label: "Assumptions", value: "6 tracked · 4 validated" },
          { label: "DQS", value: "87 / 100" },
          { label: "Status", value: "Active" },
        ].map((field) => (
          <div key={field.label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
            <span className="text-[10px] text-muted-foreground">{field.label}</span>
            <span className="text-[10px] font-medium text-foreground">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export {
  MockBrowser,
  MockDecisionCard,
  MockAgentFeed,
  MockFlowDiagram,
  MockAuditLog,
  MockMetricGrid,
  MockSDOCard,
};
