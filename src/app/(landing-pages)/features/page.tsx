"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Target, Gauge, Activity, Building2, Network,
  BarChart3, FileText, Handshake, Bot, ShieldCheck, ScanSearch
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { CTASection } from "@/components/marketing/cta-section";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeader } from "@/components/marketing/section-header";
import { MockBrowser, MockDecisionCard, MockAgentFeed } from "@/components/marketing/mock-ui";
import { cn } from "@/lib/utils";

const categories = [
  {
    id: "intelligence",
    label: "Intelligence Core",
    features: [
      { icon: Brain, title: "Decision Intelligence Engine", desc: "Capture every decision as a Structured Decision Object with intent, context, and DQS scoring." },
      { icon: Gauge, title: "Decision Quality Score", desc: "Composite scoring from assumption coverage, data quality, and historical accuracy." },
      { icon: ScanSearch, title: "Pattern Recognition", desc: "Detect recurring decision patterns and organizational behavioral tendencies." },
      { icon: Target, title: "Assumption Calibration", desc: "Track, validate, and challenge every assumption behind every decision." },
    ],
    mockType: "decisions",
  },
  {
    id: "simulation",
    label: "Simulation & Modeling",
    features: [
      { icon: Activity, title: "Probabilistic Simulation", desc: "Monte Carlo simulation for complex strategic scenarios with confidence intervals." },
      { icon: Network, title: "Decision Graph", desc: "Visualize relationships between decisions, assumptions, and outcomes." },
      { icon: BarChart3, title: "Visual Intelligence", desc: "Executive dashboards with real-time strategic health indicators." },
      { icon: Building2, title: "Institutional Continuity", desc: "Preserve strategic context through leadership transitions and generate decision briefs." },
    ],
    mockType: "analytics",
  },
  {
    id: "governance",
    label: "AI Governance",
    features: [
      { icon: Bot, title: "Autonomous Agent Layer", desc: "Create AI agents with a no-code builder. Every action generates a structured decision that flows through the Decision Gate." },
      { icon: ShieldCheck, title: "Autonomous Audit", desc: "Complete decision audit trails with immutable logs and compliance tracking." },
      { icon: Handshake, title: "CRM Validation", desc: "Cross-reference strategic decisions with CRM data to validate assumptions." },
      { icon: FileText, title: "Document Intelligence", desc: "Extract decisions and strategic signals from PDFs, presentations, and docs automatically." },
    ],
    mockType: "agents",
  },
];

const stats = [
  { value: "12", label: "Interconnected Modules" },
  { value: "5", label: "Strategic Intent Types" },
  { value: "360°", label: "Audit Coverage" },
  { value: "100%", label: "Agent Action Visibility" },
];

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState("intelligence");
  const active = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <FadeIn>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Features</span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Everything your organization needs to{" "}
              <span className="gradient-text">decide better</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              12 interconnected modules that work together as a complete decision intelligence system.
              Not tools. Infrastructure.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-5 py-2.5 rounded-lg text-sm font-medium transition-all border",
                  activeCategory === cat.id
                    ? "bg-accent text-white border-accent shadow-md shadow-accent/20"
                    : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {active.features.map((feature, i) => (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-accent/30 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                      <feature.icon className="h-4.5 w-4.5 text-accent" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <div>
                {active.mockType === "agents" ? (
                  <MockBrowser>
                    <MockAgentFeed />
                  </MockBrowser>
                ) : active.mockType === "decisions" ? (
                  <MockBrowser>
                    <div className="space-y-3">
                      <MockDecisionCard title="Expand into EMEA market Q1" intent="Growth" dqs={87} />
                      <MockDecisionCard title="Launch React SDK" intent="Efficiency" dqs={72} status="active" />
                      <MockDecisionCard title="Reduce ops headcount by 10%" intent="Efficiency" dqs={59} status="draft" />
                    </div>
                  </MockBrowser>
                ) : (
                  <MockBrowser>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "DQS Trend", value: "+12.3%" },
                          { label: "Accuracy", value: "84.1%" },
                          { label: "Decisions", value: "47 active" },
                          { label: "Agents", value: "3 running" },
                        ].map((m) => (
                          <div key={m.label} className="rounded-lg border border-border bg-background/50 p-3">
                            <div className="text-[10px] text-muted-foreground">{m.label}</div>
                            <div className="text-sm font-bold text-foreground mt-1">{m.value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-lg border border-border bg-background/50 p-3 h-20">
                        <div className="text-[10px] text-muted-foreground mb-2">Decision Quality Trend</div>
                        <div className="flex items-end gap-1 h-10">
                          {[40, 55, 48, 62, 58, 70, 74, 68, 79, 75, 83, 80].map((h, i) => (
                            <div key={i} className="flex-1 rounded-sm bg-accent/20" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </MockBrowser>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Full Feature Grid */}
      <FeatureGrid />

      {/* Stats Band */}
      <section className="py-16 bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <MarketingFooter />
    </div>
  );
}
