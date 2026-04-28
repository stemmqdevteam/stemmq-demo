"use client";

import { motion } from "framer-motion";

interface AnimatedGradientProps {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}

export function AnimatedGradient({ className, intensity = "medium" }: AnimatedGradientProps) {
  const opacityMap = { subtle: 0.08, medium: 0.15, strong: 0.25 };
  const opacity = opacityMap[intensity];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full"
        style={{ background: `radial-gradient(circle, rgba(99, 102, 241, ${opacity}) 0%, transparent 70%)` }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -top-1/4 -right-1/4 h-3/4 w-3/4 rounded-full"
        style={{ background: `radial-gradient(circle, rgba(59, 130, 246, ${opacity * 0.8}) 0%, transparent 70%)` }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-1/4 left-1/4 h-3/4 w-3/4 rounded-full"
        style={{ background: `radial-gradient(circle, rgba(168, 85, 247, ${opacity * 0.6}) 0%, transparent 70%)` }}
        animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
