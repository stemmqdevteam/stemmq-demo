"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { FEATURES_LIST } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/components/animations/motion-presets";

const topFeatures = FEATURES_LIST.slice(0, 6);

export function InteractiveFeatures() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Capabilities</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">Everything you need</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">A complete toolkit for systematic decision-making at enterprise scale.</p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {topFeatures.map((feature, i) => {
            const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[feature.icon];
            const isExpanded = expanded === i;

            return (
              <motion.button
                key={feature.title}
                variants={staggerItem}
                onClick={() => setExpanded(isExpanded ? null : i)}
                className={cn(
                  "text-left rounded-xl border p-5 transition-all duration-200",
                  isExpanded
                    ? "border-accent/30 bg-accent/5 shadow-sm"
                    : "border-border bg-card hover:border-muted-foreground/20 hover:shadow-sm"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg shrink-0 transition-colors",
                    isExpanded ? "bg-accent/10" : "bg-muted"
                  )}>
                    {Icon && <Icon className={cn("h-5 w-5", isExpanded ? "text-accent" : "text-muted-foreground")} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                    <AnimatePresence>
                      {isExpanded ? (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2 text-sm text-muted-foreground leading-relaxed overflow-hidden"
                        >
                          {feature.description}
                        </motion.p>
                      ) : (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{feature.description}</p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
