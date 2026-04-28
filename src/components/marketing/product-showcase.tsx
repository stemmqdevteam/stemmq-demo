"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, GitBranch, Network, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    title: "Strategic Overview at a Glance",
    description: "Real-time KPIs, decision quality trends, assumption accuracy, and AI agent status — all in one unified command center.",
    mockup: () => (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {["Active Decisions", "Avg DQS", "Accuracy", "Confidence"].map((label, i) => (
            <div key={label} className="rounded-lg border border-border/50 bg-background/60 p-3">
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="mt-1 text-lg font-bold text-foreground">{["47", "78.4", "84%", "91.2"][i]}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/50 bg-background/60 p-3 h-28">
            <p className="text-[10px] text-muted-foreground mb-2">Quality Trend</p>
            <div className="flex items-end gap-0.5 h-16">
              {[40, 55, 45, 65, 52, 68, 72, 78, 82, 85, 80, 87].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-accent/30" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/60 p-3 h-28">
            <p className="text-[10px] text-muted-foreground mb-2">Activity Feed</p>
            <div className="space-y-2">
              {["Sarah updated expansion plan", "PricingAgent proposed discount", "Simulation completed"].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-accent/20" />
                  <span className="text-[9px] text-muted-foreground truncate">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "decisions",
    label: "Decisions",
    icon: GitBranch,
    title: "Structured Decision Objects",
    description: "Every strategic decision captured with context, assumptions, ownership, and quality scores. Never lose strategic context again.",
    mockup: () => (
      <div className="space-y-3">
        {[
          { title: "Expand into European market", intent: "Growth", dqs: 87, status: "Active" },
          { title: "Migrate to multi-cloud", intent: "Efficiency", dqs: 72, status: "Active" },
          { title: "AI-assisted onboarding", intent: "Growth", dqs: 91, status: "Active" },
        ].map((d, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 p-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{d.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent">{d.intent}</span>
                <span className="text-[9px] text-muted-foreground">{d.status}</span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className="text-sm font-bold text-foreground">{d.dqs}</p>
              <p className="text-[9px] text-muted-foreground">DQS</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "graph",
    label: "Strategy Graph",
    icon: Network,
    title: "Visualize Decision Networks",
    description: "See how decisions, assumptions, and outcomes connect. Identify dependencies, risks, and opportunities across your strategy.",
    mockup: () => (
      <div className="relative h-44 flex items-center justify-center">
        {/* SVG nodes and edges mockup */}
        <svg viewBox="0 0 300 160" className="w-full h-full">
          {/* Edges */}
          <line x1="150" y1="30" x2="70" y2="80" stroke="currentColor" strokeWidth="1" className="text-border" />
          <line x1="150" y1="30" x2="230" y2="80" stroke="currentColor" strokeWidth="1" className="text-border" />
          <line x1="70" y1="80" x2="40" y2="130" stroke="currentColor" strokeWidth="1" className="text-border" />
          <line x1="70" y1="80" x2="100" y2="130" stroke="currentColor" strokeWidth="1" className="text-border" />
          <line x1="230" y1="80" x2="200" y2="130" stroke="currentColor" strokeWidth="1" className="text-border" />
          <line x1="230" y1="80" x2="260" y2="130" stroke="currentColor" strokeWidth="1" className="text-border" />
          {/* Nodes */}
          <circle cx="150" cy="30" r="12" className="fill-accent/20 stroke-accent" strokeWidth="1.5" />
          <circle cx="70" cy="80" r="10" className="fill-success/20 stroke-success" strokeWidth="1.5" />
          <circle cx="230" cy="80" r="10" className="fill-warning/20 stroke-warning" strokeWidth="1.5" />
          <circle cx="40" cy="130" r="8" className="fill-muted stroke-border" strokeWidth="1" />
          <circle cx="100" cy="130" r="8" className="fill-muted stroke-border" strokeWidth="1" />
          <circle cx="200" cy="130" r="8" className="fill-muted stroke-border" strokeWidth="1" />
          <circle cx="260" cy="130" r="8" className="fill-muted stroke-border" strokeWidth="1" />
          {/* Labels */}
          <text x="150" y="33" textAnchor="middle" className="fill-accent text-[6px] font-medium">D</text>
          <text x="70" y="83" textAnchor="middle" className="fill-success text-[6px] font-medium">A</text>
          <text x="230" y="83" textAnchor="middle" className="fill-warning text-[6px] font-medium">S</text>
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Decisions</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Assumptions</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Simulations</span>
        </div>
      </div>
    ),
  },
  {
    id: "agents",
    label: "AI Agents",
    icon: Bot,
    title: "Autonomous Decision Agents",
    description: "Create AI agents that generate structured decisions — every action flows through the Decision Gate with organizational memory and conditional human oversight.",
    mockup: () => (
      <div className="space-y-3">
        {[
          { name: "PricingAgent", objective: "Revenue · Pricing Optimization", accuracy: 81, status: "active" },
          { name: "MarketingAgent", objective: "Marketing · Campaign Intelligence", accuracy: 78, status: "active" },
          { name: "SalesAgent", objective: "Sales · Pipeline Optimization", accuracy: 85, status: "reviewing" },
        ].map((agent, i) => (
          <div key={i} className="rounded-lg border border-border/50 bg-background/60 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <Bot className="h-3 w-3 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{agent.name}</p>
                  <p className="text-[9px] text-muted-foreground">{agent.objective}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">{agent.accuracy}%</span>
                <span className={cn("h-1.5 w-1.5 rounded-full", agent.status === "active" ? "bg-success" : "bg-warning")} />
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const active = tabs.find(t => t.id === activeTab)!;

  return (
    <section className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Product</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">See StemmQ in action</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Explore the key capabilities that make decision intelligence systematic and scalable.</p>
        </div>

        {/* Tab buttons */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl border border-border bg-muted/50 p-1 gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-foreground">{active.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{active.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                  </div>
                </div>
                {active.mockup()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
