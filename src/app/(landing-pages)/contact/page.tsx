"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight, Brain, Shield, Zap, Users, Building2, CheckCircle2,
  Clock, Star, TrendingUp, Mail, Globe, MessageSquare, CalendarCheck,
  Loader2, Sparkles, ChevronDown,
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════ */

function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [-14, 14, -14], x: [-7, 7, -7] }}
      transition={{ duration: 11 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    />
  );
}

function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */

const companySize = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–1,000 employees",
  "1,000+ employees",
];

const useCases = [
  "AI agent governance",
  "Decision audit & compliance",
  "Strategic planning",
  "Executive decision support",
  "Multi-team alignment",
  "Custom integration",
];

const timeline = [
  { step: "01", title: "Discovery call",  desc: "30-minute intro to understand your use case and goals.",        icon: MessageSquare, color: "#6366f1" },
  { step: "02", title: "Custom demo",     desc: "A live walkthrough tailored to your org's specific workflow.",  icon: Brain,         color: "#a855f7" },
  { step: "03", title: "Security review", desc: "We answer every compliance and data residency question.",       icon: Shield,        color: "#3b82f6" },
  { step: "04", title: "Contract & close",desc: "Flexible MSA, custom SLA, and invoice-based billing.",         icon: CalendarCheck, color: "#10b981" },
];

const testimonial = {
  quote: "The StemmQ sales process was unlike any SaaS vendor we've worked with. Discovery to signed contract in 11 days. The team understood our AI governance requirements immediately.",
  name: "Jordan Hayes",
  role: "VP of Strategy · Series D SaaS",
  color: "#6366f1",
  metric: "11 days to close",
};

/* ═══════════════════════════════════════════════════
   FORM PRIMITIVES
═══════════════════════════════════════════════════ */

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest mb-1.5">
      {children}{required && <span className="text-accent ml-1">*</span>}
    </label>
  );
}

function FormInput({ placeholder, value, onChange, type = "text" }: {
  placeholder: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-11 rounded-xl border border-border bg-muted/40 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/40 focus:border-[var(--ring)]/40 transition-all"
    />
  );
}

function FormSelect({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-11 rounded-xl border border-border bg-muted/40 px-4 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/40 focus:border-[var(--ring)]/40 transition-all appearance-none"
      >
        <option value="" className="dark:bg-[#12121f] bg-white text-muted-foreground">{placeholder}</option>
        {options.map(o => (
          <option key={o} value={o} className="dark:bg-[#12121f] bg-white text-foreground">{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
    </div>
  );
}

function FormTextarea({ placeholder, value, onChange, rows = 4 }: {
  placeholder: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/40 focus:border-[var(--ring)]/40 transition-all resize-none"
    />
  );
}

/* ═══════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════ */

function ContactForm() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", company: "",
    size: "", useCase: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const canSubmit = !!(form.firstName && form.lastName && form.email && form.company);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center py-10 px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
          className="h-16 w-16 rounded-2xl bg-success/15 border border-success/25 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </motion.div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Request received!</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-sm">
          A member of our enterprise team will reach out within 1 business day to schedule your discovery call.
        </p>
        <div className="flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-2">
          <Clock className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-semibold text-accent">Response within 1 business day</span>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormLabel required>First name</FormLabel>
          <FormInput placeholder="Jordan" value={form.firstName} onChange={v => update("firstName", v)} />
        </div>
        <div>
          <FormLabel required>Last name</FormLabel>
          <FormInput placeholder="Hayes" value={form.lastName} onChange={v => update("lastName", v)} />
        </div>
      </div>

      <div>
        <FormLabel required>Work email</FormLabel>
        <FormInput placeholder="jordan@company.com" type="email" value={form.email} onChange={v => update("email", v)} />
      </div>

      <div>
        <FormLabel required>Company name</FormLabel>
        <FormInput placeholder="Acme Corp" value={form.company} onChange={v => update("company", v)} />
      </div>

      <div>
        <FormLabel>Company size</FormLabel>
        <FormSelect value={form.size} onChange={v => update("size", v)} options={companySize} placeholder="Select headcount" />
      </div>

      <div>
        <FormLabel>Primary use case</FormLabel>
        <FormSelect value={form.useCase} onChange={v => update("useCase", v)} options={useCases} placeholder="Select a use case" />
      </div>

      <div>
        <FormLabel>Tell us about your requirements</FormLabel>
        <FormTextarea
          placeholder="What decisions are you looking to govern? What compliance requirements do you have? What integrations matter most?"
          value={form.message}
          onChange={v => update("message", v)}
          rows={4}
        />
      </div>

      <motion.button
        type="submit"
        disabled={!canSubmit || submitting}
        whileHover={canSubmit ? { scale: 1.02 } : {}}
        whileTap={canSubmit ? { scale: 0.98 } : {}}
        className="relative group w-full h-12 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
        style={{ background: submitting ? "#059669" : "linear-gradient(135deg,#6366f1,#4f46e5)" }}
      >
        <span className="relative z-10 flex items-center gap-2">
          {submitting
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending request…</>
            : <><Sparkles className="h-4 w-4" /> Talk to Sales <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></>
          }
        </span>
        {!submitting && (
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        )}
      </motion.button>

      <p className="text-center text-[10px] text-muted-foreground/50">
        By submitting, you agree to our{" "}
        <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">Privacy Policy</Link>.
        No spam — ever.
      </p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════
   SALES HERO
═══════════════════════════════════════════════════ */

function SalesHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 sm:pt-32 pb-12 sm:pb-14 bg-background">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "52px 52px" }} />
      <Orb delay={0} className="absolute top-[-8%] right-[-3%] w-[420px] h-[420px] rounded-full bg-indigo-600/10 blur-[110px] pointer-events-none" />
      <Orb delay={4} className="absolute bottom-[-5%] left-[-3%] w-[360px] h-[360px] rounded-full bg-violet-600/8 blur-[90px] pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent mb-5 backdrop-blur-sm">
            <Building2 className="h-3.5 w-3.5" /> Enterprise Sales
          </span>
        </Reveal>
        <Reveal delay={0.07}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.06] mb-4">
            Let&apos;s build your{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              decision infrastructure
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.13}>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Need a custom contract? Most enterprise deals close in under 2 weeks.
            Our team moves fast and knows your requirements before you finish the call.
          </p>
        </Reveal>

        {/* Stat strip */}
        <Reveal delay={0.2}>
          <div className="inline-flex items-center gap-0 rounded-2xl border border-border/50 bg-card/40 overflow-hidden">
            {[
              { value: "< 2 weeks", label: "Avg. time to close", color: "#10b981" },
              { value: "1 day",     label: "First response",     color: "#6366f1" },
              { value: "2,400+",   label: "Enterprise teams",   color: "#a855f7" },
            ].map((s, i, arr) => (
              <div key={s.label} className={`px-5 sm:px-7 py-3 sm:py-4 text-center ${i < arr.length - 1 ? "border-r border-border/40" : ""}`}>
                <p className="text-base sm:text-xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN FORM + SIDEBAR
═══════════════════════════════════════════════════ */

function MainSection() {
  return (
    <section className="py-10 sm:py-12 pb-20 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* ── LEFT: Form ── */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
                {/* Card header */}
                <div className="px-5 sm:px-7 py-5 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Contact our sales team</p>
                      <p className="text-[11px] text-muted-foreground">We respond within 1 business day</p>
                    </div>
                  </div>
                </div>
                <div className="px-5 sm:px-7 py-6">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 lg:sticky lg:top-24">

            {/* What's included */}
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-border/60 bg-card/50 p-5 sm:p-6">
                <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-4">Enterprise plan includes</p>
                <ul className="space-y-2.5">
                  {[
                    { label: "Unlimited decisions & team members", color: "#6366f1" },
                    { label: "Custom approval workflows",          color: "#a855f7" },
                    { label: "SSO / SAML authentication",         color: "#3b82f6" },
                    { label: "On-premise deployment option",       color: "#10b981" },
                    { label: "Dedicated success manager",          color: "#f59e0b" },
                    { label: "Custom SLA (99.99% uptime)",         color: "#06b6d4" },
                    { label: "Full audit log export (CSV / PDF)",  color: "#6366f1" },
                    { label: "Invoice-based billing & MSA",        color: "#a855f7" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full flex items-center justify-center mt-0.5 shrink-0"
                        style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                        <CheckCircle2 className="h-3 w-3" style={{ color: item.color }} />
                      </div>
                      <span className="text-xs sm:text-sm text-foreground/60 leading-snug">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Direct contact */}
            <Reveal delay={0.16}>
              <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-3.5">Prefer to reach out directly?</p>
                <div className="space-y-2.5">
                  {[
                    { icon: Mail,        label: "sales@stemmq.com",         color: "#6366f1" },
                    { icon: MessageSquare, label: "Live chat (bottom right)", color: "#10b981" },
                    { icon: Globe,       label: "stemmq.com/book-demo",      color: "#a855f7" },
                  ].map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${c.color}12`, border: `1px solid ${c.color}20` }}>
                          <Icon className="h-3.5 w-3.5" style={{ color: c.color }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{c.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   DEAL TIMELINE
═══════════════════════════════════════════════════ */

function DealTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-14 sm:py-16 border-y border-border/40 bg-muted/20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-1.5 text-xs font-medium text-accent mb-4">
            <Clock className="h-3.5 w-3.5" /> Our Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            From first call to{" "}
            <span style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              signed contract
            </span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Most enterprise deals close in under 2 weeks. We move fast without cutting corners.
          </p>
        </Reveal>

        <div ref={ref}>
          {/* Desktop: horizontal */}
          <div className="hidden sm:grid grid-cols-4 gap-4 relative">
            {/* Connector line */}
            <div className="absolute top-5 left-[12.5%] right-[12.5%] h-px bg-border/50" />

            {timeline.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.step}
                  initial={{ opacity: 0, y: 18 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative z-10 h-10 w-10 rounded-xl flex items-center justify-center mb-4 shadow-sm"
                    style={{ background: `${step.color}18`, border: `1px solid ${step.color}35` }}>
                    <Icon className="h-5 w-5" style={{ color: step.color }} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: step.color }}>{step.step}</span>
                  <p className="text-sm font-bold text-foreground mb-1">{step.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile: vertical */}
          <div className="sm:hidden space-y-3">
            {timeline.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.step}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.09, duration: 0.5 }}
                  className="flex items-start gap-3.5 p-4 rounded-2xl border border-border/50 bg-card/40"
                >
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                    <Icon className="h-4 w-4" style={{ color: step.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: step.color }}>{step.step}</span>
                      <p className="text-sm font-bold text-foreground">{step.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <Reveal delay={0.4} className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/8 px-5 py-2.5">
            <Zap className="h-4 w-4 text-success" />
            <span className="text-xs text-success font-semibold">Average time from first call to signed: 11 days</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TESTIMONIAL
═══════════════════════════════════════════════════ */

function SalesTestimonial() {
  return (
    <section className="py-14 sm:py-16 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="relative rounded-2xl border border-border/60 bg-linear-to-br from-accent/8 to-violet-500/5 p-6 sm:p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-sm sm:text-base md:text-lg text-foreground/75 leading-relaxed mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: `linear-gradient(135deg, ${testimonial.color}, ${testimonial.color}88)` }}>
                    JH
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-full">
                  {testimonial.metric}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SECURITY STRIP
═══════════════════════════════════════════════════ */

function SecurityStrip() {
  return (
    <section className="py-10 border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {[
              { icon: Shield,       label: "SOC 2 Type II Certified",    color: "#6366f1" },
              { icon: CheckCircle2, label: "GDPR Compliant",             color: "#10b981" },
              { icon: TrendingUp,   label: "99.99% Uptime SLA",          color: "#f59e0b" },
              { icon: Users,        label: "Dedicated Success Manager",  color: "#a855f7" },
              { icon: Zap,          label: "Enterprise-grade Support",   color: "#3b82f6" },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md flex items-center justify-center"
                    style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */

export default function ContactSalesPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <SalesHero />
      <MainSection />
      <DealTimeline />
      <SalesTestimonial />
      <SecurityStrip />
      <MarketingFooter />
    </div>
  );
}
