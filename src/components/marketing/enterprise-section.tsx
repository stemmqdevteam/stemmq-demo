"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Server, Clock, Users, FileCheck } from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/animations/motion-presets";

const badges = [
  { icon: Shield, label: "SOC 2 Type II", description: "Certified compliant" },
  { icon: Lock, label: "End-to-end Encryption", description: "AES-256 at rest, TLS 1.3 in transit" },
  { icon: Server, label: "99.99% Uptime SLA", description: "Enterprise-grade reliability" },
  { icon: Clock, label: "Real-time Audit Logs", description: "Complete decision trail" },
  { icon: Users, label: "SSO & SAML", description: "Enterprise authentication" },
  { icon: FileCheck, label: "GDPR Compliant", description: "Data sovereignty options" },
];

export function EnterpriseSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Enterprise Ready</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">Built for enterprise scale</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Security, compliance, and reliability that meets the demands of the world&apos;s most regulated industries.</p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {badges.map(badge => (
            <motion.div
              key={badge.label}
              variants={staggerItem}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 shrink-0">
                <badge.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{badge.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
