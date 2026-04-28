"use client";

import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface UpgradeGateProps {
  /** Whether the feature is accessible */
  allowed: boolean;
  /** Minimum plan required */
  requiredPlan: string;
  /** Feature name for display */
  featureName: string;
  /** Content to show when allowed */
  children: ReactNode;
}

/**
 * Wraps content with a locked overlay if the user's plan doesn't include the feature.
 * Shows the content with a locked overlay and upgrade CTA instead of hiding entirely.
 */
export function UpgradeGate({ allowed, requiredPlan, featureName, children }: UpgradeGateProps) {
  if (allowed) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred content preview */}
      <div className="pointer-events-none select-none blur-sm opacity-40">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full mx-4 rounded-2xl border border-border bg-card p-6 text-center shadow-2xl"
        >
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-1">
            {featureName}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            This feature requires the{" "}
            <span className="font-semibold text-accent capitalize">{requiredPlan}</span>{" "}
            plan.
          </p>

          <Link href="/dashboard/billing">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
              style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
            >
              Upgrade to {requiredPlan}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
