"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const variantColors = {
  default: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function ProgressBar({
  value,
  max = 100,
  className,
  variant = "default",
  size = "md",
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full rounded-full bg-muted overflow-hidden", sizeClasses[size], className)}>
      <motion.div
        className={cn("h-full rounded-full", variantColors[variant])}
        initial={animated ? { width: 0 } : false}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      />
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
  children?: React.ReactNode;
}

const ringColors = {
  default: "stroke-accent",
  success: "stroke-success",
  warning: "stroke-warning",
  danger: "stroke-danger",
};

export function ProgressRing({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  className,
  variant = "default",
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={ringColors[variant]}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
