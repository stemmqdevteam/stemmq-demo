"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/components/animations/motion-presets";

const roadmapItems = [
  { status: "shipped" as const, title: "Structured Decision Objects", description: "Core decision capture with quality scoring", quarter: "Q4 2025" },
  { status: "shipped" as const, title: "Assumption Calibration", description: "Track, validate, and challenge assumptions", quarter: "Q4 2025" },
  { status: "shipped" as const, title: "Autonomous Agent Layer", description: "No-code agent builder with Decision Gate governance", quarter: "Q1 2026" },
  { status: "in-progress" as const, title: "Strategy Graph Visualization", description: "Interactive decision network mapping", quarter: "Q1 2026" },
  { status: "in-progress" as const, title: "Document Intelligence", description: "AI-powered strategic signal extraction", quarter: "Q1 2026" },
  { status: "planned" as const, title: "CRM Validation Layer", description: "Cross-reference decisions with customer data", quarter: "Q2 2026" },
  { status: "planned" as const, title: "Advanced Simulations", description: "Monte Carlo and scenario planning", quarter: "Q2 2026" },
  { status: "planned" as const, title: "Institutional Continuity", description: "Leadership transition decision briefs", quarter: "Q3 2026" },
];

const statusConfig = {
  shipped: { icon: Check, color: "text-success bg-success/10 border-success/20", label: "Shipped" },
  "in-progress": { icon: Loader2, color: "text-accent bg-accent/10 border-accent/20", label: "In Progress" },
  planned: { icon: Clock, color: "text-muted-foreground bg-muted border-border", label: "Planned" },
};

export function RoadmapSection() {
  return (
    <section className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Roadmap</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">What we&apos;re building</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Transparency into our product direction. We ship fast and iterate based on customer feedback.</p>
        </div>

        {/* Status legend */}
        <div className="flex justify-center gap-6 mb-10">
          {(["shipped", "in-progress", "planned"] as const).map(status => {
            const config = statusConfig[status];
            return (
              <span key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <config.icon className={cn("h-3.5 w-3.5", status === "shipped" ? "text-success" : status === "in-progress" ? "text-accent" : "text-muted-foreground")} />
                {config.label}
              </span>
            );
          })}
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {roadmapItems.map(item => {
            const config = statusConfig[item.status];
            return (
              <motion.div
                key={item.title}
                variants={staggerItem}
                className={cn("rounded-xl border p-5", config.color)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{item.quarter}</span>
                  <config.icon className={cn("h-3.5 w-3.5", item.status === "in-progress" && "animate-spin")} />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
