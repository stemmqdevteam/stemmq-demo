"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  GitBranch, Target, Activity, ArrowRight, Bot, Brain,
  CheckCircle2, AlertCircle, Clock, Zap, TrendingUp,
  Shield, ChevronRight, Play, Sparkles, Database,
  BarChart3, Network, Lock, Star, Users
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { CTASection } from "@/components/marketing/cta-section";
import { WorkflowSection } from "@/components/marketing/workflow-section";
import { AnimatedGradient } from "@/components/animations/animated-gradient";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   SHARED PRIMITIVES
═══════════════════════════════════════════════════ */

function useCounter(end: number, duration = 2000, decimals = 0, trigger = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(parseFloat(start.toFixed(decimals)));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, decimals, trigger]);
  return count;
}

/* Floating ambient orb */
function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [-15, 15, -15], x: [-8, 8, -8] }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    />
  );
}

/* Section fade-in wrapper */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* GIF-style animated placeholder — looping CSS animation that mimics live data */
function LiveGifBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
      </span>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   HERO — Product Page
═══════════════════════════════════════════════════ */

/* Animated typewriter cycling through decision types */
const rotatingWords = ["Growth", "Defense", "Efficiency", "Experiment", "Risk Mitigation"];

function RotatingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % rotatingWords.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={idx}
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
        transition={{ duration: 0.4 }}
        className="inline-block"
        style={{
          background: "linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #a855f7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {rotatingWords[idx]}
      </motion.span>
    </AnimatePresence>
  );
}

/* Animated pipeline node row for hero bottom */
const pipelineNodes = [
  { label: "Capture", icon: Database, color: "#6366f1" },
  { label: "Calibrate", icon: Target, color: "#8b5cf6" },
  { label: "Simulate", icon: BarChart3, color: "#3b82f6" },
  { label: "Gate", icon: Shield, color: "#a855f7" },
  { label: "Execute", icon: Zap, color: "#06b6d4" },
  { label: "Learn", icon: Brain, color: "#10b981" },
];

function PipelineViz() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % pipelineNodes.length), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center justify-center gap-0 overflow-x-auto scrollbar-none px-2">
      {pipelineNodes.map((node, i) => {
        const Icon = node.icon;
        const isActive = active === i;
        const isPast = i < active;
        return (
          <div key={node.label} className="flex items-center flex-shrink-0">
            <motion.div
              animate={{
                scale: isActive ? 1.12 : 1,
                borderColor: isActive ? node.color : isPast ? `${node.color}60` : "var(--border)",
                backgroundColor: isActive ? `${node.color}18` : isPast ? `${node.color}08` : "var(--card)",
              }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border cursor-pointer select-none"
              style={{ minWidth: 72 }}
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{
                  background: isActive ? `${node.color}25` : isPast ? `${node.color}10` : "var(--muted)",
                }}
              >
                <Icon className="h-4 w-4 transition-colors" style={{ color: isActive ? node.color : isPast ? `${node.color}80` : "var(--muted-foreground)" }} />
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-wider transition-colors" style={{ color: isActive ? node.color : isPast ? "var(--foreground)" : "var(--muted-foreground)" }}>
                {node.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="active-dot"
                  className="h-1 w-1 rounded-full"
                  style={{ background: node.color }}
                />
              )}
            </motion.div>
            {i < pipelineNodes.length - 1 && (
              <motion.div
                animate={{ opacity: isPast ? 1 : 0.15, scaleX: isPast ? 1 : 0.5 }}
                transition={{ duration: 0.5 }}
                className="h-px w-4 sm:w-6 origin-left"
                style={{ background: `linear-gradient(90deg, ${node.color}80, ${pipelineNodes[i + 1]?.color}80)` }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProductHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden min-h-[92vh] flex items-center justify-center pt-28 pb-20 bg-background">
      <AnimatedGradient intensity="medium" />

      {/* Orbs */}
      <Orb delay={0} className="absolute top-[-5%] left-[-3%] w-[480px] h-[480px] rounded-full bg-indigo-600/10 blur-[110px] pointer-events-none" />
      <Orb delay={3} className="absolute bottom-[-5%] right-[-3%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[90px] pointer-events-none" />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "60px 60px" }}
      />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center w-full">

        {/* Badge */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-6 backdrop-blur-sm">
            <Brain className="h-3.5 w-3.5" />
            Decision Intelligence Infrastructure
          </span>
        </Reveal>

        {/* Headline */}
        <Reveal delay={0.08}>
          <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.06] mb-5">
            Infrastructure that makes<br className="hidden sm:block" /> decisions{" "}
            <RotatingWord />
          </h1>
        </Reveal>

        {/* Sub */}
        <Reveal delay={0.16}>
          <p className="mx-auto max-w-xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
            StemmQ replaces ad-hoc decisions with a structured, auditable, intelligent system
            that gets smarter with every call your organization makes.
          </p>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={0.22}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 sm:mb-16">
            <Link href={ROUTES.auth}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white overflow-hidden shadow-2xl shadow-indigo-500/30"
                style={{ background: "linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Building <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </motion.button>
            </Link>
            <Link href="#overview">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-foreground/65 border border-border/50 bg-muted/30 hover:bg-muted/50 hover:text-foreground transition-all backdrop-blur-sm"
              >
                <div className="h-6 w-6 rounded-full bg-muted/50 flex items-center justify-center">
                  <Play className="h-2.5 w-2.5 fill-current" />
                </div>
                See the System
              </motion.button>
            </Link>
          </div>
        </Reveal>

        {/* Pipeline viz — animated "GIF-like" flow */}
        <Reveal delay={0.3}>
          <div className="mx-auto max-w-3xl">
            <p className="text-[10px] text-foreground/30 uppercase tracking-widest mb-4">The Decision Lifecycle</p>
            <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-4 sm:p-5">
              <PipelineViz />
            </div>
            <p className="text-[10px] text-foreground/30 mt-3">Watching a decision move through StemmQ in real-time</p>
          </div>
        </Reveal>

      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION 1 — CAPTURE (SDO)
   GIF rec: animated form filling + DQS counter climbing
═══════════════════════════════════════════════════ */

function SDOFormAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timings = [600, 1200, 1900, 2600, 3300, 4000];
    const timers = timings.map((t, i) => setTimeout(() => setStep(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const dqs = useCounter(87, 1200, 0, step >= 5);

  const fields = [
    { label: "Title", value: "Expand into EMEA market Q1 2026", delay: 0 },
    { label: "Strategic Intent", value: "Growth", badge: true, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", delay: 1 },
    { label: "Owner", value: "Alexandra Rivera · VP Strategy", delay: 2 },
  ];

  const assumptions = [
    { text: "EMEA TAM exceeds $50M", status: "Validated", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", delay: 3 },
    { text: "6-month ramp time sufficient", status: "Pending", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", delay: 4 },
    { text: "Regulatory approval within 8 weeks", status: "Pending", color: "text-white/40 bg-white/5 border-white/10", delay: 4 },
  ];

  return (
    <div ref={ref} className="relative">
      {/* GIF label */}
      <div className="absolute -top-3 -right-3 z-20">
        <LiveGifBadge label="Live Preview" />
      </div>

      {/* Browser chrome */}
      <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-black/50">
        {/* Chrome bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/3 border-b border-white/6">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/5 border border-white/8 px-3 py-0.5 text-[10px] text-white/30">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              app.stemmq.com/decisions/new
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          {/* Page title */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">New Decision Object</span>
            {step >= 5 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-2.5 py-1 rounded-full"
              >
                <Sparkles className="h-3 w-3" />
                DQS {dqs} / 100
              </motion.div>
            )}
          </div>

          {/* Fields */}
          {fields.map((f, i) => (
            <AnimatePresence key={f.label}>
              {step > f.delay && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-[9px] text-white/35 uppercase tracking-wider mb-1">{f.label}</p>
                  <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${f.badge ? f.color + " border" : "border-white/10 bg-white/5 text-white/80"}`}>
                    {f.value}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}

          {/* Assumptions */}
          {step >= 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <p className="text-[9px] text-white/35 uppercase tracking-wider mb-2">Assumptions ({assumptions.length})</p>
              <div className="space-y-1.5">
                {assumptions.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.35 }}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 ${a.color}`}
                  >
                    <span className="text-[10px] text-white/70 flex-1">{a.text}</span>
                    <span className={`text-[9px] font-semibold ml-2 flex-shrink-0 ${a.color.split(" ")[0]}`}>{a.status}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* DQS bar */}
          {step >= 5 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-1">
              <div className="flex items-center justify-between text-[9px] text-white/35 mb-1.5">
                <span>Decision Quality Score</span>
                <span>{dqs}/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#6366f1,#a855f7)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${dqs}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION 2 — CALIBRATE (Assumptions)
   GIF rec: assumption status changing live, forecast meter
═══════════════════════════════════════════════════ */

const assumptionRows = [
  { text: "EMEA TAM > $50M", weight: 5, statuses: ["Pending", "Validated"], color: { Pending: "text-amber-400 bg-amber-500/10 border-amber-500/25", Validated: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" } },
  { text: "6-month ramp sufficient", weight: 4, statuses: ["Pending", "Challenged"], color: { Pending: "text-amber-400 bg-amber-500/10 border-amber-500/25", Challenged: "text-red-400 bg-red-500/10 border-red-500/25" } },
  { text: "Regulatory approval in 8 wks", weight: 3, statuses: ["Pending", "Pending"], color: { Pending: "text-white/40 bg-white/5 border-white/10" } },
  { text: "Local partner exists in region", weight: 5, statuses: ["Validated", "Validated"], color: { Validated: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" } },
];

function AssumptionTrackerAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setTick(v => (v + 1) % 4), 1800);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <div ref={ref} className="relative">
      <div className="absolute -top-3 -right-3 z-20"><LiveGifBadge label="Auto-updating" /></div>

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
              app.stemmq.com/assumptions
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Assumption Tracker</span>
            <div className="flex items-center gap-2 text-[9px] text-white/30">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live calibration
            </div>
          </div>

          <div className="space-y-2">
            {assumptionRows.map((row, i) => {
              const currentStatus = row.statuses[tick % row.statuses.length] ?? "Pending";
              const colorClass = (row.color as unknown as Record<string, string>)[currentStatus] ?? "text-white/40 bg-white/5 border-white/10";
              return (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 hover:border-white/15 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-white/75 font-medium truncate">{row.text}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(d => (
                        <div key={d} className={`h-1.5 w-1.5 rounded-full transition-colors ${d <= row.weight ? "bg-indigo-500" : "bg-white/10"}`} />
                      ))}
                      <span className="text-[9px] text-white/25 ml-1">weight {row.weight}</span>
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentStatus + i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                      className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border flex-shrink-0 ${colorClass}`}
                    >
                      {currentStatus}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Forecast accuracy meter */}
          <div className="mt-4 rounded-xl border border-white/8 bg-white/3 p-3">
            <div className="flex items-center justify-between text-[9px] text-white/35 mb-2">
              <span>Forecast Reliability · Team</span>
              <span className="text-white/60 font-semibold">84.1%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#6366f1,#3b82f6)" }}
                initial={{ width: 0 }}
                animate={{ width: "84.1%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION 3 — SIMULATE
   GIF rec: bars animate, probability fills, outcome cards flip
═══════════════════════════════════════════════════ */

function SimulationAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setRun(true), 400);
    return () => clearTimeout(t);
  }, [inView]);

  const bars = [12, 22, 38, 55, 72, 85, 91, 88, 79, 64, 45, 28, 14];
  const outcomes = [
    { label: "Conservative", prob: 22, color: "#f59e0b", bg: "bg-amber-500/10 border-amber-500/25 text-amber-400" },
    { label: "Base Case", prob: 61, color: "#6366f1", bg: "bg-indigo-500/10 border-indigo-500/25 text-indigo-300" },
    { label: "Optimistic", prob: 17, color: "#10b981", bg: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" },
  ];

  return (
    <div ref={ref} className="relative">
      <div className="absolute -top-3 -right-3 z-20"><LiveGifBadge label="Simulation" /></div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 px-4 py-3 bg-white/3 border-b border-white/6">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/5 border border-white/8 px-3 py-0.5 text-[10px] text-white/30">
              <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              app.stemmq.com/simulations
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Monte Carlo · 10,000 runs</span>
            {run && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[9px] text-violet-400 font-semibold border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 rounded-full"
              >
                Complete ✓
              </motion.span>
            )}
          </div>

          {/* Distribution chart */}
          <div className="rounded-xl bg-white/3 border border-white/8 p-3">
            <p className="text-[9px] text-white/30 mb-3">Outcome Distribution</p>
            <div className="flex items-end gap-0.5 h-24">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  initial={{ height: 0 }}
                  animate={run ? { height: `${h}%` } : { height: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                  style={{
                    background: i >= 5 && i <= 7
                      ? "linear-gradient(to top, #6366f1, #a855f7)"
                      : `rgba(99,102,241,${0.15 + (h / 91) * 0.2})`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Outcome cards */}
          <div className="grid grid-cols-3 gap-2">
            {outcomes.map((o, i) => (
              <motion.div
                key={o.label}
                initial={{ opacity: 0, y: 10 }}
                animate={run ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + i * 0.15 }}
                className={`rounded-xl border p-3 text-center ${o.bg}`}
              >
                <motion.p
                  className="text-xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={run ? { opacity: 1 } : {}}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  {o.prob}%
                </motion.p>
                <p className="text-[9px] font-semibold mt-0.5">{o.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Sensitivity bars */}
          <div className="rounded-xl bg-white/3 border border-white/8 p-3 space-y-2">
            <p className="text-[9px] text-white/30 mb-2">Key Sensitivity Drivers</p>
            {[
              { label: "Market TAM accuracy", val: 78, color: "#6366f1" },
              { label: "Ramp time estimate", val: 62, color: "#8b5cf6" },
              { label: "Regulatory timeline", val: 45, color: "#3b82f6" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-[9px] text-white/30 mb-1">
                  <span>{s.label}</span><span>{s.val}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                    initial={{ width: 0 }}
                    animate={run ? { width: `${s.val}%` } : {}}
                    transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION 4 — DECISION GATE
   Full animated gate flow
═══════════════════════════════════════════════════ */

const gateSteps = [
  { label: "Agent Intent", icon: Bot, color: "#6366f1", desc: "Agent proposes action" },
  { label: "Decision Object", icon: Database, color: "#3b82f6", desc: "SDO created instantly" },
  { label: "Evaluation", icon: Brain, color: "#8b5cf6", desc: "AI evaluates context" },
  { label: "Decision Gate", icon: Shield, color: "#f59e0b", desc: "Threshold check" },
  { label: "Execution", icon: Zap, color: "#10b981", desc: "Action approved & run" },
  { label: "Outcome Track", icon: BarChart3, color: "#06b6d4", desc: "Result recorded" },
];

function DecisionGateViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      setActive(i);
      i++;
      if (i >= gateSteps.length) { clearInterval(t); }
    }, 600);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <div ref={ref}>
      {/* Desktop: horizontal flow */}
      <div className="hidden md:flex items-center justify-center gap-0 flex-wrap">
        {gateSteps.map((step, i) => {
          const Icon = step.icon;
          const done = active >= i;
          const isActive = active === i;
          const nextStep = gateSteps[i + 1];
          return (
            <div key={step.label} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={done ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, type: "spring" }}
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl border transition-all"
                style={{
                  borderColor: done ? `${step.color}40` : "var(--border)",
                  background: done ? `${step.color}10` : "var(--card)",
                  minWidth: 96,
                }}
              >
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: done ? `${step.color}22` : "var(--muted)" }}>
                  <Icon className="h-5 w-5 transition-colors" style={{ color: done ? step.color : "var(--muted-foreground)" }} />
                </div>
                <p className="text-[10px] font-semibold text-center leading-tight" style={{ color: done ? "var(--foreground)" : "var(--muted-foreground)" }}>{step.label}</p>
                <p className="text-[8px] text-center" style={{ color: done ? "var(--muted-foreground)" : "var(--muted-foreground)" }}>{step.desc}</p>
                {done && !isActive && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-1.5 w-1.5 rounded-full" style={{ background: step.color }} />
                )}
                {isActive && (
                  <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: 2 }} className="h-1.5 w-1.5 rounded-full" style={{ background: step.color }} />
                )}
              </motion.div>
              {i < gateSteps.length - 1 && (
                <motion.div
                  animate={{ opacity: active > i ? 1 : 0.1 }}
                  className="h-px w-5 mx-0.5"
                  style={{ background: active > i ? `linear-gradient(90deg,${step.color}80,${nextStep?.color ?? step.color}80)` : "var(--border)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical 2-col grid */}
      <div className="md:hidden grid grid-cols-2 gap-3">
        {gateSteps.map((step, i) => {
          const Icon = step.icon;
          const done = active >= i;
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 16 }}
              animate={done ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center"
              style={{
                borderColor: done ? `${step.color}40` : "var(--border)",
                background: done ? `${step.color}10` : "var(--card)",
              }}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: done ? `${step.color}22` : "var(--muted)" }}>
                <Icon className="h-4 w-4" style={{ color: done ? step.color : "var(--muted-foreground)" }} />
              </div>
              <p className="text-[10px] font-semibold" style={{ color: done ? "var(--foreground)" : "var(--muted-foreground)" }}>{step.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION 5 — AGENT FEED
   Live-ticking agent proposals
═══════════════════════════════════════════════════ */

const agentEvents = [
  { agent: "Growth Agent", action: "Propose: New partnership with AWS EMEA", confidence: 91, status: "approved", color: "#10b981" },
  { agent: "Risk Agent", action: "Flag: Regulatory window closing in 12 days", confidence: 87, status: "review", color: "#f59e0b" },
  { agent: "Ops Agent", action: "Optimize: Reduce onboarding sequence by 2 steps", confidence: 78, status: "approved", color: "#6366f1" },
  { agent: "Market Agent", action: "Alert: Competitor launched in DACH region", confidence: 94, status: "review", color: "#f59e0b" },
  { agent: "Finance Agent", action: "Propose: Reallocate $200K to EMEA hiring", confidence: 83, status: "approved", color: "#10b981" },
];

function AgentFeedAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (visible >= agentEvents.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), 650);
    return () => clearTimeout(t);
  }, [inView, visible]);

  return (
    <div ref={ref} className="relative">
      <div className="absolute -top-3 -right-3 z-20"><LiveGifBadge label="Agent Feed" /></div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 px-4 py-3 bg-white/3 border-b border-white/6">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/5 border border-white/8 px-3 py-0.5 text-[10px] text-white/30">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              app.stemmq.com/agents/live
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Live Agent Proposals</span>
            <span className="text-[9px] text-white/25">{visible} / {agentEvents.length} events</span>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {agentEvents.slice(0, visible).map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="rounded-xl border border-white/8 bg-white/3 p-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[10px] font-semibold text-white/70">{e.agent}</span>
                        <span
                          className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 border ${
                            e.status === "approved"
                              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                              : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                          }`}
                        >
                          {e.status === "approved" ? "✓ Approved" : "⚑ Review"}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50 leading-snug mb-1.5">{e.action}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1 flex-1 rounded-full bg-white/8 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${e.confidence}%`, background: e.color }} />
                        </div>
                        <span className="text-[9px] text-white/30 flex-shrink-0">{e.confidence}% conf.</span>
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

/* ═══════════════════════════════════════════════════
   FEATURE GRID — "Why StemmQ" section
═══════════════════════════════════════════════════ */

const features = [
  { icon: Brain, title: "Organizational Memory", desc: "Every decision builds a queryable knowledge base. Your org never forgets a strategy pivot, outcome, or lesson.", color: "#6366f1" },
  { icon: Shield, title: "Decision Gate", desc: "Autonomous agents pass through a configurable gate that evaluates risk, precedent, and strategic alignment before acting.", color: "#a855f7" },
  { icon: Network, title: "Decision Graph", desc: "See how decisions interconnect, compound, or conflict. Visualize the full strategic dependency tree across your org.", color: "#3b82f6" },
  { icon: TrendingUp, title: "Compounding Intelligence", desc: "The system gets smarter with each decision. Pattern recognition surfaces blind spots before they become mistakes.", color: "#10b981" },
  { icon: Lock, title: "Audit-Ready by Default", desc: "Every decision is timestamped, versioned, and owner-attributed. Board-level governance built into every workflow.", color: "#f59e0b" },
  { icon: Users, title: "Team Calibration", desc: "Track forecast accuracy per person and team. Coach high-performers. Surface systematic biases.", color: "#06b6d4" },
];

function FeatureGrid() {
  return (
    <section className="py-20 sm:py-28 bg-background border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Everything your org needs to{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              decide well
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">From first draft to board approval, every decision has a home in StemmQ.</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4, borderColor: `${f.color}35` }}
                  className="group relative rounded-2xl border border-border/60 bg-card/30 p-5 sm:p-6 h-full transition-all cursor-default overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at 30% 30%, ${f.color}08, transparent 60%)` }} />
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                      <Icon className="h-5 w-5" style={{ color: f.color }} />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
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
   CORE FEATURE SECTIONS DATA
═══════════════════════════════════════════════════ */

const coreSections = [
  {
    icon: GitBranch,
    label: "Capture",
    step: "01",
    title: "Structure every decision",
    description: "Every strategic decision becomes a Structured Decision Object — with explicit context, owner, strategic intent, assumptions, and projected outcomes. No decision exists in isolation.",
    features: [
      "Structured Decision Objects (SDO) as the core data unit",
      "Strategic intent classification: Growth, Defense, Efficiency, Experiment, Risk Mitigation",
      "Decision Quality Score (DQS) computed from assumption coverage and data quality",
      "Decision Impact Weight (DIW) for prioritization across initiatives",
    ],
    color: "#6366f1",
    Visual: SDOFormAnimation,
  },
  {
    icon: Target,
    label: "Calibrate",
    step: "02",
    title: "Track every assumption",
    description: "No decision can be saved without explicit assumptions. Each assumption is tracked, weighted, and validated over time — creating an organizational calibration system.",
    features: [
      "Mandatory assumption capture for every decision",
      "Impact-weighted scoring from 1 to 5",
      "Status lifecycle: Pending → Validated / Challenged / Invalidated",
      "Forecast reliability tracking per person, team, and agent",
    ],
    color: "#8b5cf6",
    Visual: AssumptionTrackerAnimation,
  },
  {
    icon: Activity,
    label: "Simulate",
    step: "03",
    title: "Model every outcome",
    description: "Before committing to a strategic direction, simulate probabilistic outcomes. Test scenarios, stress-test assumptions, and understand the full landscape of possibilities.",
    features: [
      "Probabilistic scenario simulation with confidence intervals",
      "Multi-path outcome modeling linked to real decisions",
      "Sensitivity analysis for key assumptions",
      "Monte Carlo simulation for complex strategic scenarios",
    ],
    color: "#3b82f6",
    Visual: SimulationAnimation,
  },
];

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <ProductHero />

      {/* ── Core Feature Sections ── */}
      <div id="overview">
        {coreSections.map((section, i) => {
          const { Visual } = section;
          const Icon = section.icon;
          const isOdd = i % 2 === 1;

          return (
            <section
              key={section.label}
              className={`py-16 sm:py-24 ${isOdd ? "bg-muted/20 border-y border-border" : "bg-background"}`}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${isOdd ? "lg:grid-flow-row-dense" : ""}`}>

                  {/* Text side */}
                  <Reveal className={isOdd ? "lg:col-start-2" : ""}>
                    <div>
                      {/* Step tag */}
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-[10px] font-bold text-foreground/30 tracking-widest uppercase">{section.step}</span>
                        <div className="h-px flex-1 bg-border/50 max-w-[40px]" />
                        <div className="flex items-center gap-2 rounded-full border px-3 py-1" style={{ borderColor: `${section.color}30`, background: `${section.color}10` }}>
                          <Icon className="h-3.5 w-3.5" style={{ color: section.color }} />
                          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: section.color }}>{section.label}</span>
                        </div>
                      </div>

                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">{section.title}</h2>
                      <p className="text-sm sm:text-base text-foreground/60 leading-relaxed mb-6">{section.description}</p>

                      <ul className="space-y-3">
                        {section.features.map((f) => (
                          <li key={f} className="flex items-start gap-3">
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: section.color }} />
                            <span className="text-xs sm:text-sm text-foreground/60">{f}</span>
                          </li>
                        ))}
                      </ul>

                      <motion.div whileHover={{ scale: 1.03 }} className="mt-8 inline-flex">
                        <Link href={ROUTES.auth}>
                          <button
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                            style={{ background: `${section.color}20`, border: `1px solid ${section.color}30`, color: "rgba(255,255,255,0.8)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${section.color}30`; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${section.color}20`; }}
                          >
                            Explore {section.label}
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </Link>
                      </motion.div>
                    </div>
                  </Reveal>

                  {/* Visual side */}
                  <Reveal delay={0.12} className={isOdd ? "lg:col-start-1 lg:row-start-1" : ""}>
                    <Visual />
                  </Reveal>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Decision Gate Section ── */}
      <section className="py-16 sm:py-24 bg-background border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="text-center mb-10 sm:mb-14">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Autonomous Agent Layer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
              Every agent action is a{" "}
              <span style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                decision object
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Create agents with a no-code builder or connect external systems. Every action generates a
              structured decision that flows through evaluation, the Decision Gate, and outcome tracking.
            </p>
          </Reveal>

          {/* Animated gate flow */}
          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-border/50 bg-card/40 p-6 sm:p-8 mb-10">
              <DecisionGateViz />
            </div>
          </Reveal>

          <Reveal delay={0.25} className="text-center">
            <Link href={ROUTES.aiAgents}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-foreground border border-border bg-muted/30 hover:bg-muted/50 transition-all"
              >
                <Bot className="h-4 w-4 text-amber-400" />
                Explore the Agent System
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Agent Feed Section ── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/25">
                    <Zap className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Live Intelligence</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
                  Every agent decision, structured and tracked
                </h2>
                <p className="text-sm sm:text-base text-foreground/60 leading-relaxed mb-6">
                  Agents propose decisions with assumptions, expected outcomes, and confidence scores.
                  The Decision Gate evaluates every action through organizational memory and risk modeling.
                  Nothing slips through untracked.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Proposals evaluated against org memory in real-time",
                    "Confidence scores tied to historical accuracy",
                    "Gate thresholds configurable per agent type",
                    "Full audit trail for every approved action",
                  ].map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-foreground/60">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={ROUTES.aiAgents}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-lg shadow-emerald-500/20"
                    style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      See the Agent System
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <AgentFeedAnimation />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <FeatureGrid />

      {/* ── Social proof strip ── */}
      <section className="py-12 sm:py-16 border-y border-border/30 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: "91.2", label: "Avg Confidence Score", color: "#8b5cf6" },
              { value: "34%", label: "Accuracy Improvement", color: "#3b82f6" },
              { value: "8 wks", label: "Time to First Insight", color: "#10b981" },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <div className="text-center p-4 sm:p-5 rounded-2xl border border-border/40 bg-muted/20 hover:border-border/60 transition-colors">
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums mb-1" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WorkflowSection />
      <CTASection />
      <MarketingFooter />
    </div>
  );
}