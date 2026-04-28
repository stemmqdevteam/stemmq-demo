"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, TrendingUp, Brain, Shield, CheckCircle2, Zap, Bot } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { ROUTES } from "@/lib/constants";

/* ═══════════════════════════════════════════════════
   TYPEWRITER — cycles through words in the headline
═══════════════════════════════════════════════════ */

const rotatingWords = ["Strategic Decisions", "AI Governance", "Decision Quality", "Team Alignment"];

function TypewriterWord() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = rotatingWords[idx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % rotatingWords.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return (
    <span className="relative inline-block">
      <span
        style={{
          background: "linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#a855f7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {displayed}
      </span>
      <span
        className="ml-0.5 inline-block w-0.5 h-[0.85em] bg-indigo-400 align-middle animate-pulse"
        style={{ verticalAlign: "middle" }}
      />
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   MINI STAT PILL
═══════════════════════════════════════════════════ */

function StatPill({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-3.5 py-2.5 backdrop-blur-sm">
      <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
        <TrendingUp className="h-3.5 w-3.5" style={{ color }} />
      </div>
      <div>
        <p className="text-sm sm:text-base font-bold text-foreground tabular-nums leading-tight">{value}</p>
        <p className="text-[9px] text-muted-foreground leading-tight">{label}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DASHBOARD MOCKUP — lean, modern, minimal
═══════════════════════════════════════════════════ */

function DashboardMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const decisions = [
    { title: "EU Market Expansion", owner: "Sarah M.", dqs: 87, status: "In Review", color: "#f59e0b" },
    { title: "Series B Fundraising", owner: "Michael K.", dqs: 92, status: "Approved", color: "#10b981" },
    { title: "Platform Migration", owner: "Dev Team", dqs: 71, status: "Drafting", color: "#6366f1" },
    { title: "APAC Partnership", owner: "Lisa C.", dqs: 79, status: "In Review", color: "#f59e0b" },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Glow beneath */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-indigo-500/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -inset-2 bg-indigo-500/5 rounded-3xl blur-2xl pointer-events-none" />

      {/* Browser chrome */}
      <div className="relative rounded-2xl border border-white/12 bg-[#0a0f1e]/95 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/60">

        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3 bg-white/3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/6 border border-white/8 px-3 py-1 text-[10px] text-white/35">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              app.stemmq.com/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-4 sm:p-5">

          {/* KPI row */}
          <div className="grid grid-cols-4 gap-2.5 mb-4">
            {[
              { label: "Active Decisions", value: "47", delta: "+12", color: "#6366f1" },
              { label: "Avg DQS Score", value: "78.4", delta: "+4.2%", color: "#a855f7" },
              { label: "Assumptions", value: "234", delta: "+18", color: "#3b82f6" },
              { label: "Confidence", value: "91.2", delta: "+6.8%", color: "#10b981" },
            ].map((kpi, i) => (
              <motion.div key={kpi.label}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="rounded-xl border border-white/6 bg-white/2 p-3"
              >
                <p className="text-[9px] text-white/35 mb-1.5 leading-tight">{kpi.label}</p>
                <p className="text-base sm:text-lg font-bold text-white tabular-nums">{kpi.value}</p>
                <p className="text-[9px] mt-0.5 font-semibold" style={{ color: kpi.color }}>{kpi.delta}</p>
              </motion.div>
            ))}
          </div>

          {/* Chart + donut row */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {/* Bar chart */}
            <div className="col-span-2 rounded-xl border border-white/6 bg-white/2 p-3">
              <p className="text-[10px] text-white/35 mb-2.5 font-medium">Decision Quality Trend</p>
              <div className="flex items-end gap-1 h-14">
                {[38, 50, 44, 58, 52, 65, 68, 63, 74, 72, 81, 79].map((h, i) => (
                  <motion.div key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background: i >= 10
                        ? "linear-gradient(180deg,#6366f1,rgba(99,102,241,0.3))"
                        : "rgba(99,102,241,0.16)",
                    }}
                    initial={{ scaleY: 0, originY: "bottom" }}
                    animate={inView ? { scaleY: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.04, duration: 0.35 }}
                  />
                ))}
              </div>
            </div>

            {/* Donut */}
            <div className="rounded-xl border border-white/6 bg-white/2 p-3 flex flex-col items-center justify-center">
              <p className="text-[10px] text-white/35 mb-2 font-medium self-start">Strategic Health</p>
              <div className="relative h-14 w-14">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <motion.circle cx="18" cy="18" r="14" fill="none" stroke="#6366f1" strokeWidth="3"
                    strokeLinecap="round" strokeDasharray="88 100"
                    initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
                    transition={{ delay: 0.8, duration: 1 }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-white">91</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decision table */}
          <div className="rounded-xl border border-white/6 bg-white/2 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
              <span className="text-[10px] font-semibold text-white/50">Recent Decisions</span>
              <span className="text-[9px] text-indigo-400 font-semibold">View all →</span>
            </div>
            {decisions.map((row, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-center gap-3 px-3 py-2.5 border-b border-white/[0.04] last:border-0 hover:bg-white/2 transition-colors"
              >
                <div className="h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `${row.color}15`, border: `1px solid ${row.color}25` }}>
                  <Brain className="h-3 w-3" style={{ color: row.color }} />
                </div>
                <p className="text-[10px] font-medium text-white/75 flex-1 truncate">{row.title}</p>
                <span className="text-[9px] text-white/30 hidden sm:block w-14 truncate">{row.owner}</span>
                <span className="text-[10px] font-bold text-white/80 w-6 text-right">{row.dqs}</span>
                <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full hidden sm:inline-flex"
                  style={{ color: row.color, background: `${row.color}14`, border: `1px solid ${row.color}22` }}>
                  {row.status}
                </span>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FLOATING SIDE CARDS
═══════════════════════════════════════════════════ */

function FloatingAgentCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
    >
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
        <div className="rounded-2xl border border-white/12 bg-[#0a0f1e]/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/50 w-52">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/80">AI Agent Active</p>
              <p className="text-[8px] text-white/35">SalesAgent · Decision Gate</p>
            </div>
            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="rounded-lg bg-white/4 border border-white/6 px-2.5 py-2 mb-2">
            <p className="text-[9px] text-white/55 leading-relaxed">Proposed: Q4 pricing reduction to <span className="text-white/80 font-semibold">$149/seat</span></p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-bold text-amber-400 bg-amber-500/12 border border-amber-500/20 px-1.5 py-0.5 rounded-full">Awaiting approval</span>
            <span className="text-[9px] font-bold text-white/60">DQS 79</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FloatingDQSCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 1.0, type: "spring" }}
    >
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <div className="rounded-2xl border border-white/12 bg-[#0a0f1e]/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/50 w-44">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] text-white/40 font-medium">Confidence</p>
            <Shield className="h-3 w-3 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white tabular-nums">91.2</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <p className="text-[10px] text-emerald-400 font-semibold">+6.8% this month</p>
          </div>
          <div className="mt-3 flex items-end gap-0.5 h-6">
            {[35, 48, 42, 56, 50, 63, 59, 70, 68, 76, 82, 91].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm transition-all"
                style={{ height: `${h}%`, background: i === 11 ? "#10b981" : "rgba(16,185,129,0.22)" }} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════ */

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "52px 52px" }} />

      {/* Ambient orbs */}
      <motion.div animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-8%] left-[-5%] w-[520px] h-[520px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      <motion.div animate={{ y: [20, -20, 20], x: [10, -10, 10] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-5%] right-[-5%] w-[440px] h-[440px] rounded-full bg-violet-600/9 blur-[110px] pointer-events-none" />
      <motion.div animate={{ y: [-12, 12, -12] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute top-[40%] left-[55%] w-[280px] h-[280px] rounded-full bg-blue-600/7 blur-[90px] pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative w-full mx-auto max-w-7xl px-4 sm:px-6 pt-28 sm:pt-32 pb-16">

        {/* ── Top section ── full width centered text ── */}
        <div className="text-center mb-10 sm:mb-14">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
            <a href="#"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/15 transition-colors backdrop-blur-sm group">
              <Sparkles className="h-3.5 w-3.5" />
              Introducing DQS 2.0 — Decision Quality Score
              <ArrowRight className="h-3 w-3 opacity-50 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-5"
          >
            The Operating System
            <br />
            <span className="inline-flex flex-wrap items-center justify-center gap-x-4">
              <span className="text-foreground/50">for</span>
              <TypewriterWord />
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-10"
          >
            StemmQ captures every strategic decision, tracks assumptions in real-time, and
            simulates outcomes — giving your team the clarity to move fast without breaking things.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12"
          >
            <Link href={ROUTES.auth}>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white overflow-hidden shadow-xl shadow-indigo-500/25 w-full sm:w-auto justify-center"
                style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                <span className="relative z-10 flex items-center gap-2">
                  Start for Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </motion.button>
            </Link>
            <Link href={ROUTES.product}>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-foreground/60 border border-border bg-muted/30 hover:bg-muted/60 hover:text-foreground/85 transition-all w-full sm:w-auto justify-center">
                Watch demo
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-5"
          >
            {[
              { icon: CheckCircle2, label: "No credit card required", color: "#10b981" },
              { icon: Shield, label: "SOC 2 Certified", color: "#6366f1" },
              { icon: Zap, label: "Up in 5 minutes", color: "#f59e0b" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                  {item.label}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Bottom section — stat pills + dashboard + floating cards ── */}
        <div className="relative hidden sm:block">

          {/* Stat pills row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <StatPill value="2,400+" label="Enterprise teams" color="#6366f1" />
            <StatPill value="87.4" label="Avg DQS score" color="#a855f7" />
            <StatPill value="94%" label="Assumption accuracy" color="#10b981" />
            <StatPill value="8 wks" label="Time to first insight" color="#3b82f6" />
          </motion.div>

          {/* Dashboard + floating cards */}
          <div className="relative max-w-5xl mx-auto">

            {/* Left floating card */}
            <div className="absolute -left-2 xl:-left-16 top-8 z-20">
              <FloatingDQSCard />
            </div>

            {/* Right floating card */}
            <div className="absolute -right-2 xl:-right-16 top-16 z-20">
              <FloatingAgentCard />
            </div>

            {/* Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, type: "spring", stiffness: 80 }}>
              <DashboardMockup />
            </motion.div>
          </div>
        </div>

        {/* Mobile — just stat pills, no dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="sm:hidden grid grid-cols-2 gap-3 mt-4"
        >
          <StatPill value="2,400+" label="Enterprise teams" color="#6366f1" />
          <StatPill value="87.4" label="Avg DQS score" color="#a855f7" />
          <StatPill value="94%" label="Assumption accuracy" color="#10b981" />
          <StatPill value="8 wks" label="First insight" color="#3b82f6" />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-12 sm:mt-16 flex justify-center"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-1 text-foreground/20 cursor-pointer hover:text-foreground/45 transition-colors">
            <span className="text-[9px] tracking-widest uppercase font-semibold">Explore</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
}

export { HeroSection };