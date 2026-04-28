"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  lift?: number;
  glow?: boolean;
}

export function HoverCard({ children, className, lift = 4, glow = false }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -lift,
        boxShadow: glow
          ? "0 8px 30px rgba(99, 102, 241, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)"
          : "0 8px 30px rgba(0, 0, 0, 0.08)",
        transition: { duration: 0.25 },
      }}
      whileTap={{ scale: 0.99 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
