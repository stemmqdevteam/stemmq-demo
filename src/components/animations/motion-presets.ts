import type { Variants, Transition } from "framer-motion";

// Standard easing curves
export const easings = {
  smooth: [0.21, 0.47, 0.32, 0.98] as const,
  spring: { type: "spring", stiffness: 300, damping: 30 } as Transition,
  springBounce: { type: "spring", stiffness: 400, damping: 25 } as Transition,
  gentle: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } as Transition,
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easings.smooth } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easings.smooth } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easings.smooth } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easings.smooth } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easings.smooth } },
};

export const slideInLeft: Variants = {
  hidden: { x: -40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: easings.smooth } },
};

export const slideInRight: Variants = {
  hidden: { x: 40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: easings.smooth } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easings.smooth } },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easings.smooth } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: easings.smooth } },
};

export const hoverLift = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

export const buttonPress = {
  whileTap: { scale: 0.97 },
};
