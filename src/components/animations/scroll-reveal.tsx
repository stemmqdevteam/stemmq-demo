"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { fadeInUp, fadeInDown, fadeInLeft, fadeInRight, scaleIn } from "./motion-presets";

type AnimationPreset = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale";

const presetMap: Record<AnimationPreset, Variants> = {
  fadeUp: fadeInUp,
  fadeDown: fadeInDown,
  fadeLeft: fadeInLeft,
  fadeRight: fadeInRight,
  scale: scaleIn,
};

interface ScrollRevealProps {
  children: ReactNode;
  preset?: AnimationPreset;
  delay?: number;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  preset = "fadeUp",
  delay = 0,
  className,
  once = true,
}: ScrollRevealProps) {
  const variants: Variants = presetMap[preset];

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const mergedVariants: Variants = variants ?? defaultVariants;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={mergedVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}