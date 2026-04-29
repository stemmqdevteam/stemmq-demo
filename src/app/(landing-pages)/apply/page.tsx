"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Upload, CheckCircle2, Sparkles,
  Brain, MapPin, Briefcase, Clock, User, Mail, Linkedin,
  Globe, FileText, ChevronDown, Zap, Shield, X,
  Github, AlertCircle, Loader2
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */

type Step = 1 | 2 | 3 | 4;

interface FormData {
  // Step 1 — Who you are
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  // Step 2 — Your background
  linkedin: string;
  github: string;
  portfolio: string;
  resumeFile: File | null;
  resumeName: string;
  // Step 3 — Why StemmQ
  whyStemmq: string;
  biggestDecision: string;
  availability: string;
  // Step 4 — Final details
  salary: string;
  noticePeriod: string;
  referral: string;
  agreeTerms: boolean;
}

/* ═══════════════════════════════════════════════════
   ROLE DATA — pulled from URL params or fallback
═══════════════════════════════════════════════════ */

const roleDatabase: Record<string, {
  title: string; dept: string; location: string; type: string; color: string;
  about: string; requirements: string[];
}> = {
  "staff-software-engineer": {
    title: "Staff Software Engineer — Decision Engine",
    dept: "Engineering", location: "Remote", type: "Full-time", color: "#6366f1",
    about: "You'll own the core decision engine that powers StemmQ — the system responsible for scoring, structuring, and evolving every decision object in the platform.",
    requirements: ["8+ years of software engineering experience", "Deep expertise in distributed systems", "Experience with ML pipelines or decision-support systems", "Strong async communication skills"],
  },
  "senior-backend-engineer": {
    title: "Senior Backend Engineer — Agent Infrastructure",
    dept: "Engineering", location: "Remote", type: "Full-time", color: "#6366f1",
    about: "Build the infrastructure that governs how AI agents propose, evaluate, and execute decisions in real time.",
    requirements: ["5+ years of backend engineering", "Experience with real-time systems and event queues", "Familiarity with LLM APIs and agent frameworks", "Strong system design skills"],
  },
  "ml-engineer": {
    title: "ML Engineer — Pattern Recognition",
    dept: "Engineering", location: "Remote", type: "Full-time", color: "#6366f1",
    about: "Build the intelligence layer that learns from organizational decisions over time — surfacing patterns, predicting outcomes, and calibrating assumptions.",
    requirements: ["4+ years of ML/data science experience", "Experience with time-series forecasting or NLP", "Python + PyTorch/TensorFlow proficiency", "Familiarity with MLOps tooling"],
  },
  "senior-product-manager": {
    title: "Senior Product Manager — AI Governance",
    dept: "Product", location: "Remote", type: "Full-time", color: "#a855f7",
    about: "Lead the product vision for how organizations govern AI agents — from the Decision Gate to approval workflows and audit trails.",
    requirements: ["5+ years of product management", "Experience in B2B SaaS or developer tools", "Deep curiosity about AI governance and ethics", "Strong written communication"],
  },
  "product-designer": {
    title: "Product Designer — Decision Interfaces",
    dept: "Product", location: "Remote", type: "Full-time", color: "#a855f7",
    about: "Design the interfaces that make complex decision intelligence feel simple and powerful for enterprise users.",
    requirements: ["4+ years of product design", "Proficiency in Figma", "Experience designing for complex data systems", "Portfolio demonstrating systems thinking"],
  },
  "enterprise-ae": {
    title: "Enterprise Account Executive",
    dept: "Go-to-Market", location: "Remote / NYC", type: "Full-time", color: "#10b981",
    about: "Own the full sales cycle for enterprise accounts — from first contact to close to expansion.",
    requirements: ["5+ years of enterprise SaaS sales", "Track record of $500K+ ARR deals", "Experience selling to C-suite buyers", "Strong strategic thinking and storytelling"],
  },
  "solutions-engineer": {
    title: "Solutions Engineer — Enterprise",
    dept: "Go-to-Market", location: "Remote", type: "Full-time", color: "#10b981",
    about: "Bridge the gap between product and customer — helping enterprise teams integrate and adopt StemmQ at scale.",
    requirements: ["3+ years of solutions or sales engineering", "Ability to write and read code (Python/TypeScript)", "Strong enterprise customer-facing experience", "Excellent technical communication"],
  },
  "default": {
    title: "Open Application",
    dept: "Various", location: "Remote", type: "Full-time", color: "#6366f1",
    about: "We're always looking for exceptional people. Tell us who you are and what you'd love to build.",
    requirements: ["Genuine curiosity about decision intelligence", "Strong first principles thinking", "A track record of doing great work", "Excellent communication skills"],
  },
};

/* ═══════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   FORM FIELD COMPONENTS
═══════════════════════════════════════════════════ */

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-white/55 mb-1.5 uppercase tracking-wide">
      {children}
      {required && <span className="text-indigo-400 ml-1">*</span>}
    </label>
  );
}

function FormInput({
  placeholder, value, onChange, type = "text", icon: Icon, required = false,
}: {
  placeholder: string; value: string; onChange: (v: string) => void;
  type?: string; icon?: typeof User; required?: boolean;
}) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 pointer-events-none" />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className={`w-full h-11 rounded-xl border border-white/10 bg-white/5 ${Icon ? "pl-10" : "pl-4"} pr-4 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all`}
      />
    </div>
  );
}

function FormTextarea({
  placeholder, value, onChange, rows = 4, maxLength,
}: {
  placeholder: string; value: string; onChange: (v: string) => void;
  rows?: number; maxLength?: number;
}) {
  return (
    <div className="relative">
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all resize-none"
      />
      {maxLength && (
        <span className="absolute bottom-2.5 right-3 text-[10px] text-white/20">{value.length}/{maxLength}</span>
      )}
    </div>
  );
}

function FormSelect({
  value, onChange, options, placeholder,
}: {
  value: string; onChange: (v: string) => void;
  options: { label: string; value: string }[]; placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all appearance-none"
      >
        <option value="" className="bg-[#0a0f1e] text-white/50">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-[#0a0f1e] text-white">{o.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 pointer-events-none" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PROGRESS STEPS
═══════════════════════════════════════════════════ */

const stepMeta = [
  { n: 1 as Step, label: "You", icon: User },
  { n: 2 as Step, label: "Background", icon: FileText },
  { n: 3 as Step, label: "Why Us", icon: Brain },
  { n: 4 as Step, label: "Final", icon: Zap },
];

function StepProgress({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 sm:mb-10">
      {stepMeta.map((s, i) => {
        const Icon = s.icon;
        const done = current > s.n;
        const active = current === s.n;
        return (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: active ? 1.1 : 1,
                  borderColor: done ? "#10b981" : active ? "#6366f1" : "rgba(255,255,255,0.1)",
                  background: done ? "#10b98120" : active ? "#6366f120" : "rgba(255,255,255,0.03)",
                }}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center border transition-all"
              >
                {done
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  : <Icon className="h-4 w-4" style={{ color: active ? "#818cf8" : "rgba(255,255,255,0.25)" }} />
                }
              </motion.div>
              <span className="text-[9px] mt-1 font-semibold hidden sm:block"
                style={{ color: active ? "#818cf8" : done ? "#10b981" : "rgba(255,255,255,0.25)" }}>
                {s.label}
              </span>
            </div>
            {i < stepMeta.length - 1 && (
              <div className="w-8 sm:w-14 h-px mx-1 sm:mx-2 mb-3 sm:mb-4 transition-all"
                style={{ background: done ? "linear-gradient(90deg,#10b981,#6366f1)" : "rgba(255,255,255,0.08)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FILE UPLOAD
═══════════════════════════════════════════════════ */

function ResumeUpload({ file, fileName, onFile }: {
  file: File | null; fileName: string; onFile: (f: File, name: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) return; // 10MB
    onFile(f, f.name);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      onClick={() => inputRef.current?.click()}
      className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all ${
        dragging ? "border-indigo-500/60 bg-indigo-500/8" : fileName ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/12 bg-white/2 hover:border-white/25 hover:bg-white/4"
      }`}
    >
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      {fileName ? (
        <div className="flex items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <FileText className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">{fileName}</p>
            <p className="text-[10px] text-white/35">Click to replace</p>
          </div>
          <CheckCircle2 className="h-5 w-5 text-emerald-400 ml-2" />
        </div>
      ) : (
        <div>
          <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
            <Upload className="h-6 w-6 text-white/35" />
          </div>
          <p className="text-sm font-semibold text-white/65 mb-1">
            Drop your resume here or <span className="text-indigo-400">browse</span>
          </p>
          <p className="text-xs text-white/30">PDF, DOC, DOCX · Max 10MB</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STEP PANELS
═══════════════════════════════════════════════════ */

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};
const slideTransition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};
function Step1({ data, update }: { data: FormData; update: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel required>First name</FormLabel>
          <FormInput placeholder="Alex" value={data.firstName} onChange={v => update("firstName", v)} icon={User} required />
        </div>
        <div>
          <FormLabel required>Last name</FormLabel>
          <FormInput placeholder="Morgan" value={data.lastName} onChange={v => update("lastName", v)} required />
        </div>
      </div>
      <div>
        <FormLabel required>Email address</FormLabel>
        <FormInput placeholder="alex@company.com" type="email" value={data.email} onChange={v => update("email", v)} icon={Mail} required />
      </div>
      <div>
        <FormLabel>Phone number</FormLabel>
        <FormInput placeholder="+1 (555) 000-0000" type="tel" value={data.phone} onChange={v => update("phone", v)} />
      </div>
      <div>
        <FormLabel required>Current location</FormLabel>
        <FormInput placeholder="City, Country" value={data.location} onChange={v => update("location", v)} icon={MapPin} required />
      </div>
    </div>
  );
}

function Step2({ data, update, onFile }: {
  data: FormData; update: (k: keyof FormData, v: string) => void;
  onFile: (f: File, name: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <FormLabel required>Resume / CV</FormLabel>
        <ResumeUpload file={data.resumeFile} fileName={data.resumeName} onFile={onFile} />
      </div>
      <div>
        <FormLabel>LinkedIn profile</FormLabel>
        <FormInput placeholder="linkedin.com/in/your-profile" value={data.linkedin} onChange={v => update("linkedin", v)} icon={Linkedin} />
      </div>
      <div>
        <FormLabel>GitHub / Portfolio</FormLabel>
        <FormInput placeholder="github.com/your-handle or portfolio URL" value={data.github} onChange={v => update("github", v)} icon={Github} />
      </div>
      <div>
        <FormLabel>Personal website</FormLabel>
        <FormInput placeholder="yoursite.com" value={data.portfolio} onChange={v => update("portfolio", v)} icon={Globe} />
      </div>
    </div>
  );
}

function Step3({ data, update }: { data: FormData; update: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <FormLabel required>Why StemmQ? Why this role?</FormLabel>
        <p className="text-[11px] text-white/30 mb-2">Tell us what draws you to this specific role at StemmQ. Be specific — generic answers won't stand out.</p>
        <FormTextarea
          placeholder="I've been thinking about decision infrastructure since watching a major strategy fail at my last company because of one unexamined assumption..."
          value={data.whyStemmq}
          onChange={v => update("whyStemmq", v)}
          rows={5}
          maxLength={1000}
        />
      </div>
      <div>
        <FormLabel required>Describe the most complex decision you've ever been responsible for</FormLabel>
        <p className="text-[11px] text-white/30 mb-2">Walk us through how you thought about it, what assumptions you made, and how it turned out.</p>
        <FormTextarea
          placeholder="When I was leading engineering at X, we had to decide whether to rebuild our core data pipeline or patch it. I structured the decision by first listing every assumption..."
          value={data.biggestDecision}
          onChange={v => update("biggestDecision", v)}
          rows={5}
          maxLength={1000}
        />
      </div>
      <div>
        <FormLabel required>Availability</FormLabel>
        <FormSelect
          value={data.availability}
          onChange={v => update("availability", v)}
          placeholder="When can you start?"
          options={[
            { value: "immediately", label: "Immediately" },
            { value: "2-weeks", label: "2 weeks notice" },
            { value: "1-month", label: "1 month notice" },
            { value: "2-months", label: "2 months notice" },
            { value: "3-months", label: "3+ months" },
          ]}
        />
      </div>
    </div>
  );
}

function Step4({
  data, update, onCheck,
}: {
  data: FormData; update: (k: keyof FormData, v: string) => void;
  onCheck: (v: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <FormLabel>Salary expectation (USD)</FormLabel>
        <FormSelect
          value={data.salary}
          onChange={v => update("salary", v)}
          placeholder="Select range"
          options={[
            { value: "80-100k", label: "$80,000 – $100,000" },
            { value: "100-130k", label: "$100,000 – $130,000" },
            { value: "130-160k", label: "$130,000 – $160,000" },
            { value: "160-200k", label: "$160,000 – $200,000" },
            { value: "200k+", label: "$200,000+" },
            { value: "discuss", label: "Open to discussion" },
          ]}
        />
      </div>
      <div>
        <FormLabel>Notice period</FormLabel>
        <FormSelect
          value={data.noticePeriod}
          onChange={v => update("noticePeriod", v)}
          placeholder="Current notice period"
          options={[
            { value: "none", label: "Not currently employed" },
            { value: "2-weeks", label: "2 weeks" },
            { value: "1-month", label: "1 month" },
            { value: "2-months", label: "2 months" },
            { value: "3-months", label: "3+ months" },
          ]}
        />
      </div>
      <div>
        <FormLabel>How did you hear about this role?</FormLabel>
        <FormSelect
          value={data.referral}
          onChange={v => update("referral", v)}
          placeholder="Select one"
          options={[
            { value: "linkedin", label: "LinkedIn" },
            { value: "twitter", label: "Twitter / X" },
            { value: "referral", label: "Employee referral" },
            { value: "website", label: "StemmQ website" },
            { value: "hn", label: "Hacker News" },
            { value: "other", label: "Other" },
          ]}
        />
      </div>

      {/* Terms */}
      <div className="rounded-2xl border border-white/8 bg-white/2 p-4 sm:p-5">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5 flex-shrink-0">
            <input type="checkbox" checked={data.agreeTerms} onChange={e => onCheck(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-indigo-500 cursor-pointer" />
          </div>
          <span className="text-xs sm:text-sm text-white/50 leading-relaxed">
            I confirm that all information provided in this application is accurate. I agree to StemmQ's{" "}
            <a href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</a>{" "}
            and consent to my data being used for recruitment purposes.
          </span>
        </label>
      </div>

      {/* What happens next */}
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2">
        <p className="text-[10px] text-white/35 uppercase tracking-widest font-semibold mb-3">What happens next</p>
        {[
          "A real human reviews your application within 5 business days",
          "You'll hear back either way — no ghosting",
          "If shortlisted, we'll send an async screen prompt",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="h-4 w-4 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[8px] font-bold text-indigo-400">{i + 1}</span>
            </div>
            <span className="text-xs text-white/50">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUCCESS STATE
═══════════════════════════════════════════════════ */

function SuccessScreen({ role, name }: { role: typeof roleDatabase[string]; name: string }) {
  return (
    <div className="text-center py-8 sm:py-12">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
        className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Application submitted, {name.split(" ")[0]}!
        </h2>
        <p className="text-sm sm:text-base text-white/50 max-w-md mx-auto mb-6 leading-relaxed">
          We've received your application for{" "}
          <span className="text-white/80 font-semibold">{role.title}</span>.
          A real human will review it within 5 business days.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto mb-8">
          {[
            { icon: Clock, label: "Review in", value: "5 business days", color: "#6366f1" },
            { icon: Mail, label: "Response to", value: "Every applicant", color: "#10b981" },
            { icon: Zap, label: "Process", value: "2–3 weeks total", color: "#f59e0b" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border border-white/8 bg-white/2 p-3 text-center">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center mx-auto mb-2"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                </div>
                <p className="text-[9px] text-white/30 mb-0.5">{s.label}</p>
                <p className="text-[10px] font-semibold text-white/65">{s.value}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/careers">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-all w-full sm:w-auto justify-center">
              <ArrowLeft className="h-4 w-4" /> Back to Careers
            </motion.button>
          </Link>
          <Link href="/">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="relative group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-lg shadow-indigo-500/20 w-full sm:w-auto justify-center"
              style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
              <span className="relative z-10 flex items-center gap-2">
                Explore StemmQ <ArrowRight className="h-4 w-4" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const roleSlug = searchParams?.get("role") ?? "default";
  const defaultRole = roleDatabase["default"] as typeof roleDatabase[string];
  const role = roleDatabase[roleSlug] ?? defaultRole;

  const [step, setStep] = useState<Step>(1);
  const [dir, setDir] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "", location: "",
    linkedin: "", github: "", portfolio: "", resumeFile: null, resumeName: "",
    whyStemmq: "", biggestDecision: "", availability: "",
    salary: "", noticePeriod: "", referral: "", agreeTerms: false,
  });

  const update = (k: keyof FormData, v: string) => setForm(prev => ({ ...prev, [k]: v }));
  const onFile = (f: File, name: string) => setForm(prev => ({ ...prev, resumeFile: f, resumeName: name }));

  const canProceed: Record<Step, boolean> = {
    1: !!(form.firstName && form.lastName && form.email && form.location),
    2: !!form.resumeName,
    3: !!(form.whyStemmq && form.biggestDecision && form.availability),
    4: form.agreeTerms,
  };

  const next = () => {
    if (!canProceed[step]) return;
    setDir(1);
    setStep(s => Math.min(s + 1, 4) as Step);
  };

  const back = () => {
    setDir(-1);
    setStep(s => Math.max(s - 1, 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed[4]) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  const fullName = `${form.firstName} ${form.lastName}`.trim();

  return (
    <div className="min-h-screen bg-[#030712]">
      <MarketingHeader />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.018] z-0"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />

      <main className="relative z-10 pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          {/* Back link */}
          <Reveal>
            <Link href="/careers" className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/65 transition-colors mb-6 sm:mb-8">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to all roles
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 items-start">

            {/* ── LEFT — role info (sticky on desktop) ── */}
            <div className="lg:col-span-1 lg:sticky lg:top-28">
              <Reveal>
                <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-xl shadow-black/40">
                  {/* Color bar */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${role.color}, ${role.color}88)` }} />
                  <div className="p-5 sm:p-6">
                    {/* Dept badge */}
                    <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider mb-4"
                      style={{ color: role.color, background: `${role.color}12`, borderColor: `${role.color}25` }}>
                      <Briefcase className="h-3 w-3" /> {role.dept}
                    </span>
                    <h1 className="text-base sm:text-lg font-bold text-white leading-snug mb-3">{role.title}</h1>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-[10px] text-white/40 border border-white/8 bg-white/3 px-2 py-0.5 rounded-full">
                        <MapPin className="h-3 w-3" /> {role.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-white/40 border border-white/8 bg-white/3 px-2 py-0.5 rounded-full">
                        <Clock className="h-3 w-3" /> {role.type}
                      </span>
                    </div>

                    <div className="h-px bg-white/6 mb-4" />

                    <p className="text-xs sm:text-sm text-white/50 leading-relaxed mb-4">{role.about}</p>

                    <div>
                      <p className="text-[9px] text-white/25 uppercase tracking-widest font-semibold mb-2.5">What we look for</p>
                      <ul className="space-y-2">
                        {role.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: `${role.color}15`, border: `1px solid ${role.color}25` }}>
                              <CheckCircle2 className="h-2.5 w-2.5" style={{ color: role.color }} />
                            </div>
                            <span className="text-[10px] sm:text-xs text-white/40 leading-snug">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Culture signal */}
                    <div className="mt-4 rounded-xl border border-white/6 bg-white/2 p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Shield className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Our commitment</span>
                      </div>
                      <p className="text-[10px] text-white/30 leading-relaxed">
                        Every applicant hears back. We review within 5 business days. No automated screeners.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ── RIGHT — application form ── */}
            <div className="lg:col-span-2">
              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-xl shadow-black/40">
                  <div className="p-5 sm:p-7 lg:p-8">

                    {!submitted ? (
                      <>
                        {/* Header */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-3 py-1 text-[10px] font-medium text-indigo-300">
                              <Sparkles className="h-3 w-3" /> Apply Now
                            </span>
                          </div>
                          <h2 className="text-lg sm:text-xl font-bold text-white">Your application</h2>
                          <p className="text-xs sm:text-sm text-white/35 mt-1">
                            Step {step} of 4 — {stepMeta[step - 1]?.label ?? ""}
                          </p>
                        </div>

                        <StepProgress current={step} />

                        {/* Form panels */}
                        <form onSubmit={step === 4 ? handleSubmit : e => { e.preventDefault(); next(); }}>
                          <AnimatePresence mode="wait" custom={dir}>
                            <motion.div
                              key={step}
                              custom={dir}
                              variants={slideVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={slideTransition}
                            >
                              {step === 1 && <Step1 data={form} update={update} />}
                              {step === 2 && <Step2 data={form} update={update} onFile={onFile} />}
                              {step === 3 && <Step3 data={form} update={update} />}
                              {step === 4 && <Step4 data={form} update={update} onCheck={v => setForm(prev => ({ ...prev, agreeTerms: v }))} />}
                            </motion.div>
                          </AnimatePresence>

                          {/* Validation hint */}
                          {!canProceed[step] && step < 4 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              className="mt-4 flex items-center gap-2 text-amber-400/80">
                              <AlertCircle className="h-4 w-4 flex-shrink-0" />
                              <p className="text-xs">Complete the required fields above to continue</p>
                            </motion.div>
                          )}

                          {/* Nav buttons */}
                          <div className="flex items-center justify-between mt-7 pt-5 border-t border-white/6">
                            <button type="button" onClick={back}
                              className={`flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/40 hover:text-white/70 transition-colors ${step === 1 ? "invisible" : ""}`}>
                              <ArrowLeft className="h-4 w-4" /> Back
                            </button>

                            {step < 4 ? (
                              <motion.button type="submit" whileHover={canProceed[step] ? { scale: 1.04 } : {}} whileTap={canProceed[step] ? { scale: 0.97 } : {}}
                                disabled={!canProceed[step]}
                                className="relative group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                                <span className="relative z-10 flex items-center gap-2">
                                  Continue <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                              </motion.button>
                            ) : (
                              <motion.button type="submit" whileHover={canProceed[4] ? { scale: 1.04 } : {}} whileTap={canProceed[4] ? { scale: 0.97 } : {}}
                                disabled={!canProceed[4] || submitting}
                                className="relative group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-xl shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: submitting ? "#059669" : "linear-gradient(135deg,#059669,#10b981)" }}>
                                <span className="relative z-10 flex items-center gap-2">
                                  {submitting
                                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                                    : <><Sparkles className="h-4 w-4" /> Submit Application</>
                                  }
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                              </motion.button>
                            )}
                          </div>
                        </form>
                      </>
                    ) : (
                      <SuccessScreen role={role} name={fullName || "there"} />
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}