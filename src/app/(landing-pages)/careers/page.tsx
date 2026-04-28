"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Globe,
  DollarSign,
  BookOpen,
  Heart,
  Clock,
  Target,
  ArrowRight,
  MapPin,
  Briefcase,
  Sparkles,
  Users,
  Zap,
  Brain,
  Shield,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  Star,
  Building2,
  Code2,
  Megaphone,
  Settings2,
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════ */

function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [-16, 16, -16], x: [-8, 8, -8] }}
      transition={{
        duration: 11 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={className}
    />
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const xInit = direction === "left" ? -28 : direction === "right" ? 28 : 0;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: direction === "up" ? 24 : 0, x: xInit }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */

const benefits = [
  {
    icon: Globe,
    color: "#6366f1",
    title: "Remote-first",
    desc: "Work from anywhere. Async by default, synchronous when it matters.",
  },
  {
    icon: DollarSign,
    color: "#10b981",
    title: "Equity for all",
    desc: "Every full-time hire receives meaningful equity. We succeed together.",
  },
  {
    icon: BookOpen,
    color: "#a855f7",
    title: "$3,000 learning budget",
    desc: "Annual stipend for courses, conferences, books, and tools.",
  },
  {
    icon: Heart,
    color: "#ef4444",
    title: "Full healthcare",
    desc: "Medical, dental, and vision covered 100% for you and dependents.",
  },
  {
    icon: Clock,
    color: "#f59e0b",
    title: "Flexible hours",
    desc: "Own your schedule. We measure output, not hours online.",
  },
  {
    icon: Target,
    color: "#3b82f6",
    title: "Mission-driven",
    desc: "We're building infrastructure that changes how organizations think.",
  },
];

const openRoles = [
  {
    dept: "Engineering",
    icon: Code2,
    color: "#6366f1",
    roles: [
      {
        title: "Staff Software Engineer — Decision Engine",
        location: "Remote",
        type: "Full-time",
        hot: true,
      },
      {
        title: "Senior Backend Engineer — Agent Infrastructure",
        location: "Remote",
        type: "Full-time",
        hot: false,
      },
      {
        title: "ML Engineer — Pattern Recognition",
        location: "Remote",
        type: "Full-time",
        hot: true,
      },
    ],
  },
  {
    dept: "Product",
    icon: Brain,
    color: "#a855f7",
    roles: [
      {
        title: "Senior Product Manager — AI Governance",
        location: "Remote",
        type: "Full-time",
        hot: true,
      },
      {
        title: "Product Designer — Decision Interfaces",
        location: "Remote",
        type: "Full-time",
        hot: false,
      },
    ],
  },
  {
    dept: "Go-to-Market",
    icon: Megaphone,
    color: "#10b981",
    roles: [
      {
        title: "Enterprise Account Executive",
        location: "Remote / NYC",
        type: "Full-time",
        hot: false,
      },
      {
        title: "Solutions Engineer — Enterprise",
        location: "Remote",
        type: "Full-time",
        hot: false,
      },
      {
        title: "Content Marketing Manager",
        location: "Remote",
        type: "Full-time",
        hot: false,
      },
    ],
  },
  {
    dept: "Operations",
    icon: Settings2,
    color: "#f59e0b",
    roles: [
      {
        title: "Legal Counsel — Privacy & AI Compliance",
        location: "Remote / SF",
        type: "Full-time",
        hot: false,
      },
    ],
  },
];

const interviewSteps = [
  {
    step: "01",
    title: "Application Review",
    desc: "We review within 5 business days. No automated screeners. A real human reads every application.",
    color: "#6366f1",
  },
  {
    step: "02",
    title: "Async Screen",
    desc: "30-minute async video or written response. No scheduling friction. Answer when you're at your best.",
    color: "#8b5cf6",
  },
  {
    step: "03",
    title: "Role Interview",
    desc: "Deep-dive on skills and approach with your direct team. Structured, transparent rubric.",
    color: "#a855f7",
  },
  {
    step: "04",
    title: "Team Interview",
    desc: "Meet 2–3 cross-functional team members. Culture and values — it goes both ways.",
    color: "#3b82f6",
  },
  {
    step: "05",
    title: "Offer",
    desc: "Transparent offer with full equity and compensation breakdown. No surprises.",
    color: "#10b981",
  },
];

const teamValues = [
  {
    icon: Brain,
    title: "Curious by default",
    desc: "We question assumptions — including our own.",
  },
  {
    icon: Shield,
    title: "Ownership over credit",
    desc: "We take responsibility for outcomes, not just tasks.",
  },
  {
    icon: Zap,
    title: "Bias toward action",
    desc: "We ship, learn, and iterate. Fast.",
  },
  {
    icon: TrendingUp,
    title: "Slope over position",
    desc: "We hire for trajectory, not just current ability.",
  },
];

const perks = [
  "Competitive salary + meaningful equity",
  "Home office setup stipend ($1,500)",
  "Annual team retreat (last one: Lisbon)",
  "Monthly async social events",
  "Parental leave (16 weeks primary caregiver)",
  "4-week sabbatical after 3 years",
];

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */

function CareersHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const totalRoles = openRoles.reduce((a, d) => a + d.roles.length, 0);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-20 bg-background"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <Orb
        delay={0}
        className="absolute top-[-8%] left-[-3%] w-[480px] h-[480px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"
      />
      <Orb
        delay={4}
        className="absolute bottom-[-5%] right-[-3%] w-[380px] h-[380px] rounded-full bg-violet-600/8 blur-[90px] pointer-events-none"
      />

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center"
      >
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            We're Hiring · {totalRoles} Open Roles
          </span>
        </Reveal>

        <Reveal delay={0.07}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.06] mb-5">
            Build the future of{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              decision intelligence
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            A small, focused team building infrastructure that changes how
            organizations think and decide. Every person here owns a meaningful
            piece of that work.
          </p>
        </Reveal>

        {/* Stats strip */}
        <Reveal delay={0.2}>
          <div className="inline-flex items-center gap-0 rounded-2xl border border-border/50 bg-card/40 overflow-hidden mb-10">
            {[
              { value: "18", label: "Team members", color: "#6366f1" },
              { value: "12", label: "Countries", color: "#a855f7" },
              { value: "100%", label: "Remote", color: "#10b981" },
              { value: `${totalRoles}`, label: "Open roles", color: "#f59e0b" },
            ].map((s, i, arr) => (
              <div
                key={s.label}
                className={`px-5 sm:px-7 py-3 sm:py-4 text-center ${i < arr.length - 1 ? "border-r border-border/50" : ""}`}
              >
                <p
                  className="text-lg sm:text-2xl font-bold tabular-nums"
                  style={{ color: s.color }}
                >
                  {s.value}
                </p>
                <p className="text-[10px] sm:text-xs text-foreground/30 mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#roles">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-xl shadow-indigo-500/25 w-full sm:w-auto justify-center"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  See Open Roles
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </motion.button>
            </a>
            <a href="mailto:hiring@stemmq.com">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-muted-foreground border border-border/50 bg-muted/30 hover:bg-muted/60 hover:text-foreground transition-all w-full sm:w-auto justify-center"
              >
                Send us a note
              </motion.button>
            </a>
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   WHY STEMMQ — benefits + values
═══════════════════════════════════════════════════ */

function WhySection() {
  return (
    <section className="py-16 sm:py-24 bg-card/40 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-4">
            Why StemmQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            We treat our people like we treat{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              decisions
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            With structure, transparency, and a commitment to getting better
            over time.
          </p>
        </Reveal>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-14">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <Reveal key={b.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative rounded-2xl border border-border/50 bg-card/40 p-5 sm:p-6 overflow-hidden transition-all hover:border-border h-full"
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 20% 20%, ${b.color}08, transparent 60%)`,
                    }}
                  />
                  <div className="relative">
                    <div
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center mb-4"
                      style={{
                        background: `${b.color}15`,
                        border: `1px solid ${b.color}25`,
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: b.color }} />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground mb-2">
                      {b.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* Additional perks strip */}
        <Reveal>
          <div className="rounded-2xl border border-border/50 bg-card/40 p-5 sm:p-7">
            <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold mb-4">
              Additional Perks
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {perk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TEAM VALUES
═══════════════════════════════════════════════════ */

function TeamValuesSection() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-medium text-violet-300 mb-4">
            Culture
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            How we work{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#818cf8,#a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              together
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
            The values we hire for, promote on, and hold ourselves to.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {teamValues.map((v, i) => {
            const Icon = v.icon;
            const colors = ["#6366f1", "#a855f7", "#f59e0b", "#10b981"];
            const color = colors[i];
            return (
              <Reveal key={v.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group rounded-2xl border border-border/50 bg-card/40 p-5 sm:p-6 text-center hover:border-border transition-all h-full"
                >
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: `${color}15`,
                      border: `1px solid ${color}25`,
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground mb-2">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   OPEN ROLES — accordion by dept
═══════════════════════════════════════════════════ */

function OpenRoleCard({
  role,
  color,
}: {
  role: (typeof openRoles)[0]["roles"][0];
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/50 bg-card/40 hover:border-border hover:bg-muted/30 transition-all"
    >
      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="text-xs sm:text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
            {role.title}
          </p>
          {role.hot && (
            <span
              className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
              style={{
                background: "#f59e0b15",
                color: "#f59e0b",
                border: "1px solid #f59e0b25",
              }}
            >
              🔥 Hot
            </span>
          )}
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {role.location}
          </span>
          <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-border/50 bg-card/40 text-muted-foreground">
            {role.type}
          </span>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all"
        style={{
          background: `${color}18`,
          border: `1px solid ${color}30`,
          color,
        }}
      >
        <Link href="/apply" className="flex items-center gap-1.5">
          Apply <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.button>
    </motion.div>
  );
}

function OpenRolesSection() {
  const [openDept, setOpenDept] = useState<string | null>(null);
  const totalRoles = openRoles.reduce((a, d) => a + d.roles.length, 0);

  return (
    <section
      id="roles"
      className="py-16 sm:py-20 bg-card/40 border-y border-border/50"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-xs font-medium text-emerald-300 mb-4">
            <Briefcase className="h-3.5 w-3.5" /> Open Roles
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {totalRoles} open{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#10b981,#06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              positions
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            We hire for slope, not just current ability. If you're curious and
            care deeply about the problem, apply.
          </p>
        </Reveal>

        <div className="space-y-3">
          {openRoles.map((dept, di) => {
            const DIcon = dept.icon;
            const isOpen = openDept === dept.dept || openDept === null;
            return (
              <Reveal key={dept.dept} delay={di * 0.06}>
                <div className="rounded-2xl border border-border/50 bg-card/40 overflow-hidden">
                  {/* Dept header */}
                  <button
                    onClick={() =>
                      setOpenDept(openDept === dept.dept ? null : dept.dept)
                    }
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-xl flex items-center justify-center"
                        style={{
                          background: `${dept.color}15`,
                          border: `1px solid ${dept.color}25`,
                        }}
                      >
                        <DIcon
                          className="h-4 w-4"
                          style={{ color: dept.color }}
                        />
                      </div>
                      <div className="text-left">
                        <span className="text-xs sm:text-sm font-bold text-foreground">
                          {dept.dept}
                        </span>
                        <span
                          className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{
                            color: dept.color,
                            background: `${dept.color}15`,
                          }}
                        >
                          {dept.roles.length}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: openDept === dept.dept ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-colors ${openDept === dept.dept ? "text-foreground/80" : "text-muted-foreground"}`}
                      />
                    </motion.div>
                  </button>

                  {/* Roles list */}
                  <AnimatePresence>
                    {(openDept === dept.dept || openDept === null) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 sm:px-4 pb-3 space-y-2 border-t border-border/50 pt-3">
                          {dept.roles.map((role, ri) => (
                            <OpenRoleCard
                              key={ri}
                              role={role}
                              color={dept.color}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   INTERVIEW PROCESS — vertical animated timeline
═══════════════════════════════════════════════════ */

function InterviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-4">
            Interview Process
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Transparent{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              from the start
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            We respect your time. Our process is async-friendly and designed to
            give you as much signal as you give us.
          </p>
        </Reveal>

        <div ref={ref} className="relative max-w-2xl mx-auto">
          {/* Vertical connector */}
          <div className="absolute left-5 top-6 bottom-6 w-px bg-border/50 hidden sm:block" />

          <div className="space-y-3">
            {interviewSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                onClick={() => setActiveStep(i)}
                className={`relative flex items-start gap-4 p-4 sm:pl-16 rounded-2xl border cursor-pointer transition-all ${
                  activeStep === i
                    ? "border-border bg-muted/30"
                    : "border-border/50 bg-card/40 hover:border-border"
                }`}
                style={
                  activeStep === i
                    ? {
                        borderColor: `${step.color}35`,
                        background: `${step.color}05`,
                      }
                    : {}
                }
              >
                {/* Step dot (desktop: absolutely positioned on line) */}
                <div className="hidden sm:flex absolute left-0 top-4 h-10 w-10 items-center justify-center">
                  <motion.div
                    animate={{ scale: activeStep === i ? 1.15 : 1 }}
                    className="h-8 w-8 rounded-xl flex items-center justify-center text-[10px] font-bold z-10 transition-all"
                    style={{
                      background:
                        activeStep === i
                          ? step.color
                          : "rgba(255,255,255,0.05)",
                      border: `1px solid ${activeStep === i ? step.color : "rgba(255,255,255,0.1)"}`,
                      color:
                        activeStep === i ? "white" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {step.step}
                  </motion.div>
                </div>

                {/* Mobile step badge */}
                <div
                  className="sm:hidden flex h-8 w-8 items-center justify-center rounded-xl text-[10px] font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: `${step.color}15`,
                    border: `1px solid ${step.color}25`,
                    color: step.color,
                  }}
                >
                  {step.step}
                </div>

                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-foreground mb-1">
                    {step.title}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {activeStep === i && (
                  <div
                    className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center"
                    style={{
                      background: `${step.color}20`,
                      border: `1px solid ${step.color}30`,
                    }}
                  >
                    <CheckCircle2
                      className="h-3 w-3"
                      style={{ color: step.color }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Timeline note */}
          <Reveal delay={0.5}>
            <div className="mt-5 rounded-2xl border border-border/50 bg-card/40 p-4 flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                <Zap className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground/80 mb-0.5">
                  Typical timeline: 2–3 weeks total
                </p>
                <p className="text-xs text-muted-foreground">
                  From first application to offer. We move fast and communicate
                  proactively at every step.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TEAM QUOTE — culture signal
═══════════════════════════════════════════════════ */

function TeamQuoteSection() {
  const quotes = [
    {
      text: "I've never worked somewhere that ships this fast while being this thoughtful about quality.",
      author: "Senior Engineer",
      tenure: "1.5 years",
      color: "#6366f1",
    },
    {
      text: "The async-first culture is real. I do my best work at 6am and nobody cares what time it is.",
      author: "Product Designer",
      tenure: "8 months",
      color: "#a855f7",
    },
    {
      text: "Equity actually vests. The comp is transparent. Everything they promised in the interview is true.",
      author: "Growth Lead",
      tenure: "2 years",
      color: "#10b981",
    },
  ];

  return (
    <section className="py-12 sm:py-14 border-y border-border/50 bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {quotes.map((q, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="rounded-2xl border border-border/50 bg-card/40 p-5 sm:p-6 h-full">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-3 w-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-5 italic">
                  "{q.text}"
                </p>
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-7 w-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${q.color}, ${q.color}88)`,
                    }}
                  >
                    {q.author[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground/80">
                      {q.author}
                    </p>
                    <p className="text-[10px] text-foreground/30">
                      {q.tenure} at StemmQ
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   BOTTOM CTA — open application
═══════════════════════════════════════════════════ */

function CareersCTA() {
  return (
    <section className="py-14 sm:py-16 bg-background border-t border-border/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/8 to-violet-500/5 p-7 sm:p-10 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 60%)",
              }}
            />
            <div className="relative">
              <div className="flex justify-center gap-2 mb-5">
                {[Brain, Shield, Zap].map((Icon, i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-xl bg-muted/50 border border-border flex items-center justify-center"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
                Don't see your role?
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-7">
                We're always interested in meeting exceptional people. If you
                believe in what we're building, send us a note — we'd love to
                hear from you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="mailto:hiring@stemmq.com">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-xl shadow-indigo-500/25 w-full sm:w-auto justify-center"
                    style={{
                      background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Send us a note
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </a>
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-foreground/60 border border-border bg-muted/30 hover:bg-muted/50 hover:text-foreground transition-all w-full sm:w-auto justify-center"
                  >
                    <Users className="h-4 w-4" /> Meet the Team
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <CareersHero />
      <WhySection />
      <TeamValuesSection />
      <OpenRolesSection />
      <InterviewSection />
      <TeamQuoteSection />
      <CareersCTA />
      <MarketingFooter />
    </div>
  );
}
