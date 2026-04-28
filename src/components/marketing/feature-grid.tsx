"use client";

import * as LucideIcons from "lucide-react";
import { FEATURES_LIST } from "@/lib/constants";
import { StaggerChildren, StaggerItem } from "@/components/animations/stagger-children";
import { FadeIn } from "@/components/animations/fade-in";

function FeatureGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            12 Modules. One Decision Intelligence Platform.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Every module works together to give your organization a complete infrastructure for strategic decision-making.
          </p>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_LIST.map((feature) => {
            const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[feature.icon];
            return (
              <StaggerItem key={feature.title}>
                <div className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-accent/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 mb-4 group-hover:bg-accent/15 transition-colors">
                    {Icon && <Icon className="h-5 w-5 text-accent" />}
                  </div>
                  <h3 className="text-base font-semibold text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}

export { FeatureGrid };
