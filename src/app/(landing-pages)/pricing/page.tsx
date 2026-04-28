"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  CheckCircle2, Minus, Quote, Shield, Building2,
  ArrowRight, Sparkles, Star, TrendingUp, Users, ChevronDown
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════ */

function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [-15, 15, -15], x: [-8, 8, -8] }}
      transition={{ duration: 10 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    />
  );
}

function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   FAQ
═══════════════════════════════════════════════════ */

const faq = [
  {
    q: "Is the Free plan really free forever?",
    a: "Yes. No credit card required, no trial period. The Free plan gives you up to 30 decisions and core features with no time limit.",
  },
  {
    q: "What's included in the 'Decision Gate' on all plans?",
    a: "Every plan includes the basic Decision Gate for evaluating and approving decisions. Enterprise adds the full agent governance system, audit logs, and custom approval workflows.",
  },
  {
    q: "Can I change plans at any time?",
    a: "Yes. Upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle. Your data is always preserved.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards. Enterprise plans support invoice billing and purchase orders.",
  },
  {
    q: "Is there a setup fee?",
    a: "No. All plans include free setup, onboarding guidance, and migration support.",
  },
  {
    q: "Do you offer discounts for nonprofits or education?",
    a: "Yes. Contact us for special pricing for qualified nonprofit organizations and educational institutions.",
  },
  {
    q: "How do AI decision agents work on Enterprise?",
    a: "Enterprise includes a full agent governance system — AI agents can propose decisions that route through the Decision Gate for human review, with a complete audit trail and configurable risk thresholds.",
  },
];

/* ═══════════════════════════════════════════════════
   COMPARISON TABLE
═══════════════════════════════════════════════════ */

type CellVal = "yes" | "no" | "partial" | string;

const comparisonCategories = [
  {
    label: "Core",
    rows: [
      { feature: "Decisions per month",          free: "30",        pro: "Unlimited",  enterprise: "Unlimited"  },
      { feature: "Team members",                 free: "1",         pro: "Unlimited",  enterprise: "Unlimited"  },
      { feature: "Assumption tracking",          free: "yes",       pro: "yes",        enterprise: "yes"        },
      { feature: "Decision Quality Score (DQS)", free: "yes",       pro: "yes",        enterprise: "yes"        },
      { feature: "Decision history",             free: "Limited",   pro: "Full",       enterprise: "Full"       },
      { feature: "Basic dashboard insights",     free: "yes",       pro: "yes",        enterprise: "yes"        },
    ],
  },
  {
    label: "Intelligence",
    rows: [
      { feature: "AI-assisted assumptions",      free: "partial",   pro: "yes",        enterprise: "yes"        },
      { feature: "Advanced AI reasoning",        free: "no",        pro: "yes",        enterprise: "yes"        },
      { feature: "Simulations (what-if)",        free: "no",        pro: "yes",        enterprise: "yes"        },
      { feature: "Decision analytics & trends",  free: "no",        pro: "yes",        enterprise: "yes"        },
      { feature: "Document intelligence",        free: "no",        pro: "yes",        enterprise: "yes"        },
      { feature: "Strategy graph engine",        free: "no",        pro: "no",         enterprise: "yes"        },
    ],
  },
  {
    label: "Collaboration",
    rows: [
      { feature: "Team collaboration",           free: "no",        pro: "yes",        enterprise: "yes"        },
      { feature: "Role-based permissions",        free: "no",        pro: "no",         enterprise: "yes"        },
      { feature: "CRM & external integrations",  free: "no",        pro: "no",         enterprise: "yes"        },
    ],
  },
  {
    label: "AI Governance",
    rows: [
      { feature: "Decision Gate (basic)",         free: "yes",       pro: "yes",        enterprise: "yes"        },
      { feature: "AI decision agents",            free: "no",        pro: "no",         enterprise: "yes"        },
      { feature: "Agent governance system",       free: "no",        pro: "no",         enterprise: "yes"        },
      { feature: "Audit logs & compliance",       free: "no",        pro: "no",         enterprise: "yes"        },
      { feature: "Advanced simulations",          free: "no",        pro: "no",         enterprise: "yes"        },
    ],
  },
  {
    label: "Support & Security",
    rows: [
      { feature: "Email support",                free: "yes",       pro: "yes",        enterprise: "yes"        },
      { feature: "Priority support",             free: "no",        pro: "yes",        enterprise: "yes"        },
      { feature: "Dedicated onboarding",         free: "no",        pro: "no",         enterprise: "yes"        },
      { feature: "SSO / SAML",                   free: "no",        pro: "no",         enterprise: "yes"        },
      { feature: "Custom SLA",                   free: "no",        pro: "no",         enterprise: "yes"        },
      { feature: "Invoice billing & MSA",        free: "no",        pro: "no",         enterprise: "yes"        },
    ],
  },
];

const tableCols = [
  { key: "free",       label: "Free",       highlight: false },
  { key: "pro",        label: "Pro",        highlight: true  },
  { key: "enterprise", label: "Enterprise", highlight: false },
];

function CellValue({ value }: { value: CellVal }) {
  if (value === "yes") return (
    <div className="flex justify-center">
      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    </div>
  );
  if (value === "no") return (
    <div className="flex justify-center">
      <Minus className="h-4 w-4 text-foreground/15" />
    </div>
  );
  if (value === "partial") return (
    <div className="flex justify-center">
      <div className="h-1.5 w-4 rounded-full bg-amber-400/55" />
    </div>
  );
  return <span className="text-[11px] font-semibold text-foreground/65 block text-center">{value}</span>;
}

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */

function PricingHero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 pb-2 bg-background">
      <Orb delay={0} className="absolute top-[-8%] left-[-4%] w-[420px] h-[420px] rounded-full bg-indigo-600/9 blur-[110px] pointer-events-none" />
      <Orb delay={3} className="absolute top-[-5%] right-[-4%] w-[340px] h-[340px] rounded-full bg-violet-600/7 blur-[90px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <Reveal>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.08] mb-4">
            Plans for every stage of{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              decision intelligence
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Start free. No credit card required. Scale as your decision infrastructure matures.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   COMPARISON TABLE SECTION
═══════════════════════════════════════════════════ */

function ComparisonTable() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-16 sm:py-20 bg-background border-t border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
            Compare all features
          </h2>
          <p className="text-sm text-muted-foreground">Everything side by side so you can choose with confidence.</p>
        </Reveal>

        <div ref={ref} className="overflow-x-auto rounded-xl border border-border bg-card/40">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 sm:px-5 text-xs font-medium text-muted-foreground w-[44%]" />
                {tableCols.map((col) => (
                  <th key={col.key}
                    className={`py-4 px-3 sm:px-5 text-center ${col.highlight ? "bg-[#6366f1]/7" : ""}`}>
                    <span className={`text-xs font-bold ${col.highlight ? "text-[var(--accent)]" : "text-foreground/60"}`}>
                      {col.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonCategories.map((cat, catIdx) => (
                <>
                  <tr key={cat.label + "-h"} className={catIdx > 0 ? "border-t border-border/50" : ""}>
                    <td colSpan={4} className="pt-5 pb-2 px-4 sm:px-5">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/30">{cat.label}</span>
                    </td>
                  </tr>
                  {cat.rows.map((row, ri) => (
                    <motion.tr key={row.feature}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: (catIdx * 5 + ri) * 0.022 }}
                      className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-4 sm:px-5 text-[11px] sm:text-xs text-foreground/55">{row.feature}</td>
                      <td className="py-3 px-3 sm:px-5"><CellValue value={row.free} /></td>
                      <td className="py-3 px-3 sm:px-5 bg-[#6366f1]/[0.04]"><CellValue value={row.pro} /></td>
                      <td className="py-3 px-3 sm:px-5"><CellValue value={row.enterprise} /></td>
                    </motion.tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-foreground/30 px-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Included
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-3.5 rounded-full bg-amber-400/55" /> Limited
          </div>
          <div className="flex items-center gap-1.5">
            <Minus className="h-3.5 w-3.5 text-foreground/20" /> Not included
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FAQ
═══════════════════════════════════════════════════ */

function FAQItem({ item, i }: { item: typeof faq[0]; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={i * 0.04}>
      <div onClick={() => setOpen(!open)}
        className={`rounded-xl border cursor-pointer overflow-hidden transition-all ${
          open
            ? "border-[var(--accent)]/25 bg-[var(--accent)]/[0.04]"
            : "border-border/60 bg-card/40 hover:border-border"
        }`}>
        <div className="flex items-center justify-between gap-4 px-4 sm:px-5 py-4">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground/80 leading-snug">{item.q}</h3>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }} className="flex-shrink-0">
            <ChevronDown className={`h-4 w-4 ${open ? "text-[var(--accent)]" : "text-foreground/25"}`} />
          </motion.div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="px-4 sm:px-5 pb-4">
                <div className="h-px bg-border mb-3.5" />
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

function FAQSection() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
            Frequently asked questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Still have questions?{" "}
            <a href="/contact" className="text-[var(--accent)] hover:opacity-80 transition-opacity">
              Contact us →
            </a>
          </p>
        </Reveal>
        <div className="space-y-2">
          {faq.map((item, i) => <FAQItem key={item.q} item={item} i={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   BOTTOM CTA
═══════════════════════════════════════════════════ */

function BottomCTA() {
  return (
    <section className="py-14 sm:py-16 border-t border-border bg-background relative overflow-hidden">
      <Orb delay={1} className="absolute inset-0 m-auto w-[500px] h-[260px] rounded-full bg-indigo-600/7 blur-[100px] pointer-events-none" />
      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <Reveal>
          <div className="rounded-2xl border border-[var(--accent)]/18 bg-gradient-to-br from-[var(--accent)]/7 to-violet-500/4 p-8 sm:p-10">
            <div className="flex justify-center gap-2 mb-5">
              {[TrendingUp, Shield, Users].map((Icon, i) => (
                <div key={i} className="h-9 w-9 rounded-xl bg-muted/60 border border-border flex items-center justify-center">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
              Start making decisions that{" "}
              <span style={{ background: "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                compound
              </span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-7">
              Join 2,400+ teams using StemmQ to build decision infrastructure that gets smarter over time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={ROUTES.auth}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="relative group inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-lg shadow-indigo-500/20 w-full sm:w-auto justify-center"
                  style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                  <span className="relative z-10 flex items-center gap-2">
                    Get started free
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                </motion.button>
              </Link>
              <a href="/contact">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-foreground/60 border border-border bg-muted/30 hover:bg-muted/60 hover:text-foreground transition-all w-full sm:w-auto justify-center">
                  Talk to sales
                </motion.button>
              </a>
            </div>
            <p className="mt-4 text-[11px] text-foreground/30">Free plan available · No credit card required</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <PricingHero />
      <PricingCards />
      <ComparisonTable />
      <FAQSection />
      <BottomCTA />
      <MarketingFooter />
    </div>
  );
}
