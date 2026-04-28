"use client";

import { motion } from "framer-motion";
import { FileInput, Target, Activity, ShieldCheck, ArrowRight } from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/animations/motion-presets";

const steps = [
  { icon: FileInput, title: "Capture", description: "Record every strategic decision as a Structured Decision Object with full context.", color: "text-accent bg-accent/10" },
  { icon: Target, title: "Calibrate", description: "Track and challenge the assumptions behind every decision with validity scoring.", color: "text-success bg-success/10" },
  { icon: Activity, title: "Simulate", description: "Model probabilistic outcomes and simulate future scenarios before committing.", color: "text-warning bg-warning/10" },
  { icon: ShieldCheck, title: "Govern", description: "AI agents generate structured decisions through the Decision Gate — with conditional human oversight and organizational memory.", color: "text-accent-secondary bg-accent-secondary/10" },
];

export function WorkflowSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">How It Works</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">From intuition to infrastructure</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Four steps to transform how your organization makes strategic decisions.</p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4"
        >
          {steps.map((step, i) => (
            <motion.div key={step.title} variants={staggerItem} className="relative">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                {/* Step number and icon */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-muted-foreground/50">{String(i + 1).padStart(2, "0")}</span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${step.color}`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {/* Arrow connector (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-5 -right-2 text-muted-foreground/30">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
