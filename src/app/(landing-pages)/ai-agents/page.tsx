"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Bot, Brain, Shield, Zap, CheckCircle, XCircle, AlertTriangle,
  Target, BarChart3, TrendingUp, Users, ArrowRight, Play, Network,
  Eye, Sparkles, Lock, Database, ChevronRight, CheckCircle2,
  Activity, GitBranch, Clock, Star, Layers
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { CTASection } from "@/components/marketing/cta-section";
import { EnterpriseSection } from "@/components/marketing/enterprise-section";
import { AnimatedGradient } from "@/components/animations/animated-gradient";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   SHARED PRIMITIVES
═══════════════════════════════════════════════════ */

function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [-18, 18, -18], x: [-10, 10, -10] }}
      transition={{ duration: 10 + delay, repeat: Infinity, ease: "easeInOut", delay }}
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
  const inView = useInView(ref, { once: true, margin: "-70px" });
  const xInit = direction === "left" ? -30 : direction === "right" ? 30 : 0;
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: direction === "up" ? 26 : 0, x: xInit }}
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

const agentTypes = [
  { icon: TrendingUp, name: "PricingAgent", role: "Pricing Optimization", dept: "Revenue", color: "#6366f1" },
  { icon: Users, name: "MarketingAgent", role: "Campaign Intelligence", dept: "Marketing", color: "#a855f7" },
  { icon: Target, name: "SalesAgent", role: "Pipeline Optimization", dept: "Sales", color: "#10b981" },
  { icon: Zap, name: "OpsAgent", role: "Process Optimization", dept: "Operations", color: "#f59e0b" },
  { icon: Brain, name: "StrategyAgent", role: "Strategic Alignment", dept: "Leadership", color: "#3b82f6" },
  { icon: BarChart3, name: "FinanceAgent", role: "Budget Intelligence", dept: "Finance", color: "#06b6d4" },
  { icon: Shield, name: "RiskAgent", role: "Risk Monitoring", dept: "Compliance", color: "#ef4444" },
  { icon: Database, name: "DataAgent", role: "Insight Generation", dept: "Analytics", color: "#8b5cf6" },
];

const canDo = [
  "Propose decisions backed by historical data and outcomes",
  "Reference similar past decisions from organizational memory",
  "Flag emerging risks before they become incidents",
  "Recommend budget reallocations with confidence scores",
  "Collaborate with other agents on joint decisions",
  "Generate structured decision objects automatically",
];

const cannotDo = [
  "Execute any action without a Decision Object",
  "Bypass the Decision Gate under any condition",
  "Modify production systems without approval",
  "Make irreversible decisions autonomously",
  "Operate outside defined risk boundaries",
  "Act without referencing organizational memory",
];

const perfMetrics = [
  { icon: Brain, label: "Forecast Accuracy", value: "81%", trend: "+12%", color: "#6366f1" },
  { icon: CheckCircle, label: "Decision Quality", value: "8.4", trend: "+0.9", color: "#10b981" },
  { icon: TrendingUp, label: "ROI Contribution", value: "$2.4M", trend: "+34%", color: "#a855f7" },
  { icon: Shield, label: "Risk Exposure", value: "Med", trend: "−18%", color: "#f59e0b" },
  { icon: BarChart3, label: "Success Rate", value: "67%", trend: "+8%", color: "#3b82f6" },
];

const liveAgentEvents = [
  { agent: "PricingAgent", action: "Propose: Q4 volume discount +15% for enterprise tier", confidence: 91, status: "approved", color: "#10b981" },
  { agent: "RiskAgent", action: "Flag: Regulatory window closing in 12 days — DACH region", confidence: 87, status: "review", color: "#f59e0b" },
  { agent: "OpsAgent", action: "Optimize: Reduce onboarding sequence from 7 to 5 steps", confidence: 78, status: "approved", color: "#6366f1" },
  { agent: "MarketAgent", action: "Alert: Competitor launched in DACH — pricing gap emerging", confidence: 94, status: "review", color: "#f59e0b" },
  { agent: "FinanceAgent", action: "Propose: Reallocate $200K budget to EMEA growth hiring", confidence: 83, status: "approved", color: "#10b981" },
];

const gateSteps = [
  { step: "1", label: "Intent", desc: "Agent proposes action", icon: Bot, color: "#6366f1" },
  { step: "2", label: "Decision Object", desc: "Structured decision created", icon: Database, color: "#3b82f6" },
  { step: "3", label: "Evaluation", desc: "Risk + pattern + assumptions", icon: Brain, color: "#8b5cf6" },
  { step: "4", label: "Decision Gate", desc: "Approve / Revise / Escalate", icon: Shield, color: "#f59e0b" },
  { step: "5", label: "Execution", desc: "Only approved actions run", icon: Zap, color: "#10b981" },
  { step: "6", label: "Outcome Track", desc: "Log + learn + improve", icon: BarChart3, color: "#06b6d4" },
];

const humanLoopRules = [
  { trigger: "Risk exceeds defined threshold", action: "Escalate to human reviewer", color: "#f59e0b" },
  { trigger: "Financial exposure above limit", action: "Require approval", color: "#ef4444" },
  { trigger: "Confidence score < 70%", action: "Flag for review", color: "#8b5cf6" },
  { trigger: "Irreversible or high-impact action", action: "Mandatory human approval", color: "#6366f1" },
];

/* ═══════════════════════════════════════════════════
   HERO — Live Agent Feed
═══════════════════════════════════════════════════ */

function HeroAgentFeed() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [visible, setVisible] = useState(0);
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || visible >= liveAgentEvents.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), 600);
    return () => clearTimeout(t);
  }, [inView, visible]);

  // pulse existing items
  useEffect(() => {
    const t = setInterval(() => setHighlightIdx(Math.floor(Math.random() * visible)), 2400);
    return () => clearInterval(t);
  }, [visible]);

  return (
    <div ref={ref} className="relative">
      <div className="absolute -top-3 -right-3 z-20"><LiveBadge label="Live Proposals" /></div>
      <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-black/60">
        {/* Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/3 border-b border-white/6">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/5 border border-white/8 px-3 py-0.5 text-[10px] text-white/30">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              app.stemmq.com/agents/live-feed
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Agent Proposals · Real-time</span>
            <span className="text-[9px] text-white/25">{visible}/{liveAgentEvents.length} active</span>
          </div>
          <div className="space-y-2.5">
            <AnimatePresence>
              {liveAgentEvents.slice(0, visible).map((e, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 24, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`rounded-xl border px-3 py-2.5 transition-all ${
                    highlightIdx === i ? "border-white/15 bg-white/5" : "border-white/6 bg-white/2"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-white/70">{e.agent}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 border ${
                          e.status === "approved"
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                        }`}>
                          {e.status === "approved" ? "✓ Approved" : "⚑ Review"}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50 leading-snug mb-1.5">{e.action}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1 flex-1 rounded-full bg-white/6 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${e.confidence}%`, background: e.color }} />
                        </div>
                        <span className="text-[9px] text-white/25 flex-shrink-0">{e.confidence}% conf.</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAgentsHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[95vh] flex items-center overflow-hidden bg-background">
      <AnimatedGradient intensity="strong" />
      <Orb delay={0} className="absolute top-[-8%] left-[-3%] w-[500px] h-[500px] rounded-full bg-indigo-600/12 blur-[120px] pointer-events-none" />
      <Orb delay={4} className="absolute bottom-[-8%] right-[-3%] w-[420px] h-[420px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-5 backdrop-blur-sm">
                <Bot className="h-3.5 w-3.5" /> AI Agent System
              </span>
            </Reveal>
            <Reveal delay={0.07}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.06] mb-5">
                Agents that{" "}
                <span style={{ background: "linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  decide.
                </span>
                <br className="hidden sm:block" />
                Infrastructure that{" "}
                <span style={{ background: "linear-gradient(135deg,#f59e0b,#10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  governs.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mb-8">
                Create agents with a no-code builder or connect external systems. Every action generates a
                structured decision object — with organizational memory, conditional human oversight,
                and outcome tracking built in.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href={ROUTES.auth}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-xl shadow-indigo-500/25 w-full sm:w-auto justify-center"
                    style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                    <span className="relative z-10 flex items-center gap-2">
                      Build Your First Agent
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </Link>
                <Link href={ROUTES.decisionIntelligence}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-foreground/60 border border-border bg-muted/30 hover:bg-muted/50 hover:text-foreground transition-all w-full sm:w-auto justify-center">
                    <Play className="h-3.5 w-3.5" />
                    See Decision Gate
                  </motion.button>
                </Link>
              </div>
            </Reveal>

            {/* Mini stats */}
            <Reveal delay={0.26}>
              <div className="flex flex-wrap gap-5">
                {[
                  { v: "8", label: "agent types", color: "#6366f1" },
                  { v: "100%", label: "gate coverage", color: "#10b981" },
                  { v: "81%", label: "forecast accuracy", color: "#a855f7" },
                ].map(s => (
                  <div key={s.label} className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold tabular-nums" style={{ color: s.color }}>{s.v}</span>
                    <span className="text-[10px] text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — live feed */}
          <Reveal delay={0.18} direction="right">
            <HeroAgentFeed />
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   DECISION GATE PIPELINE — animated
═══════════════════════════════════════════════════ */

function DecisionGateSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(-1);
  const [activeDetail, setActiveDetail] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      setActive(i); i++;
      if (i >= gateSteps.length) clearInterval(t);
    }, 550);
    return () => clearInterval(t);
  }, [inView]);

  const detail = gateSteps[activeDetail];
  const DIcon = detail.icon;

  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/8 px-4 py-1.5 text-xs font-medium text-amber-300 mb-4">
            <Shield className="h-3.5 w-3.5" /> Core Principle
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
            Every Agent Action ={" "}
            <span style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              A Decision Object
            </span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            No agent — internal or external — can execute without first generating a structured decision.
            The Decision Gate is non-negotiable.
          </p>
        </Reveal>

        <div ref={ref}>
          {/* Desktop: horizontal pipeline */}
          <div className="hidden md:flex items-center justify-center gap-1 mb-10 overflow-x-auto pb-2">
            {gateSteps.map((step, i) => {
              const SIcon = step.icon;
              const done = active >= i;
              const isSel = activeDetail === i;
              return (
                <div key={step.step} className="flex items-center flex-shrink-0">
                  <motion.div onClick={() => setActiveDetail(i)}
                    initial={{ opacity: 0, scale: 0.7 }} animate={done ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl border cursor-pointer transition-all"
                    style={{
                      borderColor: isSel ? `${step.color}50` : done ? `${step.color}25` : "var(--border)",
                      background: isSel ? `${step.color}12` : done ? `${step.color}06` : "var(--card)",
                      minWidth: 100,
                    }}>
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: done ? `${step.color}20` : "var(--muted)" }}>
                      <SIcon className="h-5 w-5" style={{ color: done ? step.color : "var(--muted-foreground)" }} />
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-center" style={{ color: done ? "var(--foreground)" : "var(--muted-foreground)" }}>
                      Step {step.step}
                    </p>
                    <p className="text-[10px] font-semibold text-center leading-tight" style={{ color: done ? step.color : "var(--muted-foreground)" }}>{step.label}</p>
                    {done && <div className="h-1 w-1 rounded-full" style={{ background: step.color }} />}
                  </motion.div>
                  {i < gateSteps.length - 1 && (
                    <motion.div animate={{ opacity: active > i ? 1 : 0.1 }}
                      className="h-px w-4 mx-0.5"
                      style={{ background: active > i ? `linear-gradient(90deg,${step.color}80,${gateSteps[i+1].color}80)` : "var(--border)" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: 2-col grid */}
          <div className="md:hidden grid grid-cols-2 gap-3 mb-8">
            {gateSteps.map((step, i) => {
              const SIcon = step.icon;
              const done = active >= i;
              return (
                <motion.div key={step.step} onClick={() => setActiveDetail(i)}
                  initial={{ opacity: 0, y: 16 }} animate={done ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center cursor-pointer"
                  style={{ borderColor: done ? `${step.color}30` : "var(--border)", background: done ? `${step.color}08` : "var(--card)" }}>
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: done ? `${step.color}20` : "var(--muted)" }}>
                    <SIcon className="h-4 w-4" style={{ color: done ? step.color : "var(--muted-foreground)" }} />
                  </div>
                  <p className="text-[10px] font-semibold" style={{ color: done ? step.color : "var(--muted-foreground)" }}>{step.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div key={activeDetail}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto rounded-2xl border p-5 sm:p-7 text-center"
              style={{ borderColor: `${detail.color}30`, background: `${detail.color}06` }}>
              <div className="flex justify-center mb-3">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: `${detail.color}20`, border: `1px solid ${detail.color}35` }}>
                  <DIcon className="h-6 w-6" style={{ color: detail.color }} />
                </div>
              </div>
              <p className="text-[10px] font-mono mb-1" style={{ color: detail.color }}>STEP {detail.step} OF 06</p>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{detail.label}</h3>
              <p className="text-sm text-muted-foreground">{detail.desc}</p>
              {/* Step nav dots */}
              <div className="flex justify-center gap-1.5 mt-5">
                {gateSteps.map((_, i) => (
                  <button key={i} onClick={() => setActiveDetail(i)}
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: i === activeDetail ? 20 : 6, background: i === activeDetail ? detail.color : "rgba(255,255,255,0.15)" }} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   AGENT TYPES GRID
═══════════════════════════════════════════════════ */

function AgentTypesSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-4">
            Agent Types
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Build or{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              connect
            </span>{" "}
            any agent
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Native agents via no-code builder, or plug in external systems. StemmQ governs all of them.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
          {agentTypes.map((agent, i) => {
            const Icon = agent.icon;
            const isHovered = hovered === i;
            return (
              <Reveal key={agent.name} delay={i * 0.05}>
                <motion.div
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered(null)}
                  whileHover={{ y: -5 }}
                  className="relative rounded-2xl border p-4 sm:p-5 overflow-hidden cursor-default transition-all"
                  style={{
                    borderColor: isHovered ? `${agent.color}40` : "var(--border)",
                    background: isHovered ? `${agent.color}08` : "var(--card)",
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${agent.color}10, transparent 60%)` }} />
                  <div className="relative">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}25` }}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: agent.color }} />
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium mb-0.5">{agent.dept}</p>
                    <p className="text-xs sm:text-sm font-bold text-foreground mb-0.5">{agent.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* API endpoint */}
        <Reveal>
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              + Connect any external AI system via{" "}
              <code className="text-indigo-300 font-mono bg-indigo-500/10 px-2 py-0.5 rounded text-xs">POST /external-agent/decision</code>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   AGENT BUILDER — animated form
═══════════════════════════════════════════════════ */

function AgentBuilderAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timings = [400, 900, 1400, 1900, 2500, 3000, 3600];
    const timers = timings.map((t, i) => setTimeout(() => setStep(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const fields = [
    { label: "Agent Name", value: "Q4RevenueAgent", delay: 0 },
    { label: "Role", value: "Pricing Optimization", delay: 1 },
    { label: "Department", value: "Revenue", delay: 2 },
    { label: "Objective", value: "Maximize Q4 revenue while minimizing churn risk", delay: 3, tall: true },
    { label: "Decision Scope", value: "Pricing, Revenue, Contracts", delay: 4 },
    { label: "Max Risk Level", value: "Medium — auto-escalate above", badge: "#f59e0b", delay: 5 },
  ];

  return (
    <div ref={ref} className="relative">
      <div className="absolute -top-3 -right-3 z-20"><LiveBadge label="Builder" /></div>
      <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 px-4 py-3 bg-white/3 border-b border-white/6">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/5 border border-white/8 px-3 py-0.5 text-[10px] text-white/30">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              app.stemmq.com/agents/new
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-white/6 mb-4">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
              <Bot className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/80">New Agent</p>
              <p className="text-[9px] text-white/30">Configure identity and scope</p>
            </div>
          </div>
          <div className="space-y-3">
            {fields.map((f, i) => step > f.delay && (
              <motion.div key={f.label} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.35 }}>
                <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">{f.label}</p>
                <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${f.badge ? "border-amber-500/25 bg-amber-500/8 text-amber-300" : "border-white/8 bg-white/4 text-white/70"} ${f.tall ? "min-h-[44px]" : ""}`}>
                  {f.value}
                </div>
              </motion.div>
            ))}
          </div>
          {step >= 6 && (
            <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
              Create Agent →
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

function AgentBuilderSection() {
  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal direction="left">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Agent Builder</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
                Create an agent or connect{" "}
                <span style={{ background: "linear-gradient(135deg,#818cf8,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                
                </span>
              </h2>
              <p className="text-sm sm:text-base text-foreground/50 leading-relaxed mb-6">
                Define goal, permissions, and risk boundaries. Your agent starts operating immediately —
                every action flows through the Decision Gate automatically.
              </p>
              <ol className="space-y-3 mb-8">
                {[
                  "Define agent identity — name, role, department",
                  "Set objective and decision scope",
                  "Configure risk boundaries and approval thresholds",
                  "Write natural-language instruction layer",
                  "Agent begins operating — all decisions logged",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                      {i + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-foreground/55 mt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
          <Reveal delay={0.12} direction="right">
            <AgentBuilderAnimation />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   HUMAN-IN-THE-LOOP SECTION
═══════════════════════════════════════════════════ */

function HumanLoopSection() {
  const [pulseRule, setPulseRule] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPulseRule(v => (v + 1) % humanLoopRules.length), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Visual left */}
          <Reveal direction="left">
            <div className="space-y-3">
              {/* High-risk escalation card */}
              <div className="relative">
                <div className="absolute -top-3 -right-3 z-20">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[9px] font-bold text-amber-400 uppercase tracking-widest">
                    ⚑ Requires Review
                  </span>
                </div>
                <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground/80">Risk Threshold Triggered</p>
                      <p className="text-[9px] text-amber-400 font-semibold">High Risk · Escalated</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-foreground/55 mb-4 leading-relaxed">
                    SalesAgent proposes reducing enterprise contract floor to $6,000/yr (−40%).
                    Exceeds defined risk threshold. Requires human approval.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: "Approve", color: "#10b981", bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
                      { label: "Revise", color: "#6366f1", bg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" },
                      { label: "Escalate", color: "#f59e0b", bg: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
                      { label: "Reject", color: "#ef4444", bg: "bg-red-500/10 border-red-500/20 text-red-400" },
                    ].map(b => (
                      <motion.button key={b.label} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        className={`text-[10px] py-2 rounded-xl border font-bold transition-all hover:brightness-125 ${b.bg}`}>
                        {b.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auto-approved card */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <p className="text-xs font-bold text-foreground/75">Auto-Approved — Low Risk</p>
                  <span className="ml-auto text-[8px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">No human needed</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  PricingAgent launched 5% seasonal discount. Below risk threshold — executed automatically. Decision logged.
                </p>
              </div>

              {/* Rules */}
              <div className="rounded-2xl border border-border/60 bg-card/30 p-4 space-y-2">
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">Active Gate Rules</p>
                {humanLoopRules.map((rule, i) => (
                  <motion.div key={i} animate={{ borderColor: pulseRule === i ? `${rule.color}40` : "rgba(255,255,255,0.06)", background: pulseRule === i ? `${rule.color}06` : "rgba(255,255,255,0.01)" }}
                    className="flex items-start gap-3 p-2.5 rounded-xl border transition-all">
                    <div className="h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${rule.color}15`, border: `1px solid ${rule.color}30` }}>
                      <AlertTriangle className="h-2.5 w-2.5" style={{ color: rule.color }} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold text-foreground/65">{rule.trigger}</span>
                      <span className="text-[10px] text-muted-foreground"> → {rule.action}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Text right */}
          <Reveal direction="right" delay={0.1}>
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-amber-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Human-in-the-Loop</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
                Conditional,{" "}
                <span style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  not mandatory
                </span>
              </h2>
              <p className="text-sm sm:text-base text-foreground/50 leading-relaxed mb-6">
                Human review activates only when predefined thresholds are crossed — risk level,
                financial exposure, or irreversibility. Everything else executes automatically.
                No bottlenecks, no blind spots.
              </p>
              <ul className="space-y-3">
                {[
                  "Define per-agent risk tolerance with fine-grained controls",
                  "Approval workflows route to the right person automatically",
                  "Every escalated decision is fully documented",
                  "Reduce review fatigue — only the things that matter surface",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3 text-amber-400" />
                    </div>
                    <span className="text-xs sm:text-sm text-foreground/55">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   CAN / CANNOT SECTION
═══════════════════════════════════════════════════ */

function CanCannotSection() {
  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-4">
            <Lock className="h-3.5 w-3.5" /> Agent Governance
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            What agents{" "}
            <span className="text-emerald-400">can</span> — and{" "}
            <span className="text-red-400">cannot</span> — do
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Clear boundaries are what make AI agents trustworthy. StemmQ enforces these at the
            infrastructure level, not through prompting.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* CAN */}
          <Reveal direction="left">
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-5 sm:p-7 h-full">
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-foreground">Agents CAN</span>
              </div>
              <div className="space-y-3">
                {canDo.map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 p-3 rounded-xl border border-emerald-500/10 bg-emerald-500/4">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-xs sm:text-sm text-foreground/65">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* CANNOT */}
          <Reveal direction="right" delay={0.1}>
            <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent p-5 sm:p-7 h-full">
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                  <XCircle className="h-4.5 w-4.5 text-red-400" />
                </div>
                <span className="text-sm font-bold text-foreground">Agents CANNOT</span>
              </div>
              <div className="space-y-3">
                {cannotDo.map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 p-3 rounded-xl border border-red-500/10 bg-red-500/4">
                    <div className="h-5 w-5 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <XCircle className="h-3 w-3 text-red-400" />
                    </div>
                    <span className="text-xs sm:text-sm text-foreground/65">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PERFORMANCE + MULTI-AGENT ORCHESTRATION
═══════════════════════════════════════════════════ */

function PerfOrchestrationSection() {
  const [orchStep, setOrchStep] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => { setOrchStep(i); i++; if (i > 4) clearInterval(t); }, 700);
    return () => clearInterval(t);
  }, [inView]);

  const orchNodes = [
    { agent: "PricingAgent", action: "Proposes 15% Q4 discount", color: "#6366f1" },
    null,
    { agent: "MarketingAgent", action: "Triggers campaign proposal", color: "#a855f7" },
    null,
    { agent: "Decision Gate", action: "Evaluates as combined unit", color: "#f59e0b" },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Perf metrics */}
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-4">
            Performance System
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Every agent earns its{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              track record
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            Agents that perform well earn more autonomy. Agents that don't get reviewed.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-10 sm:mb-14">
          {perfMetrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <Reveal key={m.label} delay={i * 0.07}>
                <motion.div whileHover={{ y: -5 }}
                  className="rounded-2xl border border-border/60 bg-card/30 p-4 sm:p-5 text-center hover:border-border transition-all">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}>
                    <Icon className="h-5 w-5" style={{ color: m.color }} />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">{m.value}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{m.trend}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 leading-tight">{m.label}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* Multi-agent orchestration */}
        <Reveal>
          <div ref={ref} className="rounded-2xl border border-border/60 bg-card/30 p-5 sm:p-7">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                <Network className="h-4 w-4 text-indigo-400" />
              </div>
              <span className="text-sm font-bold text-foreground">Multi-Agent Orchestration</span>
              <span className="ml-auto text-[9px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">Live example</span>
            </div>

            {/* Desktop: horizontal */}
            <div className="hidden sm:flex items-center gap-3">
              {orchNodes.map((node, i) =>
                node === null ? (
                  <motion.div key={i} animate={{ opacity: orchStep > i ? 1 : 0.15 }} className="flex-shrink-0">
                    <ArrowRight className="h-4 w-4 text-white/30" />
                  </motion.div>
                ) : (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={orchStep >= i ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: "spring", duration: 0.45 }}
                    className="flex-1 rounded-xl border p-3 text-center"
                    style={{ borderColor: orchStep >= i ? `${node.color}35` : "var(--border)", background: orchStep >= i ? `${node.color}08` : "var(--card)" }}>
                    <p className="text-[10px] font-bold mb-1" style={{ color: orchStep >= i ? node.color : "var(--muted-foreground)" }}>{node.agent}</p>
                    <p className="text-[10px] text-foreground/45 leading-snug">{node.action}</p>
                  </motion.div>
                )
              )}
            </div>

            {/* Mobile: vertical */}
            <div className="sm:hidden space-y-3">
              {orchNodes.filter(Boolean).map((node, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={orchStep >= i * 2 ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4 }}
                  className="rounded-xl border p-3"
                  style={{ borderColor: `${(node as any).color}30`, background: `${(node as any).color}06` }}>
                  <p className="text-[10px] font-bold mb-0.5" style={{ color: (node as any).color }}>{(node as any).agent}</p>
                  <p className="text-[10px] text-white/45">{(node as any).action}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   AGENT MEMORY
═══════════════════════════════════════════════════ */

function AgentMemorySection() {
  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-medium text-violet-300 mb-4">
            Agent Memory
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Agents that learn from{" "}
            <span style={{ background: "linear-gradient(135deg,#8b5cf6,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              your organization
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            Every agent has local memory plus shared access to the organization's full decision dataset.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {[
            {
              icon: Eye, title: "Local Memory", color: "#6366f1", border: "border-indigo-500/20", bg: "from-indigo-500/5",
              items: ["Past decisions and their outcomes", "Performance history and accuracy trends", "Learned patterns from own decision scope", "Confidence calibration over time"],
            },
            {
              icon: Network, title: "Shared Organizational Memory", color: "#a855f7", border: "border-violet-500/20", bg: "from-violet-500/5",
              items: ["Global decision dataset across all agents and humans", "Cross-agent pattern recognition insights", "Historical outcomes used to justify new proposals", "Strategic conflict detection across the org"],
            },
          ].map(panel => {
            const Icon = panel.icon;
            return (
              <Reveal key={panel.title}>
                <div className={`rounded-2xl border ${panel.border} bg-gradient-to-br ${panel.bg} to-transparent p-5 sm:p-7 h-full`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${panel.color}15`, border: `1px solid ${panel.color}25` }}>
                      <Icon className="h-5 w-5" style={{ color: panel.color }} />
                    </div>
                    <span className="text-sm font-bold text-foreground">{panel.title}</span>
                  </div>
                  <div className="space-y-3">
                    {panel.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: `${panel.color}15`, border: `1px solid ${panel.color}25` }}>
                          <CheckCircle2 className="h-3 w-3" style={{ color: panel.color }} />
                        </div>
                        <span className="text-xs sm:text-sm text-foreground/55">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   INLINE CTA
═══════════════════════════════════════════════════ */

function InlineCTA() {
  return (
    <section className="py-14 sm:py-16 bg-background border-t border-border/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/8 to-violet-500/5 p-7 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 60%)" }} />
            <div className="relative">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
                Ready to govern your first agent?
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-7">
                Set up your first agent in under 5 minutes. The Decision Gate activates automatically.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href={ROUTES.auth}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-xl shadow-indigo-500/25 w-full sm:w-auto justify-center"
                    style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                    <span className="relative z-10 flex items-center gap-2">
                      Build Your First Agent
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </Link>
                <Link href={ROUTES.decisionIntelligence}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-foreground/60 border border-border bg-muted/30 hover:bg-muted/50 hover:text-foreground transition-all w-full sm:w-auto justify-center">
                    See Decision Gate
                  </motion.button>
                </Link>
              </div>
              <p className="text-[11px] text-foreground/20 mt-4">No credit card required · 14-day Pro trial</p>
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

export default function AIAgentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <AIAgentsHero />
      <DecisionGateSection />
      <AgentTypesSection />
      <AgentBuilderSection />
      <HumanLoopSection />
      <CanCannotSection />
      <PerfOrchestrationSection />
      <AgentMemorySection />
      <InlineCTA />
      <EnterpriseSection />
      <MarketingFooter />
    </div>
  );
}
