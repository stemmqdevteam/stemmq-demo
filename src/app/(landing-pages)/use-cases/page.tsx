"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Package, Lightbulb, Settings, Building2,
  ArrowRight, CheckCircle2, Quote, Star, Zap, Bot,
  Brain, Shield, BarChart3, Target, Users, Sparkles,
  XCircle, AlertTriangle, ChevronRight, Database
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { CTASection } from "@/components/marketing/cta-section";
import { AnimatedGradient } from "@/components/animations/animated-gradient";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════ */

function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [-16, 16, -16], x: [-8, 8, -8] }}
      transition={{ duration: 11 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    />
  );
}

function Reveal({
  children, delay = 0, className = "", direction = "up",
}: {
  children: React.ReactNode; delay?: number; className?: string;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const xInit = direction === "left" ? -28 : direction === "right" ? 28 : 0;
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: direction === "up" ? 24 : 0, x: xInit }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function LiveBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
      </span>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */

const teams = [
  {
    id: "marketing",
    label: "Marketing",
    icon: TrendingUp,
    color: "#6366f1",
    tagline: "From gut-feel campaigns to evidence-based growth",
    problem: "Campaign decisions made on instinct with no way to track which assumptions drove performance — or tanked it.",
    solution: "Every campaign becomes a structured decision with captured assumptions, outcome tracking, and agent-powered timing intelligence.",
    outcomes: [
      "34% improvement in campaign assumption accuracy",
      "MarketingAgent surfaces timing patterns from organizational memory",
      "Full audit trail for every budget reallocation",
      "AB test decisions structured and tracked automatically",
    ],
    mockDecisions: [
      { title: "Q4 Holiday Campaign · EMEA", intent: "Growth", dqs: 88, status: "active" },
      { title: "Reduce CPL by 20% via retargeting", intent: "Efficiency", dqs: 74, status: "review" },
      { title: "Launch influencer pilot · 3 markets", intent: "Experiment", dqs: 81, status: "approved" },
    ],
    agentEvents: [
      { agent: "MarketingAgent", action: "Optimal send window: Tuesday 10am — 23% higher open rate", confidence: 91, status: "approved" },
      { agent: "MarketingAgent", action: "Budget shift: Reallocate $40K from display to paid social", confidence: 84, status: "approved" },
      { agent: "RiskAgent", action: "Campaign overlap detected with SalesAgent — escalating", confidence: 77, status: "review" },
    ],
  },
  {
    id: "product",
    label: "Product",
    icon: Package,
    color: "#a855f7",
    tagline: "Kill prioritization debates. Ship with data.",
    problem: "Feature prioritization is political, not data-driven. No visibility into which bets paid off — or why they were made in the first place.",
    solution: "Each feature decision captures strategic intent, assumptions, and links to outcome metrics. DQS scoring replaces gut-feel debates.",
    outcomes: [
      "DQS scoring cuts prioritization debates by 60%",
      "Historical decision accuracy improves roadmap confidence",
      "Agents reference past decisions before proposing features",
      "Assumption invalidation surfaces before shipping, not after",
    ],
    mockDecisions: [
      { title: "Launch React SDK in Q1", intent: "Growth", dqs: 82, status: "active" },
      { title: "Deprecate v1 API endpoint", intent: "Efficiency", dqs: 74, status: "draft" },
      { title: "Hire 3 ML engineers", intent: "Growth", dqs: 91, status: "approved" },
    ],
    agentEvents: [
      { agent: "ProductAgent", action: "Propose: Prioritize SDK over API v2 — 3x user demand signal", confidence: 89, status: "approved" },
      { agent: "DataAgent", action: "Pattern: Similar v1 deprecations took 2x longer than estimated", confidence: 92, status: "review" },
      { agent: "ProductAgent", action: "SDK assumption invalidated: iOS support needed in week 1", confidence: 78, status: "review" },
    ],
  },
  {
    id: "founders",
    label: "Founders",
    icon: Lightbulb,
    color: "#f59e0b",
    tagline: "Never lose a strategic insight again.",
    problem: "Strategic decisions happen fast, rationale gets lost, and the same mistakes repeat across rounds — costing time, capital, and board credibility.",
    solution: "Institutional memory captures the reasoning behind every strategic call — forever. Investor-ready, board-grade, always auditable.",
    outcomes: [
      "Zero strategic decisions lost in leadership transitions",
      "Investor-ready decision rationale exportable on demand",
      "Pattern recognition reveals blind spots before they compound",
      "Board meeting prep reduced from days to minutes",
    ],
    mockDecisions: [
      { title: "Expand to EMEA in Q1 2026", intent: "Growth", dqs: 87, status: "active" },
      { title: "Raise Series B at $80M cap", intent: "Risk Mitigation", dqs: 79, status: "approved" },
      { title: "Pivot ICP to mid-market", intent: "Defense", dqs: 83, status: "draft" },
    ],
    agentEvents: [
      { agent: "StrategyAgent", action: "EMEA assumption challenged: Regulatory timeline now 14 weeks", confidence: 88, status: "review" },
      { agent: "StrategyAgent", action: "Similar expansion decision in 2023 took 2x resources — flagging", confidence: 91, status: "review" },
      { agent: "FinanceAgent", action: "Series B cap assumption validated against comparable rounds", confidence: 85, status: "approved" },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: Settings,
    color: "#10b981",
    tagline: "Process changes with accountability built in.",
    problem: "Process changes happen without impact tracking, creating invisible organizational debt that compounds silently until something breaks.",
    solution: "Every process change is a decision with owner, assumptions, and measurable outcomes. OpsAgent monitors impact in real-time.",
    outcomes: [
      "Full audit trail for compliance and governance",
      "OpsAgent flags risk through Decision Gate before changes execute",
      "Cross-team decision visibility reduces conflicts by 40%",
      "Mean time to process rollback drops from days to hours",
    ],
    mockDecisions: [
      { title: "Migrate CI/CD to GitHub Actions", intent: "Efficiency", dqs: 86, status: "active" },
      { title: "Reduce onboarding from 7 to 5 steps", intent: "Efficiency", dqs: 79, status: "approved" },
      { title: "Consolidate 3 vendor contracts", intent: "Efficiency", dqs: 73, status: "draft" },
    ],
    agentEvents: [
      { agent: "OpsAgent", action: "CI/CD migration: 2 dependency conflicts detected — pausing", confidence: 94, status: "review" },
      { agent: "OpsAgent", action: "Onboarding reduction validated: NPS +8 pts over 30 days", confidence: 88, status: "approved" },
      { agent: "RiskAgent", action: "Vendor consolidation: SLA gap in contract 2 — flagging legal", confidence: 82, status: "review" },
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    icon: Building2,
    color: "#3b82f6",
    tagline: "One system of record. Zero blind spots at scale.",
    problem: "At scale, decisions happen everywhere — siloed, untracked, and impossible to govern. AI agents multiply the surface area of risk.",
    solution: "StemmQ becomes the organizational decision layer — every team, every agent, one system of record with enterprise-grade governance.",
    outcomes: [
      "Cross-org decision governance from one platform",
      "SSO + SAML + immutable audit logs for compliance",
      "Autonomous Agent Layer supervises all agents org-wide",
      "Board-level reporting on decision quality and outcomes",
    ],
    mockDecisions: [
      { title: "Org-wide AI governance policy", intent: "Risk Mitigation", dqs: 92, status: "active" },
      { title: "Global pricing standardization", intent: "Efficiency", dqs: 85, status: "approved" },
      { title: "M&A target evaluation: Acme Corp", intent: "Growth", dqs: 88, status: "draft" },
    ],
    agentEvents: [
      { agent: "GovAgent", action: "24 agents active · 0 gate violations in past 7 days", confidence: 100, status: "approved" },
      { agent: "ComplianceAgent", action: "Audit log export ready — 847 decisions this quarter", confidence: 100, status: "approved" },
      { agent: "RiskAgent", action: "APAC pricing decision conflicts with EMEA policy — escalating", confidence: 91, status: "review" },
    ],
  },
];

const stats = [
  { value: "+34%", label: "Assumption accuracy within 6 months", color: "#6366f1" },
  { value: "8 wks", label: "Avg time to org-wide structured decisions", color: "#a855f7" },
  { value: "91%", label: "Agent proposal approval rate (first pass)", color: "#10b981" },
  { value: "0", label: "Untracked strategic decisions (compliant orgs)", color: "#f59e0b" },
];

const quotes = [
  {
    quote: "StemmQ changed how we run product planning. Our DQS baseline jumped 28 points in two quarters.",
    name: "Jordan Kim", role: "Head of Product", company: "Series B SaaS", initials: "JK", color: "#a855f7", stars: 5,
  },
  {
    quote: "Every investor asks us to show our decision-making process. We just export from StemmQ.",
    name: "Priya Sharma", role: "Co-founder & CEO", company: "Fintech Startup", initials: "PS", color: "#f59e0b", stars: 5,
  },
  {
    quote: "We have 40 AI agents running. Without StemmQ's Decision Gate and org memory, that would be terrifying.",
    name: "Marcus Webb", role: "VP Engineering", company: "Enterprise SaaS", initials: "MW", color: "#3b82f6", stars: 5,
  },
];

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */

function UseCasesHero({ activeTeam, setActiveTeam }: {
  activeTeam: string; setActiveTeam: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 sm:pt-32 pb-14 bg-background">
      <AnimatedGradient intensity="medium" />
      <Orb delay={0} className="absolute top-[-8%] left-[-3%] w-[440px] h-[440px] rounded-full bg-indigo-600/10 blur-[110px] pointer-events-none" />
      <Orb delay={3} className="absolute bottom-[-5%] right-[-3%] w-[380px] h-[380px] rounded-full bg-violet-600/8 blur-[90px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> Use Cases
          </span>
        </Reveal>
        <Reveal delay={0.07}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.06] mb-4">
            Built for teams that{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              move the needle
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            From scrappy startups to enterprise orgs, StemmQ adapts to how your team makes decisions —
            then makes those decisions better over time.
          </p>
        </Reveal>

        {/* Team pill selector */}
        <Reveal delay={0.2}>
          <div className="flex flex-wrap justify-center gap-2">
            {teams.map((team) => {
              const Icon = team.icon;
              const isActive = activeTeam === team.id;
              return (
                <motion.button
                  key={team.id}
                  onClick={() => setActiveTeam(team.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border overflow-hidden"
                  style={{
                    borderColor: isActive ? `${team.color}60` : "var(--border)",
                    background: isActive ? `${team.color}18` : "var(--muted)",
                    color: isActive ? team.color : "var(--muted-foreground)",
                  }}
                >
                  {isActive && (
                    <motion.div layoutId="team-bg" className="absolute inset-0 rounded-full"
                      style={{ background: `${team.color}15` }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" style={{ color: isActive ? team.color : "var(--muted-foreground)" }} />
                    {team.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TEAM MOCK UI — animated decision cards + agent feed
═══════════════════════════════════════════════════ */

function TeamMockUI({ team }: { team: typeof teams[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false });
  const [visibleAgents, setVisibleAgents] = useState(0);

  useEffect(() => {
    setVisibleAgents(0);
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      i++; setVisibleAgents(i);
      if (i >= team.agentEvents.length) clearInterval(t);
    }, 700);
    return () => clearInterval(t);
  }, [team.id, inView]);

  return (
    <div ref={ref} className="space-y-3">
      {/* Decision cards */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/3 border-b border-white/6">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/5 border border-white/8 px-3 py-0.5 text-[10px] text-white/30">
              <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: team.color }} />
              app.stemmq.com/{team.id}/decisions
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-white/30 uppercase tracking-widest font-semibold">{team.label} Decisions</span>
            <span className="text-[9px] text-white/20">{team.mockDecisions.length} active</span>
          </div>
          {team.mockDecisions.map((d, i) => {
            const statusColor = d.status === "approved" ? "#10b981" : d.status === "review" ? "#f59e0b" : d.status === "active" ? team.color : "#64748b";
            const statusLabel = d.status === "active" ? "Active" : d.status === "approved" ? "✓ Approved" : d.status === "review" ? "⚑ Review" : "Draft";
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/2 px-3 py-2.5 hover:border-white/12 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white/75 font-medium truncate mb-1">{d.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold border"
                      style={{ color: team.color, background: `${team.color}12`, borderColor: `${team.color}25` }}>
                      {d.intent}
                    </span>
                    <div className="flex items-center gap-1 flex-1">
                      <div className="h-1 flex-1 rounded-full bg-white/6 overflow-hidden max-w-[60px]">
                        <div className="h-full rounded-full" style={{ width: `${d.dqs}%`, background: team.color }} />
                      </div>
                      <span className="text-[9px] text-white/35">DQS {d.dqs}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 border"
                  style={{ color: statusColor, background: `${statusColor}12`, borderColor: `${statusColor}25` }}>
                  {statusLabel}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Agent feed */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-xl shadow-black/40">
        <div className="absolute -top-2.5 -right-2.5 z-20"><LiveBadge label="Agent Feed" /></div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/3 border-b border-white/6">
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/5 border border-white/8 px-3 py-0.5 text-[10px] text-white/30">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              app.stemmq.com/agents/live
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4 space-y-2">
          <AnimatePresence>
            {team.agentEvents.slice(0, visibleAgents).map((e, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 16, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="rounded-xl border border-white/6 bg-white/2 p-2.5"
              >
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 text-white/35" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-white/65">{e.agent}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold border ${
                        e.status === "approved"
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                      }`}>
                        {e.status === "approved" ? "✓ Auto" : "⚑ Review"}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/45 leading-snug mb-1">{e.action}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1 flex-1 max-w-[80px] rounded-full bg-white/6 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${e.confidence}%`, background: e.status === "approved" ? "#10b981" : "#f59e0b" }} />
                      </div>
                      <span className="text-[9px] text-white/25">{e.confidence}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ACTIVE TEAM CONTENT SECTION
═══════════════════════════════════════════════════ */

function ActiveTeamSection({ activeTeam }: { activeTeam: string }) {
  const team = teams.find(t => t.id === activeTeam)!;
  const Icon = team.icon;

  return (
    <section className="py-12 sm:py-16 bg-card/40 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTeam}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start"
          >
            {/* Text */}
            <div>
              {/* Tag */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: `${team.color}15`, border: `1px solid ${team.color}25` }}>
                  <Icon className="h-4.5 w-4.5" style={{ color: team.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: team.color }}>{team.label} Teams</p>
                  <p className="text-[10px] text-muted-foreground">{team.tagline}</p>
                </div>
              </div>

              {/* Problem */}
              <div className="rounded-2xl border border-red-500/18 bg-red-500/4 p-4 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">The Problem</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">{team.problem}</p>
              </div>

              {/* Solution */}
              <div className="rounded-2xl border mb-5 p-4" style={{ borderColor: `${team.color}20`, background: `${team.color}05` }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: team.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: team.color }}>The StemmQ Way</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">{team.solution}</p>
              </div>

              {/* Outcomes */}
              <div className="space-y-2.5 mb-8">
                {team.outcomes.map((outcome, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${team.color}15`, border: `1px solid ${team.color}25` }}>
                      <CheckCircle2 className="h-3 w-3" style={{ color: team.color }} />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">{outcome}</span>
                  </motion.div>
                ))}
              </div>

              <Link href={ROUTES.auth}>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="relative group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-lg w-full sm:w-auto justify-center sm:justify-start"
                  style={{ background: `linear-gradient(135deg, ${team.color}, ${team.color}cc)`, boxShadow: `0 8px 24px ${team.color}25` }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start for {team.label}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                </motion.button>
              </Link>
            </div>

            {/* Mock UI */}
            <TeamMockUI team={team} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   STATS SECTION
═══════════════════════════════════════════════════ */

function StatsSection() {
  return (
    <section className="py-14 sm:py-16 bg-background border-b border-border/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -4, borderColor: `${stat.color}30` }}
                className="text-center p-4 sm:p-6 rounded-2xl border border-border/50 bg-card/40 transition-all"
              >
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums mb-2" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">{stat.label}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ALL TEAMS OVERVIEW GRID
═══════════════════════════════════════════════════ */

function AllTeamsGrid({ setActiveTeam }: { setActiveTeam: (id: string) => void }) {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/25 bg-(--accent)/8 px-4 py-1.5 text-xs font-medium text-(--accent) mb-4">
            All Teams
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            One platform.{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Every team.
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            StemmQ works where your team works — and connects decisions across the org.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {teams.map((team, i) => {
            const Icon = team.icon;
            return (
              <Reveal key={team.id} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -5, borderColor: `${team.color}35` }}
                  onClick={() => {
                    setActiveTeam(team.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group relative rounded-2xl border border-border/50 bg-card/40 p-5 sm:p-6 cursor-pointer overflow-hidden transition-all h-full"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `radial-gradient(circle at 20% 20%, ${team.color}08, transparent 60%)` }} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${team.color}15`, border: `1px solid ${team.color}25` }}>
                        <Icon className="h-5 w-5" style={{ color: team.color }} />
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground/50 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm font-bold text-foreground mb-1">{team.label} Teams</p>
                    <p className="text-xs text-muted-foreground mb-4 leading-snug">{team.tagline}</p>
                    <div className="space-y-1.5">
                      {team.outcomes.slice(0, 2).map((o, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: team.color }} />
                          <span className="text-[10px] sm:text-xs text-muted-foreground leading-snug">{o}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════ */

function TestimonialsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-16 sm:py-20 bg-card/40 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-4">
            What Teams Say
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Decision intelligence{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              in practice
            </span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {quotes.map((q, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                onClick={() => setActive(i)}
                className={`rounded-2xl border p-5 sm:p-6 cursor-pointer transition-all h-full ${
                  active === i ? "border-indigo-500/40 bg-indigo-500/6" : "border-border/50 bg-card/40 hover:border-border"
                }`}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: q.stars }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="h-5 w-5 text-indigo-400/30 mb-2" />
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-5">"{q.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${q.color}, ${q.color}88)` }}>
                    {q.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{q.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{q.role} · {q.company}</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Dot nav mobile */}
        <div className="flex justify-center gap-2 mt-5 sm:hidden">
          {quotes.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${active === i ? "w-5 bg-indigo-400" : "w-1.5 bg-border/60"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   BOTTOM CTA
═══════════════════════════════════════════════════ */

function BottomCTA({ activeTeam }: { activeTeam: string }) {
  const team = teams.find(t => t.id === activeTeam)!;
  return (
    <section className="py-14 sm:py-16 bg-background border-t border-border/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/8 to-violet-500/5 p-7 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 60%)" }} />
            <div className="relative">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
                Ready to make your{" "}
                <span style={{ color: team.color }}>{team.label.toLowerCase()}</span> decisions{" "}
                smarter?
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-7">
                Join 2,400+ teams using StemmQ to build decision infrastructure that compounds over time.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href={ROUTES.auth}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-xl shadow-indigo-500/25 w-full sm:w-auto justify-center"
                    style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </Link>
                <Link href={ROUTES.product}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-foreground/80 border border-border/50 bg-muted/30 hover:bg-muted/50 hover:text-foreground transition-all w-full sm:w-auto justify-center">
                    Explore the Platform
                  </motion.button>
                </Link>
              </div>
              <p className="text-[11px] text-foreground/30 mt-4">No credit card required · 14-day Pro trial</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function UseCasesPage() {
  const [activeTeam, setActiveTeam] = useState("marketing");

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <UseCasesHero activeTeam={activeTeam} setActiveTeam={setActiveTeam} />
      <ActiveTeamSection activeTeam={activeTeam} />
      <StatsSection />
      <AllTeamsGrid setActiveTeam={setActiveTeam} />
      <TestimonialsSection />
      <BottomCTA activeTeam={activeTeam} />
      <MarketingFooter />
    </div>
  );
}