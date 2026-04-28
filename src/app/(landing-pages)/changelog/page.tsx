"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Rss, Sparkles, Zap, Shield, Bug, TrendingUp, ArrowRight,
  CheckCircle2, Clock, ChevronDown, Star, Brain, Bot, Lock
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

/* ═══════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════ */

function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [-14, 14, -14], x: [-7, 7, -7] }}
      transition={{ duration: 11 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    />
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */

type Category = "Feature" | "Performance" | "Fix" | "Security" | "Release";

const categoryMeta: Record<Category, { color: string; bg: string; border: string; icon: typeof Sparkles; label: string }> = {
  Feature: { color: "#818cf8", bg: "#6366f112", border: "#6366f130", icon: Sparkles, label: "Feature" },
  Performance: { color: "#10b981", bg: "#10b98112", border: "#10b98130", icon: Zap, label: "Performance" },
  Fix: { color: "#f59e0b", bg: "#f59e0b12", border: "#f59e0b30", icon: Bug, label: "Bug Fix" },
  Security: { color: "#ef4444", bg: "#ef444412", border: "#ef444430", icon: Shield, label: "Security" },
  Release: { color: "#a855f7", bg: "#a855f712", border: "#a855f730", icon: Star, label: "Major Release" },
};

const entries: {
  version: string; date: string; category: Category;
  title: string; description?: string;
  changes: string[];
  highlight?: boolean;
}[] = [
  {
    version: "v2.4.0",
    date: "March 14, 2026",
    category: "Feature",
    title: "Multi-Agent Orchestration",
    description: "Agents can now collaborate on joint decisions evaluated as a single unit — with full dependency chain visualization.",
    changes: [
      "Agents can submit joint decisions evaluated as a single unit",
      "Dependency graph visualization for agent proposal chains",
      "New joint-decision endpoint: POST /v1/decisions/joint",
      "Audit trail links all contributing agents to the combined outcome",
    ],
  },
  {
    version: "v2.3.2",
    date: "March 5, 2026",
    category: "Performance",
    title: "Decision Gate 40% Faster Evaluation",
    description: "Risk modeling engine refactored for dramatically lower latency — Gate evaluation time drops from 800ms to 480ms.",
    changes: [
      "Risk modeling engine refactored for 40% lower p95 latency",
      "Pattern recognition now runs in parallel with assumption validation",
      "Gate evaluation time reduced from ~800ms to ~480ms average",
    ],
  },
  {
    version: "v2.3.0",
    date: "Feb 24, 2026",
    category: "Feature",
    title: "External Agent Gateway (GA)",
    description: "The External Agent Gateway is now generally available. Connect any AI system — GPT-4, Claude, custom models — to StemmQ's Decision Gate.",
    changes: [
      "POST /v1/external-agent/decision now generally available",
      "Passive observation mode detects and converts external system actions",
      "OpenAI and Anthropic function calling schemas supported out of the box",
      "Webhook retry logic with configurable backoff policies",
    ],
  },
  {
    version: "v2.2.1",
    date: "Feb 15, 2026",
    category: "Fix",
    title: "Assumption Calibration Edge Cases",
    changes: [
      "Fixed DQS miscalculation when all assumptions have equal weight",
      "Resolved edge case where invalidated assumptions counted toward coverage",
      "Improved accuracy scoring for assumptions updated retroactively",
    ],
  },
  {
    version: "v2.2.0",
    date: "Feb 5, 2026",
    category: "Feature",
    title: "Agent Performance Scoring",
    description: "New agent dashboard with five performance dimensions tracked over a 90-day rolling window.",
    changes: [
      "New agent dashboard with five performance dimensions",
      "Metrics: Forecast Accuracy, DQS contribution, ROI, Risk Exposure, Success Rate",
      "Historical performance trends with 90-day rolling window",
      "Agents with sustained low scores auto-flagged for review",
    ],
  },
  {
    version: "v2.1.0",
    date: "Jan 22, 2026",
    category: "Security",
    title: "SOC 2 Type II Certification",
    description: "StemmQ achieves SOC 2 Type II certification with full SAML SSO and new security dashboard.",
    changes: [
      "StemmQ is now SOC 2 Type II certified",
      "Audit log export includes chain-of-custody certificate",
      "SAML 2.0 SSO support for enterprise organizations",
      "New security dashboard with session management",
    ],
  },
  {
    version: "v2.0.0",
    date: "Jan 8, 2026",
    category: "Release",
    title: "Decision Intelligence v2 — Major Release",
    description: "A complete rebuild of the Decision Gate, Pattern Recognition Engine, and Institutional Memory layer. The biggest release in StemmQ history.",
    highlight: true,
    changes: [
      "Rebuilt Decision Gate with configurable risk threshold engine",
      "New strategic intent types: Experiment and Risk Mitigation",
      "Pattern Recognition Engine now learns from 100+ decision signals",
      "Institutional Memory stores context across leadership transitions",
      "Full REST API v1 generally available",
    ],
  },
];

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */

function ChangelogHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const latestVersion = entries[0];
  const latestMeta = categoryMeta[latestVersion.category];

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 sm:pt-32 pb-14 sm:pb-16 bg-background">
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "52px 52px" }} />
      <Orb delay={0} className="absolute top-[-8%] left-[-3%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[110px] pointer-events-none" />
      <Orb delay={4} className="absolute bottom-[-5%] right-[-3%] w-[340px] h-[340px] rounded-full bg-violet-600/8 blur-[90px] pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-4 backdrop-blur-sm">
                <TrendingUp className="h-3.5 w-3.5" /> Product Updates
              </span>
            </Reveal>
            <Reveal delay={0.07}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
                Changelog
              </h1>
            </Reveal>
            <Reveal delay={0.13}>
              <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
                Every update to StemmQ — new features, performance improvements, security fixes.
                Subscribe via RSS to stay current.
              </p>
            </Reveal>
          </div>

          {/* RSS subscribe */}
          <Reveal delay={0.18}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-xs font-semibold text-foreground/55 hover:text-foreground/80 hover:border-border/80 transition-all self-start">
              <Rss className="h-3.5 w-3.5" /> Subscribe to RSS
            </motion.button>
          </Reveal>
        </div>

        {/* Latest release card */}
        <Reveal delay={0.22} className="mt-8 sm:mt-10">
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/8 to-violet-500/4 p-5 sm:p-6 overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 80% 20%, rgba(99,102,241,0.10), transparent 60%)" }} />
            <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: latestMeta.color, background: latestMeta.bg, borderColor: latestMeta.border }}>
                    <Sparkles className="h-3 w-3" /> Latest
                  </span>
                  <code className="text-xs font-mono font-bold text-foreground/75">{latestVersion.version}</code>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {latestVersion.date}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-foreground mb-2">{latestVersion.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{latestVersion.description}</p>
              </div>
              <div className="flex-shrink-0 flex flex-wrap gap-1.5">
                {latestVersion.changes.slice(0, 3).map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1.5">
                    <CheckCircle2 className="h-3 w-3 text-indigo-400 flex-shrink-0" />
                    <span className="text-[10px] text-muted-foreground leading-snug">{c.slice(0, 40)}…</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Category stats */}
        <Reveal delay={0.28} className="mt-5 flex flex-wrap items-center gap-3">
          {Object.entries(categoryMeta).map(([cat, meta]) => {
            const count = entries.filter(e => e.category === cat).length;
            if (!count) return null;
            const Icon = meta.icon;
            return (
              <div key={cat} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5"
                style={{ borderColor: meta.border, background: meta.bg }}>
                <Icon className="h-3 w-3" style={{ color: meta.color }} />
                <span className="text-[10px] font-semibold" style={{ color: meta.color }}>{count} {meta.label}{count > 1 ? "s" : ""}</span>
              </div>
            );
          })}
        </Reveal>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   CHANGELOG ENTRY CARD
═══════════════════════════════════════════════════ */

function ChangelogEntry({ entry, index }: { entry: typeof entries[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [expanded, setExpanded] = useState(true);
  const meta = categoryMeta[entry.category];
  const Icon = meta.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-4 sm:gap-6"
    >
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Node */}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.06 + 0.2, type: "spring", bounce: 0.4 }}
          className="relative z-10 h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center"
          style={{
            background: entry.highlight ? `linear-gradient(135deg, ${meta.color}, ${meta.color}88)` : meta.bg,
            border: `1px solid ${meta.border}`,
            boxShadow: entry.highlight ? `0 0 20px ${meta.color}25` : "none",
          }}
        >
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: entry.highlight ? "white" : meta.color }} />
        </motion.div>
        {/* Connector line */}
        <div className="flex-1 w-px mt-2 bg-border/40" style={{ minHeight: 24 }} />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8 sm:pb-10 min-w-0">
        {/* Card */}
        <motion.div
          whileHover={{ borderColor: `${meta.color}25` }}
          className="rounded-2xl border overflow-hidden transition-all"
          style={{
            borderColor: entry.highlight ? `${meta.color}35` : "var(--border)",
            background: entry.highlight
              ? `linear-gradient(135deg, ${meta.color}08, var(--card))`
              : "var(--card)",
          }}
        >
          {/* Card header */}
          <div
            className="flex items-start justify-between gap-3 px-4 sm:px-6 py-4 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <code className="text-xs sm:text-sm font-mono font-bold text-foreground/80">{entry.version}</code>
                <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}>
                  <Icon className="h-2.5 w-2.5" /> {meta.label}
                </span>
                {entry.highlight && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-400">
                    <Star className="h-2.5 w-2.5 fill-amber-400" /> Major
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto sm:ml-0">
                  <Clock className="h-3 w-3" /> {entry.date}
                </span>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground leading-snug">{entry.title}</h3>
              {entry.description && !expanded && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{entry.description}</p>
              )}
            </div>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0 mt-1">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </div>

          {/* Expandable body */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 sm:px-6 pb-5 border-t border-border/30 pt-4">
                  {entry.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{entry.description}</p>
                  )}
                  <ul className="space-y-2.5">
                    {entry.changes.map((change, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-start gap-3"
                      >
                        <div className="h-5 w-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                          style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                          <div className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
                        </div>
                        <span className="text-xs sm:text-sm text-foreground/60 leading-relaxed">{change}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   WHAT'S NEXT CARD
═══════════════════════════════════════════════════ */

function WhatsNext() {
  const upcoming = [
    { icon: Brain, label: "Natural language decision query engine", status: "In development", color: "#6366f1" },
    { icon: Bot, label: "Agent marketplace — pre-built decision agents", status: "Coming soon", color: "#a855f7" },
    { icon: Lock, label: "HIPAA compliance & healthcare vertical", status: "Q2 2026", color: "#3b82f6" },
    { icon: Zap, label: "Real-time decision simulation streaming", status: "Research", color: "#10b981" },
  ];

  return (
    <Reveal>
      <div className="rounded-2xl border border-border/60 bg-card/30 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-border/40 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">What's coming next</p>
            <p className="text-[10px] text-muted-foreground">StemmQ roadmap highlights</p>
          </div>
          <span className="ml-auto text-[9px] text-muted-foreground font-semibold uppercase tracking-widest border border-border/60 bg-muted/30 px-2 py-0.5 rounded-full">Roadmap</span>
        </div>
        <div className="p-4 sm:p-5 space-y-2.5">
          {upcoming.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-muted/20">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}20` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                </div>
                <span className="text-xs sm:text-sm text-foreground/60 flex-1 leading-snug">{item.label}</span>
                <span className="text-[9px] font-semibold text-right flex-shrink-0 px-2 py-0.5 rounded-full border"
                  style={{ color: item.color, background: `${item.color}10`, borderColor: `${item.color}20` }}>
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
        <div className="px-5 sm:px-6 py-4 border-t border-border/40">
          <p className="text-xs text-muted-foreground text-center">
            Vote on features and suggest ideas in our{" "}
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">community roadmap →</a>
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════
   SUBSCRIBE STRIP
═══════════════════════════════════════════════════ */

function SubscribeStrip() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <Reveal>
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/8 to-violet-500/5 p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.12), transparent 60%)" }} />
        <div className="relative">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">Stay up to date</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Get notified when we ship new features. No spam — just product updates.
          </p>
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-semibold">You're subscribed!</span>
              </motion.div>
            ) : (
              <motion.div key="form" className="flex gap-2 max-w-sm mx-auto">
                <input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)}
                  className="flex-1 h-10 rounded-xl border border-border bg-muted/40 px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => email && setDone(true)}
                  className="h-10 px-5 rounded-xl text-xs font-semibold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                  Subscribe
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a href="#" className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground/55 transition-colors">
              <Rss className="h-3 w-3" /> RSS Feed
            </a>
            <span className="text-foreground/15">·</span>
            <a href="#" className="text-[10px] text-muted-foreground hover:text-foreground/55 transition-colors">X / Twitter</a>
            <span className="text-foreground/15">·</span>
            <a href="#" className="text-[10px] text-muted-foreground hover:text-foreground/55 transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <ChangelogHero />

      {/* Main content: timeline + sidebar */}
      <section className="py-10 sm:py-14 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">

            {/* ── Timeline ── */}
            <div className="lg:col-span-2">
              <div className="space-y-0">
                {entries.map((entry, i) => (
                  <ChangelogEntry key={entry.version} entry={entry} index={i} />
                ))}

                {/* End of timeline */}
                <Reveal className="flex items-center gap-4 pl-12 sm:pl-16 pb-4">
                  <div className="h-px flex-1 bg-border/40" />
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest flex-shrink-0">End of changelog</span>
                  <div className="h-px flex-1 bg-border/40" />
                </Reveal>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-5 lg:sticky lg:top-24">

              {/* Version summary */}
              <Reveal>
                <div className="rounded-2xl border border-border/60 bg-card/30 p-4 sm:p-5">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold mb-4">Release Summary</p>
                  <div className="space-y-2.5">
                    {Object.entries(categoryMeta).map(([cat, meta]) => {
                      const count = entries.filter(e => e.category === cat).length;
                      if (!count) return null;
                      const Icon = meta.icon;
                      return (
                        <div key={cat} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                              <Icon className="h-3 w-3" style={{ color: meta.color }} />
                            </div>
                            <span className="text-xs text-foreground/55">{meta.label}</span>
                          </div>
                          <span className="text-xs font-bold tabular-nums" style={{ color: meta.color }}>{count}</span>
                        </div>
                      );
                    })}
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">Total releases</span>
                      <span className="text-xs font-bold text-foreground">{entries.length}</span>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Jump to version */}
              <Reveal delay={0.06}>
                <div className="rounded-2xl border border-border/60 bg-card/30 p-4 sm:p-5">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">Jump to Version</p>
                  <div className="space-y-1">
                    {entries.map((e) => {
                      const meta = categoryMeta[e.category];
                      const Icon = meta.icon;
                      return (
                        <a key={e.version} href={`#${e.version}`}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted/40 transition-colors group">
                          <div className="h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0"
                            style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                            <Icon className="h-2.5 w-2.5" style={{ color: meta.color }} />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-foreground/50 group-hover:text-foreground/80 transition-colors">{e.version}</span>
                          <span className="text-[9px] text-muted-foreground truncate hidden sm:block">{e.title.slice(0, 22)}…</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </Reveal>

              <WhatsNext />
              <SubscribeStrip />
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
