"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, XCircle, Target, Brain, Layers, Sparkles,
  ArrowRight, TrendingUp, Shield, Zap, Users, Star,
  Building2, Quote, ChevronRight, Database, Network
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

function useCounter(end: number, duration = 1800, trigger = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let s = 0; const step = end / (duration / 16);
    const t = setInterval(() => {
      s += step; if (s >= end) { setCount(end); clearInterval(t); }
      else setCount(Math.floor(s));
    }, 16);
    return () => clearInterval(t);
  }, [end, duration, trigger]);
  return count;
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */

const teamMembers = [
  { name: "Alex Morgan", role: "CEO & Co-founder", initials: "AM", color: "#6366f1" },
  { name: "Jordan Lee", role: "CTO & Co-founder", initials: "JL", color: "#a855f7" },
  { name: "Sam Patel", role: "Head of Product", initials: "SP", color: "#10b981" },
  { name: "Taylor Kim", role: "Head of Engineering", initials: "TK", color: "#f59e0b" },
  { name: "Riley Chen", role: "Head of Design", initials: "RC", color: "#3b82f6" },
  { name: "Casey Zhang", role: "Head of Growth", initials: "CZ", color: "#ef4444" },
];

const orgStats = [
  { value: 2023, suffix: "", label: "Founded", color: "#6366f1" },
  { value: 18, suffix: "+", label: "Team members", color: "#a855f7" },
  { value: 2400, suffix: "+", label: "Enterprise teams", color: "#10b981" },
  { value: 91, suffix: "%", label: "Agent approval rate", color: "#f59e0b" },
];

const principles = [
  {
    icon: Target, color: "#6366f1",
    title: "Decisions over opinions",
    desc: "Every strategic direction at StemmQ is a Structured Decision Object — with owner, assumptions, and DQS. We eat our own cooking.",
  },
  {
    icon: Brain, color: "#a855f7",
    title: "Infrastructure over process",
    desc: "Process documents get forgotten. Infrastructure runs whether you remember to use it or not. We build the latter.",
  },
  {
    icon: Layers, color: "#3b82f6",
    title: "Transparency over assumption",
    desc: "We make our assumptions explicit — in product decisions, company strategy, and how we work with our team.",
  },
];

const beforeAfter = {
  before: [
    "Strategic decisions made in Slack threads",
    "Assumptions buried in decks, never validated",
    "AI agents act without governance or audit trail",
    "Leadership transitions destroy institutional memory",
    "No way to know which decisions actually worked",
  ],
  after: [
    "Every decision is a Structured Decision Object",
    "Assumptions tracked, weighted, and validated over time",
    "Every agent action goes through the Decision Gate",
    "Institutional memory preserved and queryable forever",
    "Outcome tracking reveals which decisions drove results",
  ],
};

const milestones = [
  { year: "2023", title: "Company founded", desc: "Built first prototype after watching a $12M strategy fail because of one unexamined assumption.", color: "#6366f1" },
  { year: "Q1 2024", title: "First 100 beta users", desc: "Product-market fit confirmed with enterprise strategy teams and VC-backed startups.", color: "#8b5cf6" },
  { year: "Q3 2024", title: "Decision Gate launched", desc: "AI governance layer shipped — the first infrastructure to govern autonomous agent decisions.", color: "#a855f7" },
  { year: "Q1 2025", title: "2,000 teams onboarded", desc: "Crossed 2,000 enterprise teams. SOC 2 Type II certified. Series A closed.", color: "#3b82f6" },
  { year: "2026", title: "Public Beta", desc: "Opening the platform to all teams worldwide. Decision infrastructure for every organization.", color: "#10b981" },
];

const investorQuote = {
  quote: "StemmQ is building the missing layer of organizational intelligence. Every company with more than 10 people needs this.",
  name: "Arjun Mehta", role: "Partner", company: "Sequoia Capital", initials: "AM",
};

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */

function AboutHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-20 bg-background">
      <AnimatedGradient intensity="subtle" />
      <Orb delay={0} className="absolute top-[-8%] right-[-3%] w-[440px] h-[440px] rounded-full bg-indigo-600/10 blur-[110px] pointer-events-none" />
      <Orb delay={4} className="absolute bottom-[-5%] left-[-3%] w-[360px] h-[360px] rounded-full bg-violet-600/8 blur-[90px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> About StemmQ
          </span>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <Reveal delay={0.07}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.06] mb-5">
                Decisions should be an{" "}
                <span style={{ background: "linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  asset
                </span>
                , not a liability.
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                StemmQ was founded on a simple observation: organizations invest heavily in data,
                product, and engineering infrastructure — but leave the most consequential thing
                they do to chance. Decision-making.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={ROUTES.auth}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-xl shadow-indigo-500/25 w-full sm:w-auto justify-center"
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
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-foreground/80 border border-border/50 bg-muted/30 hover:bg-muted/50 hover:text-foreground transition-all w-full sm:w-auto justify-center">
                    See the Platform
                  </motion.button>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right: animated "founding story" card */}
          <Reveal delay={0.16} direction="right">
            <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden shadow-2xl shadow-black/10">
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">The Origin</span>
                </div>
                <blockquote className="text-sm text-foreground/65 leading-relaxed border-l-2 border-indigo-500/40 pl-4">
                  "We watched a $12M strategy fail because of one assumption nobody wrote down.
                  The data was there. The team was talented. The decision had just never been structured."
                </blockquote>
                <div className="flex items-center gap-3 pt-1">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>AM</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground/75">Alex Morgan</p>
                    <p className="text-[10px] text-muted-foreground">CEO & Co-founder, StemmQ</p>
                  </div>
                </div>

                {/* Mini org stats */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {[
                    { v: "2023", l: "Founded", c: "#6366f1" },
                    { v: "18+", l: "Team members", c: "#a855f7" },
                    { v: "SOC 2", l: "Certified", c: "#10b981" },
                    { v: "Series A", l: "Funded", c: "#f59e0b" },
                  ].map(s => (
                    <div key={s.l} className="rounded-xl border border-border/40 bg-muted/20 p-2.5">
                      <p className="text-sm font-bold" style={{ color: s.c }}>{s.v}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   STATS SECTION — animated counters
═══════════════════════════════════════════════════ */

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const counts = orgStats.map((stat) => useCounter(stat.value, 1800, inView));

  return (
    <section ref={ref} className="py-12 sm:py-14 border-y border-border/50 bg-card/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {orgStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="text-center p-4 sm:p-5 rounded-2xl border border-border/50 bg-card/40 hover:border-border transition-colors">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums mb-1" style={{ color: stat.color }}>
                  {counts[i]}{stat.suffix}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MISSION + VISION
═══════════════════════════════════════════════════ */

function MissionVisionSection() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-4">
            Why We Exist
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Purpose-built for{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              organizational intelligence
            </span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {[
            {
              icon: Target, color: "#6366f1",
              title: "Our Mission",
              desc: "To give every organization the infrastructure to make strategic decisions that are structured, traceable, and continuously improving.",
              detail: "We don't just track decisions — we make the entire decision-making process into a compounding organizational asset.",
            },
            {
              icon: Brain, color: "#a855f7",
              title: "Our Vision",
              desc: "A world where no critical assumption goes unexamined, no strategic decision is made without context, and organizational knowledge compounds rather than decays.",
              detail: "We're building the infrastructure layer that sits beneath every strategy, every team, and every AI agent in your organization.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} direction={i === 0 ? "left" : "right"} delay={i * 0.08}>
                <div className="rounded-2xl border p-6 sm:p-8 h-full"
                  style={{ borderColor: `${item.color}20`, background: `${item.color}05` }}>
                  <div className="h-11 w-11 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                  <div className="rounded-xl border border-border/50 bg-card/40 p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">{item.detail}</p>
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
   BEFORE / AFTER — animated comparison
═══════════════════════════════════════════════════ */

function BeforeAfterSection() {
  return (
    <section className="py-16 sm:py-20 bg-card/40 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/6 px-4 py-1.5 text-xs font-medium text-red-300 mb-4">
            The Problem
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Organizations have no{" "}
            <span style={{ background: "linear-gradient(135deg,#ef4444,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              decision infrastructure
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Every company has data infrastructure. Most have engineering infrastructure.
            Almost none have decision infrastructure.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Without */}
          <Reveal direction="left">
            <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent p-5 sm:p-7 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <span className="text-sm font-bold text-foreground">Without StemmQ</span>
              </div>
              <div className="space-y-3">
                {beforeAfter.before.map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 p-3 rounded-xl border border-red-500/10 bg-red-500/4">
                    <div className="h-5 w-5 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <XCircle className="h-3 w-3 text-red-400" />
                    </div>
                    <span className="text-xs sm:text-sm text-foreground/80">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* With */}
          <Reveal direction="right" delay={0.08}>
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-5 sm:p-7 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-foreground">With StemmQ</span>
              </div>
              <div className="space-y-3">
                {beforeAfter.after.map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 p-3 rounded-xl border border-emerald-500/10 bg-emerald-500/4">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-xs sm:text-sm text-foreground/80">{item}</span>
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
   PRINCIPLES
═══════════════════════════════════════════════════ */

function PrinciplesSection() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-4">
            Our Principles
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            How we{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              think
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">The values that drive every decision we make at StemmQ — including the decision to build StemmQ.</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.09}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative rounded-2xl border border-border/50 bg-card/40 p-5 sm:p-7 h-full overflow-hidden transition-all hover:border-border"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `radial-gradient(circle at 30% 20%, ${p.color}08, transparent 60%)` }} />
                  <div className="relative">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: `${p.color}15`, border: `1px solid ${p.color}25` }}>
                      <Icon className="h-5 w-5" style={{ color: p.color }} />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground mb-3">{p.title}</h3>
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
   TIMELINE — company journey
═══════════════════════════════════════════════════ */

function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(4); // latest by default

  return (
    <section className="py-16 sm:py-20 bg-card/40 border-y border-border/50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-medium text-violet-300 mb-4">
            Our Journey
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            From insight to{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              infrastructure
            </span>
          </h2>
        </Reveal>

        <div ref={ref} className="relative">
          {/* Vertical line desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2" />

          <div className="space-y-6 md:space-y-0">
            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              const isActive = active === i;
              return (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  onClick={() => setActive(i)}
                  className={`md:grid md:grid-cols-2 md:gap-8 items-center cursor-pointer group ${isLeft ? "" : "md:text-right"}`}
                >
                  {/* Content */}
                  <div className={`${isLeft ? "md:pr-8" : "md:order-2 md:pl-8"}`}>
                    <motion.div
                      animate={{ borderColor: isActive ? `${m.color}40` : "var(--border)", background: isActive ? `${m.color}06` : "var(--card)" }}
                      className="rounded-2xl border p-4 sm:p-5 mb-4 md:mb-0 transition-all"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: m.color }}>{m.year}</p>
                      <h3 className="text-sm sm:text-base font-bold text-foreground mb-1.5">{m.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                    </motion.div>
                  </div>

                  {/* Center dot */}
                  <div className={`hidden md:flex justify-center items-center ${isLeft ? "" : "md:order-1"}`}>
                    <motion.div
                      animate={{ scale: isActive ? 1.3 : 1, boxShadow: isActive ? `0 0 0 4px ${m.color}20` : "none" }}
                      className="h-4 w-4 rounded-full border-2 z-10 transition-all"
                      style={{ background: isActive ? m.color : "var(--card)", borderColor: isActive ? m.color : "var(--border)" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TEAM
═══════════════════════════════════════════════════ */

function TeamSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-4">
            <Users className="h-3.5 w-3.5" /> The Team
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            The people building{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              StemmQ
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">A small, focused team building infrastructure that matters.</p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 mb-10">
          {teamMembers.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.06}>
              <motion.div
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center text-center group cursor-default"
              >
                <div className="relative mb-3">
                  {/* Glow ring */}
                  <motion.div
                    animate={{ opacity: hovered === i ? 1 : 0, scale: hovered === i ? 1.15 : 1 }}
                    className="absolute inset-0 rounded-full blur-md transition-all"
                    style={{ background: member.color, opacity: 0 }}
                  />
                  <div
                    className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center text-sm sm:text-base font-bold text-white shadow-lg transition-transform"
                    style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}88)` }}
                  >
                    {member.initials}
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground/80">{member.name}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 leading-snug">{member.role}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Hiring banner */}
        <Reveal>
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 text-center">
            <p className="text-sm font-semibold text-foreground/70 mb-1">We're hiring</p>
            <p className="text-xs text-muted-foreground mb-4">Join us in building the decision infrastructure for the world's best organizations.</p>
            <a href="/careers">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-foreground/60 border border-border bg-muted/30 hover:bg-muted/50 transition-all">
                View Open Roles <ArrowRight className="h-3.5 w-3.5" />
              </motion.button>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   INVESTOR QUOTE
═══════════════════════════════════════════════════ */

function InvestorQuoteSection() {
  return (
    <section className="py-12 sm:py-14 border-y border-border/50 bg-card/40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="relative rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/8 to-violet-500/4 p-6 sm:p-10 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex justify-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <Quote className="h-7 w-7 text-indigo-400/25 mx-auto mb-4" />
              <blockquote className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed font-medium mb-6">
                "{investorQuote.quote}"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>
                  {investorQuote.initials}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{investorQuote.name}</p>
                  <p className="text-xs text-muted-foreground">{investorQuote.role} · {investorQuote.company}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   BOTTOM CTA
═══════════════════════════════════════════════════ */

function AboutCTA() {
  return (
    <section className="py-14 sm:py-16 bg-background border-t border-border/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/8 to-violet-500/5 p-7 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 60%)" }} />
            <div className="relative">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
                Ready to build decision infrastructure?
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-7">
                Join 2,400+ teams using StemmQ to make decisions that compound over time.
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
                <Link href="/careers">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-foreground/60 border border-border bg-muted/30 hover:bg-muted/50 hover:text-foreground transition-all w-full sm:w-auto justify-center">
                    <Users className="h-4 w-4" /> Join the Team
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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <AboutHero />
      <StatsSection />
      <MissionVisionSection />
      <BeforeAfterSection />
      <PrinciplesSection />
      <TimelineSection />
      <TeamSection />
      <InvestorQuoteSection />
      <AboutCTA />
      <MarketingFooter />
    </div>
  );
}