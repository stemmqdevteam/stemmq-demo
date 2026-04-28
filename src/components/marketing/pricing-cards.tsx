"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles, Zap, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   PLANS
═══════════════════════════════════════════════════ */

const plans = [
  {
    id: "free",
    name: "Free",
    icon: Zap,
    price: { monthly: 0, yearly: 0 },
    unit: "forever",
    desc: "Experience structured decision-making with core intelligence features.",
    cta: "Get started",
    ctaHref: "/auth?plan=free",
    sectionLabel: "Includes:",
    features: [
      "Up to 30 decisions",
      "Single user",
      "Assumption tracking",
      "Basic AI-assisted assumptions (limited)",
      "Decision Quality Score (DQS)",
      "Basic dashboard insights",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Sparkles,
    price: { monthly: 24, yearly: 18 },
    unit: "per member / month",
    desc: "For teams that want deeper intelligence, simulations, and collaboration.",
    cta: "Start Pro",
    ctaHref: "/auth?plan=pro",
    sectionLabel: "Everything in Free, plus:",
    features: [
      "Unlimited decisions",
      "Team collaboration",
      "Advanced AI reasoning",
      "Simulations (what-if analysis)",
      "Decision analytics & trends",
      "Document intelligence",
      "Full history & insights",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    price: { monthly: null, yearly: null },
    unit: "Custom pricing",
    desc: "Full decision intelligence infrastructure with governance, agents, and integrations.",
    cta: "Contact Sales",
    ctaHref: "/contact",
    sectionLabel: "Everything in Pro, plus:",
    features: [
      "AI decision agents",
      "Agent governance system",
      "Audit logs & compliance",
      "Strategy graph engine",
      "Advanced simulations",
      "CRM & external integrations",
      "Role-based permissions",
      "Dedicated onboarding & support",
    ],
  },
];

/* ═══════════════════════════════════════════════════
   PRICE DISPLAY
═══════════════════════════════════════════════════ */

function PriceDisplay({ plan, billing }: { plan: typeof plans[0]; billing: "monthly" | "yearly" }) {
  const current = plan.price[billing];

  if (current === null) {
    return (
      <div className="mb-5">
        <p className="text-2xl sm:text-3xl font-bold text-foreground">Custom</p>
        <p className="text-xs text-muted-foreground mt-1">pricing</p>
      </div>
    );
  }

  if (current === 0) {
    return (
      <div className="mb-5">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-foreground">$0</span>
          <span className="text-sm text-muted-foreground">{plan.unit}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div className="flex items-baseline gap-2">
        <AnimatePresence mode="wait">
          <motion.span
            key={current}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.16 }}
            className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums"
          >
            ${current}
          </motion.span>
        </AnimatePresence>
        <span className="text-sm text-muted-foreground">{plan.unit}</span>
      </div>
      <AnimatePresence>
        {billing === "yearly" && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[11px] text-emerald-400 mt-1.5"
          >
            Billed annually — save ${(plan.price.monthly! - current) * 12}/seat/yr
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PLAN CARD
═══════════════════════════════════════════════════ */

function PlanCard({ plan, billing }: { plan: typeof plans[0]; billing: "monthly" | "yearly" }) {
  const Icon = plan.icon;
  const isPro = plan.id === "pro";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative flex flex-col rounded-xl border h-full overflow-hidden",
        isPro
          ? "border-[var(--accent)]/45 bg-card"
          : "border-border/60 bg-card/50"
      )}
    >
      {/* Pro — top accent line */}
      {isPro && (
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, #6366f1, #a855f7, transparent)" }}
        />
      )}

      <div className="flex flex-col flex-1 p-5 sm:p-7">

        {/* Icon + Plan name */}
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: isPro ? "rgba(99,102,241,0.18)" : "var(--muted)",
              border: isPro ? "1px solid rgba(99,102,241,0.3)" : "1px solid var(--border)",
            }}
          >
            <Icon className="h-4 w-4" style={{ color: isPro ? "#818cf8" : "var(--muted-foreground)" }} />
          </div>
          <p className="text-sm font-bold text-foreground">{plan.name}</p>
        </div>

        {/* Price */}
        <PriceDisplay plan={plan} billing={billing} />

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-5">{plan.desc}</p>

        {/* CTA button */}
        <Link href={plan.ctaHref} className="block mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "relative w-full py-2.5 rounded-lg text-sm font-semibold text-center overflow-hidden group transition-all",
              isPro
                ? "text-white shadow-md shadow-indigo-500/20"
                : plan.id === "enterprise"
                  ? "text-foreground/60 border border-border bg-transparent hover:bg-muted/40 hover:text-foreground/85"
                  : "text-(--accent) border border-(--accent)/30 bg-(--accent)/8 hover:bg-(--accent)/14"
            )}
            style={isPro ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)" } : {}}
          >
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              {plan.cta}
              {(isPro || plan.id === "free") && (
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              )}
            </span>
            {isPro && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            )}
          </motion.button>
        </Link>

        {/* Feature list */}
        <div className="border-t border-border/50 pt-5 flex-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3.5">
            {plan.sectionLabel}
          </p>
          <ul className="space-y-2.5">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check
                  className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
                  style={{ color: isPro ? "#818cf8" : "var(--muted-foreground)" }}
                />
                <span className="text-xs text-foreground/60 leading-snug">{f}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */

function PricingCards() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.07 }}
            className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto mb-8"
          >
            Start free. Scale as your decision intelligence matures.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-0.5"
          >
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={cn(
                  "relative px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all capitalize",
                  billing === b ? "text-foreground" : "text-muted-foreground hover:text-foreground/75"
                )}
              >
                {billing === b && (
                  <motion.div
                    layoutId="billing-tab"
                    className="absolute inset-0 rounded-md bg-card border border-border/60"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.32 }}
                  />
                )}
                <span className="relative z-10">{b}</span>
                {b === "yearly" && (
                  <span
                    className={cn(
                      "relative z-10 ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                      billing === "yearly"
                        ? "bg-emerald-500/18 text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    −25%
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-xs text-foreground/30 mt-8"
        >
          All plans include the Decision Gate.{" "}
          <a href="/contact" className="text-foreground/50 hover:text-foreground/75 transition-colors underline underline-offset-2">
            Talk to sales
          </a>{" "}
          for volume discounts or custom contracts.
        </motion.p>

      </div>
    </section>
  );
}

export { PricingCards };