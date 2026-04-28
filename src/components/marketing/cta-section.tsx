"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Brain, Shield, TrendingUp, Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/constants";

function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-20 sm:py-24 overflow-hidden bg-background">

      {/* Ambient orbs */}
      <motion.div
        animate={{ y: [-14, 14, -14], x: [-8, 8, -8] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-5%] w-[480px] h-[480px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ y: [14, -14, 14], x: [8, -8, 8] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px] pointer-events-none"
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`,
          backgroundSize: "52px 52px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">

        {/* Icon trio */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="flex justify-center gap-2.5 mb-6"
        >
          {[Brain, Shield, TrendingUp].map((Icon, i) => (
            <div
              key={i}
              className="h-9 w-9 rounded-xl bg-muted/50 border border-border flex items-center justify-center"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.07 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.08]"
        >
          Ready to make decisions that{" "}
          <span
            style={{
              background: "linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            compound?
          </span>
        </motion.h2>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.14 }}
          className="mt-5 text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
        >
          Build your strategic decision infrastructure from day one.
          Start free — no credit card required.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href={ROUTES.auth}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-xl shadow-indigo-500/25 w-full sm:w-auto justify-center"
              style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Get Started Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </motion.button>
          </Link>

          <a href="/contact">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-foreground/60 border border-border bg-muted/30 hover:bg-muted/60 hover:text-foreground transition-all w-full sm:w-auto justify-center"
            >
              Talk to Sales
            </motion.button>
          </a>
        </motion.div>

        {/* Social proof fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-5 text-[11px] text-foreground/30"
        >
          No credit card required · 14-day Pro trial · Cancel anytime
        </motion.p>

      </div>
    </section>
  );
}

export { CTASection };