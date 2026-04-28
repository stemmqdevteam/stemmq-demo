'use client'

import { motion } from 'framer-motion'

/**
 * Wrap any page content to get a consistent fade-up entrance animation.
 * Use as a client component wrapper around server-rendered page content.
 */
export function PageMotion({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Stagger children — wrap list items */
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export const fadeUpItem = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
}
