"use client";

import { motion } from "framer-motion";
import { Bot, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/animations/motion-presets";

const agents = [
  { name: "PricingAgent", role: "Revenue · Pricing Optimization", accuracy: 81, icon: TrendingUp, decisions: 34 },
  { name: "MarketingAgent", role: "Marketing · Campaign Intelligence", accuracy: 78, icon: TrendingUp, decisions: 22 },
  { name: "SalesAgent", role: "Sales · Pipeline Optimization", accuracy: 85, icon: AlertTriangle, decisions: 48 },
];

const proposals = [
  { agent: "PricingAgent", text: "Launch 15% Q4 discount campaign", type: "Decision", time: "2m ago" },
  { agent: "SalesAgent", text: "Reduce enterprise contract floor to $8k/yr", type: "Decision", time: "5m ago" },
  { agent: "MarketingAgent", text: "Increase paid ad spend by $12k", type: "Decision", time: "12m ago" },
];

export function AIAgentsSection() {
  return (
    <section className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">AI Governance</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">Agents that decide. You stay in control.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Create AI agents with a no-code builder or connect external systems. Every agent action generates a structured decision object — giving you complete intelligence, memory, and governance.
            </p>

            {/* Agent cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-8 space-y-3"
            >
              {agents.map(agent => (
                <motion.div key={agent.name} variants={staggerItem} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                      <Bot className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{agent.accuracy}%</p>
                    <p className="text-[10px] text-muted-foreground">Forecast · {agent.decisions} decisions</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Live feed */}
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <span className="text-sm font-medium text-foreground">Live Agent Feed</span>
              <span className="flex items-center gap-1.5 text-xs text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Active
              </span>
            </div>
            <div className="p-5 space-y-4">
              {proposals.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-start gap-3"
                >
                  <div className="h-7 w-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{p.agent}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent">{p.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{p.text}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button className="text-[10px] font-medium text-success flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Approve</button>
                      <button className="text-[10px] font-medium text-muted-foreground">Revise</button>
                      <span className="text-[10px] text-muted-foreground/50 ml-auto">{p.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
