"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Shield, Lock, Eye, Key, FileText, Server, CheckCircle2,
  ArrowRight, Database, Sparkles, Zap, Network, Brain,
  AlertTriangle, Bot, TrendingUp, Globe, Users, ChevronRight,
  Clock, Hash, User, Terminal
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
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

function LiveBadge({ label, color = "emerald" }: { label: string; color?: "emerald" | "indigo" }) {
  const c = color === "emerald" ? { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" }
    : { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-300", dot: "bg-indigo-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${c.bg} border ${c.border} px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${c.text}`}>
      <span className="relative flex h-1.5 w-1.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-75`} />
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${c.dot}`} />
      </span>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */

const securityPillars = [
  { icon: Lock, color: "#6366f1", title: "Zero-Knowledge Architecture", desc: "Your decision data is encrypted at rest with AES-256. No StemmQ employee can read your decisions without explicit authorization." },
  { icon: FileText, color: "#a855f7", title: "Immutable Decision Logs", desc: "Every decision, approval, and outcome is written to an append-only audit log. Nothing can be modified or deleted after the fact." },
  { icon: Server, color: "#3b82f6", title: "Data Residency Options", desc: "Choose where your data lives. US, EU, and APAC regions available. On-premise deployment for regulated industries." },
  { icon: Eye, color: "#10b981", title: "Real-Time Audit Trail", desc: "Every action — human or agent — is logged with actor, timestamp, resource, and IP. Exportable for compliance review." },
  { icon: Key, color: "#f59e0b", title: "Granular Permissions", desc: "Role-based access at the decision, team, and agent level. Define exactly who can propose, approve, or view each decision type." },
  { icon: Shield, color: "#06b6d4", title: "Agent Access Controls", desc: "Every AI agent operates within a defined permission boundary. Agents cannot escalate their own privileges or bypass the Decision Gate." },
];

const compliance = [
  { name: "SOC 2 Type II", status: "certified", color: "#10b981" },
  { name: "GDPR", status: "compliant", color: "#10b981" },
  { name: "HIPAA", status: "in progress", color: "#f59e0b" },
  { name: "ISO 27001", status: "in progress", color: "#f59e0b" },
];

const dataFlowSteps = [
  { label: "User Input", sub: "All interfaces", icon: User, color: "#6366f1" },
  { label: "TLS 1.3", sub: "In-transit encryption", icon: Lock, color: "#8b5cf6" },
  { label: "API Gateway", sub: "Auth + rate limiting", icon: Shield, color: "#a855f7" },
  { label: "Decision Engine", sub: "Core processing", icon: Brain, color: "#3b82f6" },
  { label: "AES-256 Storage", sub: "Encrypted at rest", icon: Database, color: "#06b6d4" },
  { label: "Immutable Log", sub: "Append-only record", icon: FileText, color: "#10b981" },
];

const auditEvents = [
  { actor: "SalesAgent", type: "agent", action: "Decision proposed: Q4 pricing reduction", result: "Approved", risk: "low", time: "09:41:02", color: "#10b981" },
  { actor: "alexandra@stemmq.com", type: "human", action: "Decision approved: EMEA expansion Q1", result: "Approved", risk: "medium", time: "09:38:17", color: "#6366f1" },
  { actor: "RiskAgent", type: "agent", action: "Flag raised: regulatory gap in DACH", result: "Escalated", risk: "high", time: "09:35:44", color: "#f59e0b" },
  { actor: "marcus@stemmq.com", type: "human", action: "Permission updated: OpsAgent scope expanded", result: "Logged", risk: "medium", time: "09:32:11", color: "#a855f7" },
  { actor: "OpsAgent", type: "agent", action: "Process change executed: onboarding -2 steps", result: "Approved", risk: "low", time: "09:28:58", color: "#10b981" },
];

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */

function SecurityHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-20 bg-background">
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "52px 52px" }} />
      <Orb delay={0} className="absolute top-[-10%] right-[-3%] w-[420px] h-[420px] rounded-full bg-indigo-600/10 blur-[110px] pointer-events-none" />
      <Orb delay={4} className="absolute bottom-[-8%] left-[-3%] w-[360px] h-[360px] rounded-full bg-violet-600/8 blur-[90px] pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-5 backdrop-blur-sm">
                <Shield className="h-3.5 w-3.5" /> Enterprise Security
              </span>
            </Reveal>
            <Reveal delay={0.07}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.06] mb-5">
                Enterprise security.{" "}
                <span style={{ background: "linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Absolute auditability.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Decision infrastructure must be trustworthy. StemmQ is built on immutable logs,
                encrypted storage, and granular access controls — from day one, not as an add-on.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href={ROUTES.auth}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-xl shadow-indigo-500/25 w-full sm:w-auto justify-center"
                    style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                    <span className="relative z-10 flex items-center gap-2">
                      Schedule Security Review
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </Link>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-foreground/60 border border-border bg-muted/30 hover:bg-muted/50 hover:text-foreground transition-all w-full sm:w-auto justify-center">
                  <FileText className="h-4 w-4" /> Download Trust Report
                </motion.button>
              </div>
            </Reveal>

            {/* Trust indicators */}
            <Reveal delay={0.26}>
              <div className="flex flex-wrap items-center gap-3">
                {["SOC 2 Type II", "GDPR Compliant", "AES-256 Encryption", "TLS 1.3"].map(t => (
                  <div key={t} className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span className="text-[10px] font-semibold text-emerald-300">{t}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — animated security status panel (product mockup, stays dark) */}
          <Reveal delay={0.18} direction="right">
            <SecurityStatusPanel />
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SECURITY STATUS PANEL (hero right) — product mockup, intentionally dark
═══════════════════════════════════════════════════ */

function SecurityStatusPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(v => (v + 1) % 3), 2000);
    return () => clearInterval(t);
  }, []);

  const metrics = [
    { label: "Uptime (30d)", value: "99.99%", color: "#10b981" },
    { label: "Encrypted records", value: "2.4M+", color: "#6366f1" },
    { label: "Audit events today", value: "14,218", color: "#a855f7" },
    { label: "Security incidents", value: "0", color: "#10b981" },
  ];

  const threats = [
    { label: "Unauthorized access attempts", val: "Blocked", color: "#10b981" },
    { label: "Agent privilege escalations", val: "None", color: "#10b981" },
    { label: "Gate bypass attempts", val: "Blocked", color: "#10b981" },
  ];

  return (
    <div className="relative">
      <div className="absolute -top-3 -right-3 z-20"><LiveBadge label="Live Status" /></div>

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
              security.stemmq.com/status
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Overall status */}
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/6 px-4 py-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-300">All systems operational</p>
              <p className="text-[9px] text-emerald-400/60">Last checked: just now</p>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((m, i) => (
              <div key={m.label} className="rounded-xl border border-white/6 bg-white/2 p-3">
                <p className="text-[9px] text-white/30 mb-1">{m.label}</p>
                <p className="text-sm sm:text-base font-bold tabular-nums" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Threat status */}
          <div>
            <p className="text-[9px] text-white/25 uppercase tracking-widest font-semibold mb-2">Threat Detection</p>
            <div className="space-y-1.5">
              {threats.map((t, i) => (
                <motion.div key={i}
                  animate={{ borderColor: tick === i ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)" }}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 transition-all">
                  <span className="text-[10px] text-white/45">{t.label}</span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{t.val}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Encryption visual */}
          <div className="rounded-xl border border-white/6 bg-white/2 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] text-white/30 uppercase tracking-wider">Encryption Health</p>
              <span className="text-[9px] font-bold text-indigo-400">AES-256</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                  className="flex-1 h-3 rounded-sm"
                  style={{ background: i % 3 === 0 ? "#6366f1" : i % 3 === 1 ? "#a855f7" : "#3b82f6", opacity: 0.3 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECURITY PILLARS GRID
═══════════════════════════════════════════════════ */

function SecurityPillarsSection() {
  return (
    <section className="py-16 sm:py-20 bg-muted/30 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/25 bg-(--accent)/8 px-4 py-1.5 text-xs font-medium text-(--accent) mb-4">
            Security Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Security at{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              every layer
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            StemmQ was designed security-first. Every decision is protected by multiple overlapping controls.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {securityPillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.07}>
                <motion.div whileHover={{ y: -5 }}
                  className="group relative rounded-2xl border border-border/60 bg-card/30 p-5 sm:p-7 overflow-hidden h-full transition-all hover:border-border">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `radial-gradient(circle at 20% 20%, ${p.color}08, transparent 60%)` }} />
                  <div className="relative">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: `${p.color}15`, border: `1px solid ${p.color}25` }}>
                      <Icon className="h-5 w-5" style={{ color: p.color }} />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground mb-2.5">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
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
   LIVE AUDIT LOG — animated (product mockup, intentionally dark)
═══════════════════════════════════════════════════ */

function AuditLogSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!inView || visible >= auditEvents.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), 550);
    return () => clearTimeout(t);
  }, [inView, visible]);

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Animated audit log — product mockup, intentionally dark */}
          <Reveal direction="left">
            <div ref={ref} className="relative">
              <div className="absolute -top-3 -right-3 z-20"><LiveBadge label="Live Audit" /></div>

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
                      app.stemmq.com/audit-log
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  {/* Header row */}
                  <div className="grid grid-cols-12 gap-2 pb-2 border-b border-white/6 mb-3">
                    {["Time", "Actor", "Action", "Result"].map(h => (
                      <span key={h} className="text-[8px] font-bold text-white/25 uppercase tracking-widest col-span-3">{h}</span>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <AnimatePresence>
                      {auditEvents.slice(0, visible).map((e, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -12, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: "auto" }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="grid grid-cols-12 gap-2 items-center rounded-lg border border-white/5 bg-white/2 px-2.5 py-2"
                        >
                          <span className="col-span-3 text-[9px] font-mono text-white/30">{e.time}</span>
                          <div className="col-span-3 flex items-center gap-1.5 min-w-0">
                            <div className="h-4 w-4 rounded-md flex items-center justify-center flex-shrink-0"
                              style={{ background: `${e.color}15`, border: `1px solid ${e.color}25` }}>
                              {e.type === "agent"
                                ? <Bot className="h-2.5 w-2.5" style={{ color: e.color }} />
                                : <User className="h-2.5 w-2.5" style={{ color: e.color }} />
                              }
                            </div>
                            <span className="text-[9px] text-white/50 truncate">{e.type === "agent" ? e.actor : e.actor.split("@")[0]}</span>
                          </div>
                          <span className="col-span-4 text-[9px] text-white/40 truncate">{e.action.slice(0, 28)}…</span>
                          <span className="col-span-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-center"
                            style={{
                              color: e.result === "Approved" ? "#10b981" : e.result === "Escalated" ? "#f59e0b" : "#6366f1",
                              background: e.result === "Approved" ? "#10b98112" : e.result === "Escalated" ? "#f59e0b12" : "#6366f112",
                              border: `1px solid ${e.result === "Approved" ? "#10b98125" : e.result === "Escalated" ? "#f59e0b25" : "#6366f125"}`,
                            }}>
                            {e.result}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Footer stats */}
                  <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/6">
                    <span className="text-[9px] text-white/25">{visible} of {auditEvents.length} events loaded</span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] text-white/25">Immutable · Append-only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Text */}
          <Reveal direction="right" delay={0.1}>
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-indigo-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Audit Trail</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
                Every action.{" "}
                <span style={{ background: "linear-gradient(135deg,#818cf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Permanent record.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                Immutable audit logs capture who did what, when, from where — including every AI agent action
                and human approval. Nothing is retroactively editable, ever.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Agent proposal → Gate evaluation → Approval → Execution, all linked in one chain",
                  "Human reviewer actions logged as immutable decision metadata",
                  "Exportable audit reports in CSV, JSON, or compliance PDF",
                  "API access to query audit history programmatically",
                  "Retention policies configurable per compliance requirement",
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                    </div>
                    <span className="text-xs sm:text-sm text-foreground/55">{point}</span>
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
   DATA FLOW — animated pipeline
═══════════════════════════════════════════════════ */

function DataFlowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => { setActive(i); i++; if (i >= dataFlowSteps.length) clearInterval(t); }, 450);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <section className="py-16 sm:py-20 bg-muted/20 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-xs font-medium text-emerald-300 mb-4">
            Data Flow
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Your data stays{" "}
            <span style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              yours
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            Every piece of data is encrypted and protected at every stage of processing.
          </p>
        </Reveal>

        <div ref={ref} className="max-w-5xl mx-auto">
          {/* Desktop: horizontal flow */}
          <div className="hidden md:flex items-center justify-center gap-0">
            {dataFlowSteps.map((step, i) => {
              const Icon = step.icon;
              const done = active >= i;
              const nextColor = dataFlowSteps[i + 1]?.color ?? step.color;
              return (
                <div key={step.label} className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={done ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border transition-all"
                    style={{
                      borderColor: done ? `${step.color}35` : "var(--border)",
                      background: done ? `${step.color}08` : "var(--muted)",
                      minWidth: 100,
                    }}
                  >
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                      style={{ background: done ? `${step.color}20` : "var(--muted)" }}>
                      <Icon className="h-5 w-5" style={{ color: done ? step.color : "var(--muted-foreground)" }} />
                    </div>
                    <p className="text-[10px] font-semibold text-center leading-tight"
                      style={{ color: done ? "var(--foreground)" : "var(--muted-foreground)" }}>
                      {step.label}
                    </p>
                    <p className="text-[8px] text-center"
                      style={{ color: done ? "var(--foreground)" : "var(--muted-foreground)" }}>
                      {step.sub}
                    </p>
                    {done && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-1.5 w-1.5 rounded-full" style={{ background: step.color }} />}
                  </motion.div>
                  {i < dataFlowSteps.length - 1 && (
                    <motion.div animate={{ opacity: active > i ? 1 : 0.2 }}
                      className="h-px w-5 mx-0.5"
                      style={{ background: active > i ? `linear-gradient(90deg,${step.color}80,${nextColor}80)` : "var(--border)" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: 2-column grid */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            {dataFlowSteps.map((step, i) => {
              const Icon = step.icon;
              const done = active >= i;
              return (
                <motion.div key={step.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={done ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border text-center"
                  style={{ borderColor: done ? `${step.color}30` : "var(--border)", background: done ? `${step.color}06` : "var(--muted)" }}
                >
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{ background: done ? `${step.color}18` : "var(--muted)" }}>
                    <Icon className="h-4 w-4" style={{ color: done ? step.color : "var(--muted-foreground)" }} />
                  </div>
                  <p className="text-[10px] font-bold" style={{ color: done ? "var(--foreground)" : "var(--muted-foreground)" }}>{step.label}</p>
                  <p className="text-[8px]" style={{ color: done ? "var(--foreground)" : "var(--muted-foreground)" }}>{step.sub}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom note */}
          <Reveal delay={0.4} className="text-center mt-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/6 px-5 py-2.5">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-emerald-300 font-semibold">All data encrypted in transit (TLS 1.3) and at rest (AES-256)</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   COMPLIANCE SECTION
═══════════════════════════════════════════════════ */

function ComplianceSection() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/25 bg-(--accent)/8 px-4 py-1.5 text-xs font-medium text-(--accent) mb-4">
            Compliance
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Built for{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              regulated industries
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            StemmQ's audit infrastructure is designed to satisfy the most demanding compliance requirements.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 max-w-2xl mx-auto mb-10">
          {compliance.map((cert, i) => {
            const certified = cert.status !== "in progress";
            return (
              <Reveal key={cert.name} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4 }}
                  className="rounded-2xl border p-4 sm:p-6 text-center transition-all"
                  style={{
                    borderColor: certified ? `${cert.color}30` : "var(--border)",
                    background: certified ? `${cert.color}06` : "var(--card)",
                  }}
                >
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: `${cert.color}15`, border: `1px solid ${cert.color}25` }}>
                    {certified
                      ? <CheckCircle2 className="h-5 w-5" style={{ color: cert.color }} />
                      : <ChevronRight className="h-5 w-5" style={{ color: cert.color }} />
                    }
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground mb-1">{cert.name}</p>
                  <p className="text-[9px] sm:text-[10px] font-semibold capitalize"
                    style={{ color: cert.color }}>
                    {cert.status}
                  </p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* Feature compliance table */}
        <Reveal delay={0.15}>
          <div className="rounded-2xl border border-border/60 bg-card/30 overflow-hidden max-w-3xl mx-auto">
            <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Compliance Features</span>
              <span className="text-[9px] text-emerald-400 font-semibold">All enterprise plans</span>
            </div>
            {[
              { feature: "Immutable audit logs", included: true },
              { feature: "Data residency (US, EU, APAC)", included: true },
              { feature: "SAML/SSO integration", included: true },
              { feature: "Custom retention policies", included: true },
              { feature: "On-premise deployment", included: true },
              { feature: "Dedicated security review", included: true },
              { feature: "Compliance export (CSV/PDF)", included: true },
            ].map((row, i) => (
              <div key={row.feature}
                className={`flex items-center justify-between px-5 py-3 ${i < 6 ? "border-b border-border/30" : ""}`}>
                <span className="text-xs sm:text-sm text-foreground/60">{row.feature}</span>
                <div className="h-5 w-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   AGENT SECURITY SECTION
═══════════════════════════════════════════════════ */

function AgentSecuritySection() {
  const [activeRule, setActiveRule] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveRule(v => (v + 1) % 4), 1800);
    return () => clearInterval(t);
  }, []);

  const rules = [
    { rule: "Cannot escalate own privileges", color: "#ef4444" },
    { rule: "Cannot bypass Decision Gate", color: "#ef4444" },
    { rule: "Cannot execute without SDO", color: "#ef4444" },
    { rule: "Cannot modify audit logs", color: "#ef4444" },
  ];

  return (
    <section className="py-16 sm:py-20 bg-muted/30 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Agent permission panel — product mockup, intentionally dark */}
          <Reveal direction="right" delay={0.1}>
            <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-black/40 p-5 sm:p-6">
              <div className="absolute -top-3 -right-3 z-20">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-[9px] font-bold text-red-400 uppercase tracking-widest">
                  <Shield className="h-2.5 w-2.5" /> Hard Limits
                </span>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <div className="h-8 w-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/75">Agent Permission Boundary</p>
                  <p className="text-[9px] text-white/35">Enforced at infrastructure level</p>
                </div>
              </div>

              {/* Can */}
              <div className="mb-4">
                <p className="text-[9px] text-white/25 uppercase tracking-widest font-semibold mb-2">Agents CAN</p>
                <div className="space-y-1.5">
                  {["Propose decisions backed by data", "Reference org memory", "Collaborate with other agents", "Flag risks proactively"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg border border-emerald-500/10 bg-emerald-500/4 px-3 py-1.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                      <span className="text-[10px] text-white/55">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cannot */}
              <div>
                <p className="text-[9px] text-white/25 uppercase tracking-widest font-semibold mb-2">Agents CANNOT</p>
                <div className="space-y-1.5">
                  {rules.map((r, i) => (
                    <motion.div key={i}
                      animate={{ borderColor: activeRule === i ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.06)", background: activeRule === i ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.01)" }}
                      className="flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all">
                      <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                        <div className="h-1.5 w-0.5 bg-red-400 rounded" />
                      </div>
                      <span className="text-[10px] text-white/45">{r.rule}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.08}>
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-violet-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Agent Security</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
                AI agents with{" "}
                <span style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  hard boundaries
                </span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                Every AI agent operates inside a defined permission boundary enforced at the
                infrastructure level — not through prompting. No agent can escalate its own
                privileges or bypass the Decision Gate under any condition.
              </p>
              <ul className="space-y-3">
                {[
                  "Permission boundaries enforced by infrastructure, not prompts",
                  "Every agent proposal must generate a Structured Decision Object",
                  "Gate thresholds configurable per agent type and risk level",
                  "Full audit trail for all agent actions and approvals",
                  "Agents cannot act on stale data — always references live org memory",
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
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ENTERPRISE CTA
═══════════════════════════════════════════════════ */

function SecurityCTA() {
  return (
    <section className="py-14 sm:py-16 bg-background border-t border-border/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/8 to-violet-500/5 p-7 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 60%)" }} />
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mx-auto mb-5">
                <Shield className="h-7 w-7 text-indigo-400" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
                Talk to our security team
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-7">
                Have specific compliance requirements or need a custom deployment? Our security team
                will walk you through our architecture and answer any technical questions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href={ROUTES.auth}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-xl shadow-indigo-500/25 w-full sm:w-auto justify-center"
                    style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                    <span className="relative z-10 flex items-center gap-2">
                      Schedule a Security Review
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </Link>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-foreground/60 border border-border bg-muted/30 hover:bg-muted/50 hover:text-foreground transition-all w-full sm:w-auto justify-center">
                  <FileText className="h-4 w-4" /> Download Trust Report
                </motion.button>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {["SOC 2 Type II", "GDPR", "AES-256", "TLS 1.3", "Zero-Knowledge"].map(t => (
                  <span key={t} className="text-[10px] text-emerald-400/70 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {t}
                  </span>
                ))}
              </div>
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

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <SecurityHero />
      <SecurityPillarsSection />
      <AuditLogSection />
      <DataFlowSection />
      <ComplianceSection />
      <AgentSecuritySection />
      <SecurityCTA />
      <MarketingFooter />
    </div>
  );
}
