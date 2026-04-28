"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Quote,
  Star,
  TrendingUp,
  Users,
  Zap,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════
   LOGOS
═══════════════════════════════════════════════════ */

const logos = [
  "/logos/Salesforce_idN3OdcTG__0.svg",
  "/logos/Anthropic_Logo_0.svg",
  "/logos/OpenAI_Logo_0.svg",
  "/logos/HubSpot_idPJcOROpd_0.svg",
  "/logos/Snowflake_idj3qWXVFZ_0.svg",
  "/logos/Linear_Logo_0.svg",
  "/logos/Stripe_Logo_0.svg",
  "/logos/Amplitude_idPo7J6YFZ_0.svg",
];

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */

const stats = [
  { icon: TrendingUp, value: "34%",   label: "avg assumption accuracy lift",  color: "#6366f1" },
  { icon: Users,      value: "2,400+", label: "enterprise teams onboarded",    color: "#8b5cf6" },
  { icon: Zap,        value: "8 wks",  label: "avg time to first insight",     color: "#3b82f6" },
  { icon: Award,      value: "97%",    label: "decision confidence score",     color: "#a855f7" },
];

const testimonials = [
  {
    quote: "StemmQ fundamentally changed how our leadership team approaches strategic decisions. We went from gut-feel to evidence-based in 8 weeks.",
    author: "Alexandra Rivera",
    role: "VP of Strategy",
    company: "TechFlow",
    stat: "+34% accuracy",
    avatar: "AR",
    color: "#6366f1",
  },
  {
    quote: "The assumption tracking alone saved us from two major strategic missteps in Q3. I can't imagine running a roadmap without it now.",
    author: "Marcus Osei",
    role: "Chief Product Officer",
    company: "Meridian AI",
    stat: "2 pivots avoided",
    avatar: "MO",
    color: "#8b5cf6",
  },
  {
    quote: "Our board meetings are completely different now. Every decision comes with a DQS score and a full assumption log. It's like night and day.",
    author: "Priya Nair",
    role: "CEO & Co-founder",
    company: "Nexus Labs",
    stat: "DQS 91.2",
    avatar: "PN",
    color: "#3b82f6",
  },
];

/* ═══════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════ */

function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay,
}: (typeof stats)[0] & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col items-center gap-2 sm:gap-2.5 p-4 sm:p-6 rounded-2xl border border-border bg-card hover:border-border/80 hover:bg-card/80 transition-all overflow-hidden"
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}10, transparent 65%)` }}
      />
      <div
        className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}14`, border: `1px solid ${color}25` }}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color }} />
      </div>
      <p className="relative text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tabular-nums">
        {value}
      </p>
      <p className="relative text-[10px] sm:text-[11px] text-muted-foreground text-center leading-snug">
        {label}
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   TESTIMONIAL CARD
═══════════════════════════════════════════════════ */

function TestimonialCard({
  t,
  active,
  onClick,
}: {
  t: (typeof testimonials)[0];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: active ? -6 : -3 }}
      animate={{ opacity: active ? 1 : 0.5, scale: active ? 1 : 0.975 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col rounded-2xl border p-4 sm:p-6 cursor-pointer h-full transition-all ${
        active
          ? "border-accent/35 bg-linear-to-br from-accent/8 to-violet-500/4 shadow-lg shadow-accent/10"
          : "border-border/50 bg-card/40 hover:border-border"
      }`}
    >
      <div className="flex gap-0.5 mb-3.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <Quote className="h-5 w-5 text-accent/30 mb-2.5 shrink-0" />
      <p className="text-xs sm:text-sm text-foreground/65 leading-relaxed flex-1 mb-5">
        {t.quote}
      </p>

      <div className="flex items-center gap-2.5 mt-auto">
        <div
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}77)` }}
        >
          {t.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-semibold text-foreground truncate">
            {t.author}
          </p>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">
            {t.role} · {t.company}
          </p>
        </div>
        <span
          className="shrink-0 text-[8px] sm:text-[9px] font-semibold px-2 py-1 rounded-full"
          style={{
            background: `${t.color}16`,
            color: t.color,
            border: `1px solid ${t.color}25`,
          }}
        >
          {t.stat}
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════════ */

function TrustSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 overflow-hidden bg-background border-y border-border/40"
    >
      {/* Ambient orbs */}
      <div className="absolute top-0 left-1/4 w-90 h-90 bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/6 rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-1.5 text-xs font-medium text-accent mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Proven Results
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-[1.1]">
            Trusted by teams who refuse{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#818cf8 0%,#6366f1 50%,#a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              to fly blind
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            From seed-stage startups to Fortune 500 boardrooms — decisions made
            with StemmQ compound.
          </p>
        </motion.div>

        {/* Logo Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="relative mb-12 sm:mb-16"
        >
          <p className="text-center text-[10px] sm:text-xs font-semibold text-muted-foreground/50 uppercase tracking-widest mb-6">
            Trusted by teams at
          </p>

          <div className="relative overflow-hidden py-3">
            {/* Fade masks — match section background via CSS variable */}
            <div
              className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
              style={{
                width: "20%",
                background: "linear-gradient(to right, var(--background) 0%, var(--background) 30%, transparent 100%)",
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
              style={{
                width: "20%",
                background: "linear-gradient(to left, var(--background) 0%, var(--background) 30%, transparent 100%)",
              }}
            />

            <motion.div
              className="flex items-center gap-12 sm:gap-20 flex-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              style={{ willChange: "transform" }}
            >
              {[...logos, ...logos].map((src, i) => (
                <div key={i} className="shrink-0 group cursor-pointer">
                  <Image
                    src={src}
                    alt=""
                    width={130}
                    height={36}
                    className="h-7 sm:h-8 w-auto object-contain
                               opacity-40 dark:opacity-55
                               brightness-0 dark:brightness-[2.2]
                               grayscale
                               group-hover:opacity-80 dark:group-hover:opacity-95
                               group-hover:grayscale-0
                               group-hover:brightness-100
                               transition-all duration-300"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} delay={0.18 + i * 0.08} />
          ))}
        </div>

        {/* Testimonials — desktop */}
        <div className="hidden sm:grid grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.28 + i * 0.1 }}
            >
              <TestimonialCard
                t={t}
                active={activeIdx === i}
                onClick={() => setActiveIdx(i)}
              />
            </motion.div>
          ))}
        </div>

        {/* Testimonials — mobile */}
        <div className="sm:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28 }}
            >
              <TestimonialCard
                t={testimonials[activeIdx]!}
                active={true}
                onClick={() => {}}
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => setActiveIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
              className="h-8 w-8 rounded-full border border-border/50 bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5 items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`rounded-full transition-all duration-300 ${
                    activeIdx === i
                      ? "w-5 h-1.5 bg-accent"
                      : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveIdx((i) => (i + 1) % testimonials.length)}
              className="h-8 w-8 rounded-full border border-border/50 bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop dot nav */}
        <div className="hidden sm:flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`rounded-full transition-all duration-300 ${
                activeIdx === i
                  ? "w-6 h-1.5 bg-accent"
                  : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export { TrustSection };
