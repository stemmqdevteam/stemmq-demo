"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Brain, Target, Activity, Shield, BarChart3, CheckCircle,
  GitBranch, ArrowRight, TrendingUp, Layers, Zap, Database,
  Network, Lock, Star, ChevronRight, Sparkles, Eye, Clock,
  AlertCircle, CheckCircle2
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { CTASection } from "@/components/marketing/cta-section";
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
  children: React.ReactNode; delay?: number; className?: string; direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  const xInit = direction === "left" ? -30 : direction === "right" ? 30 : 0;
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: direction === "up" ? 28 : 0, x: xInit }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
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

function useCounter(end: number, duration = 1800, decimals = 0, trigger = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let s = 0; const step = end / (duration / 16);
    const t = setInterval(() => {
      s += step; if (s >= end) { setCount(end); clearInterval(t); }
      else setCount(parseFloat(s.toFixed(decimals)));
    }, 16);
    return () => clearInterval(t);
  }, [end, duration, decimals, trigger]);
  return count;
}

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */

/* Animated SDO card that builds itself field by field */
function HeroSDOCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [step, setStep] = useState(0);
  const dqs = useCounter(87, 1400, 0, step >= 5);

  useEffect(() => {
    if (!inView) return;
    const timings = [400, 900, 1400, 1900, 2500, 3100];
    const timers = timings.map((t, i) => setTimeout(() => setStep(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={ref} className="relative">
      <div className="absolute -top-3 -right-3 z-20"><LiveBadge label="Building SDO" /></div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-black/60">
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/3 border-b border-white/6">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/5 border border-white/8 px-3 py-0.5 text-[10px] text-white/30">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              app.stemmq.com/decisions/sdo-147
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">Structured Decision Object</span>
            {step >= 6 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-2.5 py-1 rounded-full">
                <Sparkles className="h-3 w-3" /> DQS {dqs}
              </motion.div>
            )}
          </div>

          {[
            { label: "Title", value: "Expand into EMEA market Q1 2026", delay: 0 },
            { label: "Strategic Intent", value: "Growth — New Market Entry", badge: "emerald", delay: 1 },
            { label: "Owner", value: "Sarah Chen · VP Strategy", delay: 2 },
            { label: "Impact Weight", value: "DIW 9.2 / 10 · High priority", badge: "indigo", delay: 3 },
          ].map((f, i) => step > f.delay && (
            <motion.div key={f.label} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.35 }}>
              <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">{f.label}</p>
              <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                f.badge === "emerald" ? "border-emerald-500/25 bg-emerald-500/8 text-emerald-300"
                : f.badge === "indigo" ? "border-indigo-500/25 bg-indigo-500/8 text-indigo-300"
                : "border-white/8 bg-white/4 text-white/70"
              }`}>{f.value}</div>
            </motion.div>
          ))}

          {/* Assumptions */}
          {step >= 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Assumptions (3)</p>
              <div className="space-y-1.5">
                {[
                  { text: "EMEA TAM > $50M", status: "Validated", color: "text-emerald-400 bg-emerald-500/8 border-emerald-500/20" },
                  { text: "6-month ramp time sufficient", status: "Pending", color: "text-amber-400 bg-amber-500/8 border-amber-500/20" },
                  { text: "Regulatory approval in 8 weeks", status: "Pending", color: "text-white/35 bg-white/4 border-white/8" },
                ].map((a, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                    className={`flex items-center justify-between rounded-lg border px-3 py-1.5 ${a.color}`}>
                    <span className="text-[10px] text-white/65">{a.text}</span>
                    <span className={`text-[9px] font-semibold ${a.color.split(" ")[0]}`}>{a.status}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* DQS progress */}
          {step >= 5 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-1">
              <div className="flex justify-between text-[9px] text-white/30 mb-1.5">
                <span>Decision Quality Score</span><span>{dqs}/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#6366f1,#a855f7)" }}
                  initial={{ width: 0 }} animate={{ width: `${dqs}%` }} transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function DecisionIntelligenceHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[95vh] flex items-center overflow-hidden bg-background">
      <AnimatedGradient intensity="medium" />
      <Orb delay={0} className="absolute top-[-8%] left-[-3%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <Orb delay={4} className="absolute bottom-[-8%] right-[-3%] w-[420px] h-[420px] rounded-full bg-violet-600/8 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-5 backdrop-blur-sm">
                <Brain className="h-3.5 w-3.5" /> Decision Intelligence
              </span>
            </Reveal>
            <Reveal delay={0.07}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.06] mb-5">
                A Decision Object is the{" "}
                <span style={{ background: "linear-gradient(135deg,#818cf8 0%,#6366f1 45%,#a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  atom
                </span>{" "}
                of strategic work
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mb-8">
                Every decision in StemmQ becomes a Structured Decision Object — with intent, owner,
                assumptions, risk score, and outcome tracking built in from day one.
                No decision hides. Nothing flies blind.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href={ROUTES.auth}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-xl shadow-indigo-500/25 w-full sm:w-auto justify-center"
                    style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                    <span className="relative z-10 flex items-center gap-2">
                      Start Structuring Decisions
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </Link>
              </div>
            </Reveal>

            {/* Mini stat row */}
            <Reveal delay={0.26}>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {[
                  { v: "87", label: "avg DQS score", color: "#6366f1" },
                  { v: "34%", label: "accuracy lift", color: "#10b981" },
                  { v: "8 wks", label: "to first insight", color: "#a855f7" },
                ].map(s => (
                  <div key={s.label} className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold tabular-nums" style={{ color: s.color }}>{s.v}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{s.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — animated SDO card */}
          <Reveal delay={0.18} direction="right">
            <HeroSDOCard />
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SDO ANATOMY SECTION
   Dark panel, every field animated in
═══════════════════════════════════════════════════ */

const sdoFields = [
  { label: "Title", value: "Expand into EMEA market Q1 2026", note: "The decision in one sentence — clear enough to audit in 12 months.", color: "#6366f1" },
  { label: "Strategic Intent", value: "Growth — New Market Entry", note: "One of 5 classifications. Drives scoring weight and gate rules.", color: "#10b981" },
  { label: "Owner", value: "Sarah Chen · VP Strategy", note: "Single DRI. No owner = no accountability.", color: "#3b82f6" },
  { label: "Assumptions (6)", value: "4 Validated · 2 Pending", note: "Every decision must declare its assumptions. No assumption = blocked.", color: "#f59e0b" },
  { label: "Decision Quality Score", value: "87 / 100", note: "Composite of assumption coverage, data quality, and historical accuracy.", color: "#8b5cf6" },
  { label: "Decision Impact Weight", value: "DIW 9.2 / 10", note: "Priority score for cross-initiative comparison and resource allocation.", color: "#a855f7" },
  { label: "Status", value: "Active", note: "Lifecycle state: Draft → Active → Executed → Closed.", color: "#06b6d4" },
];

function SDOAnatomySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-4">
            SDO Anatomy
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Every field exists{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              for a reason
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            No optional fields that matter. Each one enforces the discipline that makes decisions compound over time.
          </p>
        </Reveal>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-5xl mx-auto">
          {/* Field list */}
          <div className="space-y-2">
            {sdoFields.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onClick={() => setActive(active === i ? null : i)}
                className={`group rounded-xl border px-4 py-3 cursor-pointer transition-all ${
                  active === i
                    ? "border-indigo-500/40 bg-indigo-500/8"
                    : "border-border/60 bg-card/30 hover:border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: f.color }} />
                    <span className="text-xs font-semibold text-muted-foreground flex-shrink-0">{f.label}</span>
                  </div>
                  <span className="text-xs text-foreground/80 font-medium truncate text-right">{f.value}</span>
                </div>
                <AnimatePresence>
                  {active === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-[11px] text-muted-foreground mt-2 leading-relaxed pl-5"
                    >
                      {f.note}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Visual right: animated donut + breakdown */}
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-border/60 bg-card/30 p-5 sm:p-6">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-5">SDO Health Score</p>
              <div className="flex items-center gap-6 mb-6">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                    <motion.circle cx="18" cy="18" r="14" fill="none" stroke="url(#dqsg)" strokeWidth="2.5"
                      strokeDasharray="0 100" strokeLinecap="round"
                      animate={inView ? { strokeDasharray: "87 100" } : {}}
                      transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }} />
                    <defs>
                      <linearGradient id="dqsg" x1="0" y1="0" x2="1" y2="0">
                        <stop stopColor="#6366f1" /><stop offset="1" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">87</span>
                    <span className="text-[8px] text-white/30">DQS</span>
                  </span>
                </div>
                <div className="space-y-2 flex-1">
                  {[
                    { label: "Assumption Coverage", val: 88, color: "#6366f1" },
                    { label: "Data Quality", val: 75, color: "#8b5cf6" },
                    { label: "Historical Accuracy", val: 91, color: "#10b981" },
                    { label: "Confidence Level", val: 82, color: "#f59e0b" },
                  ].map(c => (
                    <div key={c.label}>
                      <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                        <span>{c.label}</span><span>{c.val}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/6 overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: c.color }}
                          initial={{ width: 0 }} animate={inView ? { width: `${c.val}%` } : {}}
                          transition={{ delay: 0.8, duration: 0.9, ease: "easeOut" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border/40 bg-muted/20 p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Click any field row to learn why it matters</p>
                <p className="text-[9px] text-indigo-400/60">↑ {sdoFields.length} fields · all required · all auditable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PIPELINE SECTION — animated step-by-step
═══════════════════════════════════════════════════ */

const pipelineSteps = [
  { step: "01", label: "Intent Capture", icon: Target, color: "#6366f1",
    desc: "Every decision starts with explicit intent. Who owns it? What outcome are they driving? What assumptions does it rest on?",
    detail: "Decisions without explicit intent can't be evaluated. StemmQ forces clarity before a decision can be saved.",
  },
  { step: "02", label: "Assumption Validation", icon: CheckCircle, color: "#10b981",
    desc: "Each assumption is weighted, tracked, and validated against real outcomes. No decision hides on unexamined beliefs.",
    detail: "Impact-weighted from 1–5. Every assumption moves from Pending → Validated or Invalidated as reality unfolds.",
  },
  { step: "03", label: "Risk & Pattern Modeling", icon: Shield, color: "#f59e0b",
    desc: "The decision runs through pattern recognition, historical accuracy checks, and risk modeling before scoring.",
    detail: "The system checks your decision against all prior decisions in org memory — surfacing blind spots automatically.",
  },
  { step: "04", label: "Decision Gate", icon: GitBranch, color: "#a855f7",
    desc: "Approved decisions execute. Risky ones escalate. Rejected ones are documented with reasoning for the organizational memory.",
    detail: "The Gate is configurable. Set risk thresholds, approval chains, and human-in-the-loop triggers per decision type.",
  },
  { step: "05", label: "Outcome Tracking", icon: TrendingUp, color: "#3b82f6",
    desc: "What actually happened? Was the forecast accurate? Which assumptions held? The system learns from every single decision.",
    detail: "Closed decisions feed back into the pattern engine. Your org gets smarter with every data point.",
  },
];

function PipelineSection() {
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => { i++; if (i < pipelineSteps.length) setActiveStep(i); else clearInterval(t); }, 800);
    return () => clearInterval(t);
  }, [inView]);

  const step = pipelineSteps[activeStep];
  const Icon = step.icon;

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-4">
            Decision Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            From intent to outcome —{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              fully tracked
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Every decision moves through a structured lifecycle. Nothing skips steps. Everything is auditable.
          </p>
        </Reveal>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4">
          {/* Steps column (mobile: vertical list, desktop: left column spanning 2) */}
          <div className="lg:col-span-2 space-y-2">
            {pipelineSteps.map((s, i) => {
              const SIcon = s.icon;
              const isActive = activeStep === i;
              const isPast = i < activeStep;
              return (
                <motion.div
                  key={s.step}
                  onClick={() => setActiveStep(i)}
                  whileHover={{ x: 4 }}
                  animate={{ opacity: isPast ? 0.55 : 1 }}
                  className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                    isActive
                      ? "border-white/20 bg-white/5"
                      : "border-border/40 bg-card/30 hover:border-border/60"
                  }`}
                  style={isActive ? { borderColor: `${s.color}40`, background: `${s.color}08` } : {}}
                >
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: isActive ? `${s.color}20` : "var(--muted)", border: `1px solid ${isActive ? s.color + "40" : "var(--border)"}` }}>
                    <SIcon className="h-4 w-4" style={{ color: isActive ? s.color : "var(--muted-foreground)" }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-mono" style={{ color: isActive ? s.color : "var(--muted-foreground)" }}>{s.step}</span>
                      <span className={`text-xs font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug hidden sm:block">{s.desc.slice(0, 55)}…</p>
                  </div>
                  {isActive && <motion.div layoutId="step-dot" className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: s.color }} />}
                </motion.div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl border p-6 sm:p-8 h-full"
                style={{ borderColor: `${step.color}30`, background: `linear-gradient(135deg, ${step.color}08, rgba(255,255,255,0.01))` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-2xl flex items-center justify-center" style={{ background: `${step.color}20`, border: `1px solid ${step.color}30` }}>
                    <Icon className="h-5 w-5" style={{ color: step.color }} />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono mb-0.5" style={{ color: step.color }}>{step.step} OF 05</p>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">{step.label}</h3>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-foreground/60 leading-relaxed mb-4">{step.desc}</p>
                <div className="rounded-xl border border-border/60 bg-card/30 p-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
                </div>
                {/* Progress dots */}
                <div className="flex items-center gap-2 mt-6">
                  {pipelineSteps.map((_, i) => (
                    <div key={i} className="h-1 rounded-full transition-all" style={{
                      width: i === activeStep ? 20 : 6,
                      background: i === activeStep ? step.color : i < activeStep ? `${step.color}50` : "var(--border)",
                    }} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   DQS BREAKDOWN SECTION
═══════════════════════════════════════════════════ */

function DQSSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const score = useCounter(87, 1600, 0, inView);

  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Visual left */}
          <Reveal direction="left">
            <div ref={ref} className="flex flex-col items-center">
              {/* Big donut */}
              <div className="relative h-40 w-40 sm:h-52 sm:w-52 mb-8">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                  <motion.circle cx="18" cy="18" r="14" fill="none" stroke="url(#dqsbig)" strokeWidth="2"
                    strokeDasharray="0 100" strokeLinecap="round"
                    animate={inView ? { strokeDasharray: "87 100" } : {}}
                    transition={{ duration: 2, delay: 0.3, ease: "easeOut" }} />
                  <defs>
                    <linearGradient id="dqsbig" x1="0" y1="0" x2="1" y2="0">
                      <stop stopColor="#6366f1" /><stop offset="1" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-bold text-foreground tabular-nums">{score}</span>
                  <span className="text-xs text-muted-foreground mt-1">DQS Score</span>
                </div>
              </div>

              {/* Component bars */}
              <div className="w-full max-w-sm space-y-3">
                {[
                  { label: "Assumption Coverage", pct: 35, val: 88, color: "#6366f1" },
                  { label: "Data Quality", pct: 30, val: 75, color: "#8b5cf6" },
                  { label: "Historical Accuracy", pct: 20, val: 91, color: "#10b981" },
                  { label: "Confidence Level", pct: 15, val: 82, color: "#f59e0b" },
                ].map((c, i) => (
                  <div key={c.label} className="rounded-xl border border-border/40 bg-muted/20 p-3">
                    <div className="flex justify-between text-[10px] mb-2">
                      <span className="text-foreground/50 font-medium">{c.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{c.pct}% weight</span>
                        <span className="font-bold" style={{ color: c.color }}>{c.val}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: c.color }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${c.val}%` } : {}}
                        transition={{ delay: 0.5 + i * 0.15, duration: 0.9, ease: "easeOut" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Text right */}
          <Reveal direction="right" delay={0.1}>
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-indigo-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Decision Quality Score</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
                Quality isn't a feeling —{" "}
                <span style={{ background: "linear-gradient(135deg,#818cf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  it's a number
                </span>
              </h2>
              <p className="text-sm sm:text-base text-foreground/50 leading-relaxed mb-6">
                DQS is a composite score measuring assumption coverage, data quality, historical accuracy,
                and confidence. It tells you exactly how strong a decision is before you commit.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "High DQS decisions execute faster with less friction",
                  "Low DQS triggers assumption review before approval",
                  "DQS improves over time as your decision history grows",
                  "Compare DQS across teams, agents, and time periods",
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                    </div>
                    <span className="text-xs sm:text-sm text-foreground/55">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 sm:p-5">
                <p className="text-sm font-semibold text-foreground/80 mb-1">
                  "Organizations that track decision quality improve it by{" "}
                  <span className="text-indigo-300">34% within 6 months.</span>"
                </p>
                <p className="text-xs text-muted-foreground">StemmQ platform data, 2024</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   COMPOUNDING EFFECT SECTION
   Timeline cards that animate in + chart
═══════════════════════════════════════════════════ */

const timeline = [
  {
    period: "Month 0", dqs: 42, tag: "Getting Started",
    assumptions: "Rarely captured", description: "Ad-hoc decisions, no tracking",
    color: "#6366f1",
    events: ["First 10 SDOs created", "Assumption format learned", "Baseline DQS established"],
  },
  {
    period: "Month 3", dqs: 68, tag: "Momentum Building",
    assumptions: "Consistently validated", description: "Patterns emerging, DQS improving",
    color: "#8b5cf6",
    events: ["Pattern engine activating", "Team calibration visible", "Forecast accuracy rising"],
  },
  {
    period: "Month 12", dqs: 91, tag: "Compounding Intelligence",
    assumptions: "Predictive accuracy 87%", description: "Compounding intelligence in every decision",
    color: "#a855f7",
    events: ["Board-level audit trails", "Agent decisions governed", "34% accuracy improvement"],
  },
];

const sparklineData = [42, 46, 51, 55, 58, 62, 65, 68, 71, 74, 77, 80, 83, 85, 88, 91];

function CompoundingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const max = Math.max(...sparklineData), min = Math.min(...sparklineData);
  const pts = sparklineData.map((v, i) => {
    const x = (i / (sparklineData.length - 1)) * 100;
    const y = 100 - ((v - min) / (max - min)) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-medium text-violet-300 mb-4">
            <TrendingUp className="h-3.5 w-3.5" /> The Compounding Effect
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Decisions get better the more{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              you make
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            The more decisions you capture, the smarter every future decision becomes.
          </p>
        </Reveal>

        {/* Sparkline chart */}
        <Reveal delay={0.1} className="mb-10 sm:mb-14">
          <div ref={ref} className="rounded-2xl border border-border/60 bg-card/30 p-5 sm:p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-foreground/60">DQS Trajectory</p>
                <p className="text-[10px] text-muted-foreground">Month 0 → Month 12</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">42</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-bold text-violet-300">91</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full ml-1">+116%</span>
              </div>
            </div>
            <div className="relative h-24 sm:h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="compound-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.polyline points={pts} fill="none" stroke="url(#compound-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  pathLength="0"
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  style={{ strokeDasharray: "1", strokeDashoffset: 0 }}
                />
                <defs>
                  <linearGradient id="compound-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop stopColor="#6366f1" /><stop offset="1" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Month labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-muted-foreground">
                <span>M0</span><span>M3</span><span>M6</span><span>M9</span><span>M12</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Timeline cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {timeline.map((item, i) => (
            <Reveal key={item.period} delay={i * 0.1}>
              <motion.div
                onHoverStart={() => setHoveredCard(i)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ y: -6 }}
                className="relative rounded-2xl border p-5 sm:p-6 overflow-hidden transition-all cursor-default h-full"
                style={{
                  borderColor: hoveredCard === i ? `${item.color}40` : "var(--border)",
                  background: hoveredCard === i ? `${item.color}06` : "var(--card)",
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none transition-opacity"
                  style={{ background: item.color, opacity: hoveredCard === i ? 0.15 : 0 }} />

                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}25` }}>
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">{item.period}</span>
                </div>

                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-4xl sm:text-5xl font-bold text-foreground tabular-nums">{item.dqs}</span>
                  <span className="text-xs text-muted-foreground mb-1.5">DQS avg</span>
                </div>
                <div className="h-px bg-border/40 my-3" />

                <div className="space-y-2">
                  {item.events.map((e, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-[10px] sm:text-xs text-muted-foreground">{e}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ORG MEMORY SECTION — new addition
═══════════════════════════════════════════════════ */

function OrgMemorySection() {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPulse(v => (v + 1) % 5), 1200);
    return () => clearInterval(t);
  }, []);

  const nodes = [
    { label: "EMEA Expansion", x: 50, y: 20, color: "#6366f1", size: 14 },
    { label: "Series B Strategy", x: 20, y: 50, color: "#a855f7", size: 12 },
    { label: "Hiring Plan", x: 78, y: 45, color: "#3b82f6", size: 11 },
    { label: "Market Pricing", x: 35, y: 75, color: "#10b981", size: 10 },
    { label: "Product Roadmap", x: 65, y: 72, color: "#f59e0b", size: 12 },
    { label: "Risk Model", x: 50, y: 50, color: "#8b5cf6", size: 16 },
  ];
  const edges = [[0,5],[1,5],[2,5],[3,5],[4,5],[1,3],[2,4],[0,2]];

  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal>
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                  <Network className="h-4 w-4 text-violet-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Decision Graph</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
                Your organization's{" "}
                <span style={{ background: "linear-gradient(135deg,#8b5cf6,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  strategic memory
                </span>
              </h2>
              <p className="text-sm sm:text-base text-foreground/50 leading-relaxed mb-6">
                Every decision is connected to every other decision. The Decision Graph shows
                how choices compound, conflict, or depend on each other — giving leadership a
                living map of organizational strategy.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Surface conflicting decisions across teams automatically",
                  "Trace assumptions across related decisions",
                  "Query the full decision history in natural language",
                  "Identify strategic blind spots before they become crises",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3 text-violet-400" />
                    </div>
                    <span className="text-xs sm:text-sm text-foreground/55">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Animated graph */}
          <Reveal delay={0.12} direction="right">
            <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden p-4 sm:p-5 shadow-2xl shadow-black/50">
              <div className="absolute -top-3 -right-3 z-20"><LiveBadge label="Decision Graph" /></div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4 font-semibold">Org Decision Network</p>
              <div className="relative h-56 sm:h-64">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Edges */}
                  {edges.map(([a, b], i) => (
                    <motion.line
                      key={i}
                      x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
                      x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
                      stroke="rgba(99,102,241,0.2)" strokeWidth="0.4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.15 }}
                    />
                  ))}
                  {/* Nodes */}
                  {nodes.map((n, i) => (
                    <motion.g key={n.label}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1, type: "spring" }}>
                      <circle cx={`${n.x}%`} cy={`${n.y}%`} r={n.size / 10 + "%"}
                        fill={`${n.color}20`} stroke={n.color} strokeWidth="0.4"
                        className={pulse === i ? "opacity-100" : "opacity-60"}
                      />
                      {pulse === i && (
                        <circle cx={`${n.x}%`} cy={`${n.y}%`} r={(n.size / 10 + 0.5) + "%"}
                          fill="none" stroke={n.color} strokeWidth="0.3" opacity="0.4" />
                      )}
                    </motion.g>
                  ))}
                </svg>
                {/* Labels overlay */}
                <div className="absolute inset-0">
                  {nodes.map((n, i) => (
                    <div key={n.label} className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${n.x}%`, top: `${n.y}%` }}>
                      <span className="text-[8px] text-white/50 whitespace-nowrap bg-[#0a0f1e]/80 px-1 rounded">{n.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[9px] text-white/25">
                <span>6 decisions · 8 connections</span>
                <span className="text-violet-400">Query in natural language →</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   BOTTOM CTA STRIP
═══════════════════════════════════════════════════ */

function InlineCTA() {
  return (
    <section className="py-14 sm:py-16 bg-background border-t border-border/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/8 to-violet-500/5 p-7 sm:p-10 text-center overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 60%)",
            }} />
            <div className="relative">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
                Ready to make your first structured decision?
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-7">
                Start free. No credit card. See your first DQS score in under 10 minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href={ROUTES.auth}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-xl shadow-indigo-500/25 w-full sm:w-auto justify-center"
                    style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                    <span className="relative z-10 flex items-center gap-2">
                      Start Structuring Decisions
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </Link>
                <Link href={ROUTES.product}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-foreground/60 border border-border bg-muted/30 hover:bg-muted/50 hover:text-foreground transition-all w-full sm:w-auto justify-center">
                    Explore the Platform
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

export default function DecisionIntelligencePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <DecisionIntelligenceHero />
      <SDOAnatomySection />
      <PipelineSection />
      <DQSSection />
      <CompoundingSection />
      <OrgMemorySection />
      <InlineCTA />
      <MarketingFooter />
    </div>
  );
}