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
  const variants = presetMap[preset];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...(typeof variants.visible === "object" ? variants.visible : {}),
          transition: {
            ...((typeof variants.visible === "object" && "transition" in variants.visible
              ? variants.visible.transition
              : {}) as object),
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
