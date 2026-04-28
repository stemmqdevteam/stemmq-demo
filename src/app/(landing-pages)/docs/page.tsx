"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Book, Code2, Zap, Shield, Bot, BarChart3,
  Search, Terminal, Copy, Check, ChevronRight,
  Brain, Database, Network, FileText, Globe, Key,
  CheckCircle2, Layers, Target
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   COPY BUTTON
═══════════════════════════════════════════════════ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} onClick={copy}
      className="p-1.5 rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 transition-all flex-shrink-0">
      <AnimatePresence mode="wait">
        {copied
          ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            </motion.div>
          : <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Copy className="h-3.5 w-3.5 text-white/35" />
            </motion.div>
        }
      </AnimatePresence>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════
   CODE BLOCK
═══════════════════════════════════════════════════ */

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const langColors: Record<string, string> = {
    bash: "#10b981", typescript: "#3b82f6", python: "#f59e0b",
    go: "#06b6d4", ruby: "#ef4444", json: "#a855f7",
  };
  const color = langColors[lang] ?? "#6366f1";

  const highlighted = code
    .replace(/(\/\/.*)/g, `<span style="color:rgba(255,255,255,0.28)">$1</span>`)
    .replace(/("[\w\s@./:\-_]*")/g, `<span style="color:#a3e635">$1</span>`)
    .replace(/\b(import|const|await|new|return|async|from|process)\b/g, `<span style="color:#818cf8">$1</span>`)
    .replace(/\b(true|false|null)\b/g, `<span style="color:#f59e0b">$1</span>`);

  return (
    <div className="rounded-2xl border border-white/8 bg-[#060c18] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/6 bg-white/2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ color, background: `${color}15` }}>
            {lang}
          </span>
        </div>
        <CopyButton text={code} />
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-[11px] sm:text-xs font-mono text-slate-300 leading-relaxed whitespace-pre"
          dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */

const quickStart = [
  {
    step: "01", title: "Install the SDK", desc: "Add StemmQ to your project",
    lang: "bash", color: "#10b981",
    code: `npm install @stemmq/sdk\n# or\nyarn add @stemmq/sdk\n# or\npnpm add @stemmq/sdk`,
  },
  {
    step: "02", title: "Authenticate", desc: "Initialize with your API key",
    lang: "typescript", color: "#3b82f6",
    code: `import { StemmQ } from '@stemmq/sdk'\n\nconst client = new StemmQ({\n  apiKey: process.env.STEMMQ_API_KEY,\n  workspace: process.env.STEMMQ_WORKSPACE\n})`,
  },
  {
    step: "03", title: "Create your first Decision", desc: "Structure a decision object",
    lang: "typescript", color: "#a855f7",
    code: `const decision = await client.decisions.create({\n  title: "Launch EMEA expansion",\n  intent: "Growth",\n  assumptions: [\n    { text: "TAM > $50M", weight: 5 },\n    { text: "6-month ramp time", weight: 4 }\n  ]\n})\n// -> { id: "dec_abc123", dqs: 74, status: "active" }`,
  },
];

const apiSections = [
  { icon: Brain, color: "#6366f1", label: "Decisions", count: 4, endpoints: ["POST /decisions", "GET /decisions/:id", "PATCH /decisions/:id", "DELETE /decisions/:id"] },
  { icon: Bot, color: "#a855f7", label: "Agents", count: 5, endpoints: ["POST /agents", "GET /agents", "POST /agents/:id/propose", "GET /agents/:id/performance", "POST /external-agent/decision"] },
  { icon: Shield, color: "#f59e0b", label: "Decision Gate", count: 5, endpoints: ["POST /gate/evaluate", "POST /gate/approve", "POST /gate/revise", "POST /gate/reject", "POST /gate/escalate"] },
  { icon: BarChart3, color: "#10b981", label: "Assumptions", count: 3, endpoints: ["POST /assumptions", "PATCH /assumptions/:id/status", "GET /assumptions/accuracy"] },
  { icon: Code2, color: "#3b82f6", label: "Simulations", count: 3, endpoints: ["POST /simulations", "POST /simulations/:id/run", "GET /simulations/:id/outcomes"] },
  { icon: Zap, color: "#06b6d4", label: "Webhooks", count: 3, endpoints: ["POST /webhooks", "GET /webhooks", "DELETE /webhooks/:id"] },
];

const sdks = [
  { lang: "Node.js / TS", install: "npm install @stemmq/sdk", color: "#10b981", icon: "⬡" },
  { lang: "Python", install: "pip install stemmq", color: "#3b82f6", icon: "🐍" },
  { lang: "Go", install: "go get github.com/stemmq/sdk-go", color: "#06b6d4", icon: "⬢" },
  { lang: "Ruby", install: "gem install stemmq", color: "#ef4444", icon: "◆" },
];

const guides = [
  { icon: Bot, color: "#6366f1", title: "Building Agents with the No-Code Builder", desc: "Create agents with identity, capabilities, decision scope, and risk boundaries.", time: "10 min" },
  { icon: Target, color: "#a855f7", title: "Assumption Calibration Workflow", desc: "Build a team-wide assumption tracking and validation process.", time: "8 min" },
  { icon: Network, color: "#3b82f6", title: "Multi-Agent Orchestration Setup", desc: "Configure agents that collaborate and propose joint decisions.", time: "15 min" },
  { icon: FileText, color: "#10b981", title: "Compliance Audit Log Export", desc: "Export decision history for regulatory reporting in CSV/JSON/PDF.", time: "5 min" },
  { icon: Globe, color: "#f59e0b", title: "Integrating with Salesforce CRM", desc: "Cross-reference decisions against CRM data automatically.", time: "12 min" },
  { icon: Key, color: "#06b6d4", title: "Connecting External Agents via Webhook", desc: "Route third-party agent actions through StemmQ's Decision Gate.", time: "7 min" },
];

const sampleReqCode = `{\n  "title": "Launch EMEA expansion",  // required\n  "intent": "Growth",               // required enum\n  "owner": "alex@company.com",       // optional\n  "assumptions": [\n    {\n      "text": "EMEA TAM > $50M",\n      "weight": 5\n    }\n  ],\n  "tags": ["q1", "strategic"]\n}`;

const sampleResCode = `{\n  "id": "dec_abc123",\n  "dqs": 74,\n  "status": "active",\n  "diw": 8.4,\n  "createdAt": "2026-03-19T09:41:02Z",\n  "assumptions": [\n    { "id": "asm_xyz789", "status": "pending" }\n  ]\n}`;

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */

function DocsHero({ search, setSearch }: {
  search: string; setSearch: (v: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 sm:pt-32 pb-14 sm:pb-16 bg-[#030712]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "52px 52px" }} />
      <Orb delay={0} className="absolute top-[-10%] left-[-4%] w-[440px] h-[440px] rounded-full bg-indigo-600/10 blur-[110px] pointer-events-none" />
      <Orb delay={4} className="absolute bottom-[-5%] right-[-3%] w-[360px] h-[360px] rounded-full bg-violet-600/8 blur-[90px] pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-5 backdrop-blur-sm">
            <Book className="h-3.5 w-3.5" /> Documentation
          </span>
        </Reveal>
        <Reveal delay={0.07}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.06] mb-4">
            Everything you need to{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              build with StemmQ
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.13}>
          <p className="text-sm sm:text-base md:text-lg text-white/45 max-w-xl mx-auto mb-8 leading-relaxed">
            API reference, SDKs, integration guides, and quickstart examples.
          </p>
        </Reveal>

        {/* Search */}
        <Reveal delay={0.18}>
          <div className="relative max-w-lg mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 pointer-events-none" />
            <input type="text"
              placeholder='Search docs — try "decision gate", "DQS", "webhooks"...'
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-12 rounded-2xl border border-white/10 bg-white/5 pl-11 pr-14 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all backdrop-blur-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/20 border border-white/8 bg-white/3 rounded-lg px-2 py-1">
              CMD+K
            </div>
          </div>
        </Reveal>

        {/* Quick nav */}
        <Reveal delay={0.24}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { label: "Quick Start", icon: Zap, color: "#10b981", href: "#quickstart" },
              { label: "API Reference", icon: Code2, color: "#6366f1", href: "#api" },
              { label: "SDKs", icon: Layers, color: "#a855f7", href: "#sdks" },
              { label: "Guides", icon: Book, color: "#f59e0b", href: "#guides" },
            ].map(n => {
              const Icon = n.icon;
              return (
                <a key={n.label} href={n.href}>
                  <motion.div whileHover={{ y: -4, borderColor: `${n.color}40` }} whileTap={{ scale: 0.97 }}
                    className="rounded-2xl border border-white/8 bg-white/3 px-3 py-3 text-center cursor-pointer transition-all hover:bg-white/5 group">
                    <div className="h-8 w-8 rounded-xl flex items-center justify-center mx-auto mb-2"
                      style={{ background: `${n.color}15`, border: `1px solid ${n.color}25` }}>
                      <Icon className="h-4 w-4" style={{ color: n.color }} />
                    </div>
                    <p className="text-[11px] sm:text-xs font-semibold text-white/60 group-hover:text-white/85 transition-colors">{n.label}</p>
                  </motion.div>
                </a>
              );
            })}
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   QUICK START
═══════════════════════════════════════════════════ */

function QuickStartSection() {
  return (
    <section id="quickstart" className="py-14 sm:py-20 bg-white/[0.015] border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Quick Start</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">Up and running in 3 steps</h2>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {quickStart.map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden h-full">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/6 bg-white/2">
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}88)` }}>
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    <p className="text-[10px] text-white/35">{item.desc}</p>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <CodeBlock code={item.code} lang={item.lang} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-6 text-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 px-5 py-3">
            <Terminal className="h-4 w-4 text-indigo-400" />
            <p className="text-xs sm:text-sm text-white/55">
              Need an API key?{" "}
              <Link href={ROUTES.auth} className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
                Get one free
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   API REFERENCE
═══════════════════════════════════════════════════ */

function APISection() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <section id="api" className="py-14 sm:py-20 bg-[#030712]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
              <Code2 className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">API Reference</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">Full REST API</h2>
            </div>
          </div>
          <p className="text-sm text-white/40 mt-2 ml-12">Every StemmQ capability available via REST with OpenAPI 3.0 spec.</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Endpoint groups */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/6 bg-white/2">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Endpoint Groups</span>
              </div>
              <div className="divide-y divide-white/4">
                {apiSections.map((section, i) => {
                  const Icon = section.icon;
                  const isActive = activeSection === i;
                  return (
                    <motion.button key={section.label} onClick={() => setActiveSection(i)}
                      className={`w-full text-left px-4 py-3.5 transition-all ${isActive ? "bg-white/4" : "hover:bg-white/3"}`}
                      style={{ borderLeft: `2px solid ${isActive ? section.color : "transparent"}` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="h-6 w-6 rounded-lg flex items-center justify-center"
                            style={{ background: `${section.color}15`, border: `1px solid ${section.color}25` }}>
                            <Icon className="h-3.5 w-3.5" style={{ color: section.color }} />
                          </div>
                          <span className="text-xs font-bold text-white/80">{section.label}</span>
                        </div>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ color: section.color, background: `${section.color}15` }}>
                          {section.count}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {section.endpoints.map(ep => {
                          const method = ep.split(" ")[0];
                          const mc: Record<string, string> = { POST: "#10b981", GET: "#6366f1", PATCH: "#f59e0b", DELETE: "#ef4444" };
                          return (
                            <code key={ep} className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded"
                              style={{ color: mc[method] ?? "#6366f1", background: `${mc[method] ?? "#6366f1"}12` }}>
                              {ep}
                            </code>
                          );
                        })}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sample endpoint panel */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden h-full">
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-white/6 bg-white/2">
                <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">POST</span>
                <code className="text-xs sm:text-sm font-mono text-white/75">/v1/decisions</code>
                <span className="ml-auto text-[9px] text-white/20 border border-white/8 bg-white/3 px-2 py-0.5 rounded-full">v1</span>
              </div>

              <div className="p-4 sm:p-5 space-y-5">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Description</p>
                  <p className="text-xs sm:text-sm text-white/55 leading-relaxed">
                    Create a new Structured Decision Object (SDO) with intent classification, assumptions, and automatic DQS scoring.
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Request Body</p>
                  <CodeBlock code={sampleReqCode} lang="json" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Response</p>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">201 Created</span>
                  </div>
                  <CodeBlock code={sampleResCode} lang="json" />
                </div>

                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 flex items-start gap-2.5">
                  <Key className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-indigo-300 mb-0.5">Authentication required</p>
                    <p className="text-[10px] text-white/35 leading-snug">
                      Pass your API key as <code className="text-indigo-400">Authorization: Bearer sk_live_...</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Reveal delay={0.2} className="mt-5 text-center">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white/55 border border-white/10 bg-white/3 hover:bg-white/6 hover:text-white transition-all">
            <FileText className="h-4 w-4" /> Download OpenAPI 3.0 Spec
          </motion.button>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SDKs
═══════════════════════════════════════════════════ */

function SDKSection() {
  return (
    <section id="sdks" className="py-14 sm:py-20 bg-white/[0.015] border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Layers className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">SDKs</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">Official client libraries</h2>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {sdks.map((sdk, i) => (
            <Reveal key={sdk.lang} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5 }}
                className="group rounded-2xl border border-white/8 bg-white/2 p-5 sm:p-6 hover:border-white/15 transition-all cursor-pointer h-full">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4 text-2xl"
                  style={{ background: `${sdk.color}12`, border: `1px solid ${sdk.color}22` }}>
                  {sdk.icon}
                </div>
                <p className="text-sm font-bold text-white mb-2">{sdk.lang}</p>
                <div className="rounded-xl border border-white/6 bg-white/2 px-3 py-2 mb-4 flex items-center justify-between gap-2">
                  <code className="text-[10px] font-mono text-white/40 truncate">{sdk.install}</code>
                  <CopyButton text={sdk.install} />
                </div>
                <motion.div whileHover={{ x: 2 }} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: sdk.color }}>
                  View docs <ChevronRight className="h-3.5 w-3.5" />
                </motion.div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-6">
          <div className="rounded-2xl border border-white/6 bg-white/2 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Globe className="h-4 w-4 text-white/40" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/65">Community SDKs</p>
                <p className="text-[10px] text-white/30">Java, Rust, .NET, PHP, and more — community maintained</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.04 }}
              className="flex-shrink-0 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
              Browse community SDKs <ChevronRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   GUIDES
═══════════════════════════════════════════════════ */

function GuidesSection() {
  return (
    <section id="guides" className="py-14 sm:py-20 bg-[#030712]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                <Book className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Guides</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">Popular integration guides</h2>
              </div>
            </div>
            <motion.button whileHover={{ x: 2 }}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              All guides <ChevronRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {guides.map((guide, i) => {
            const Icon = guide.icon;
            return (
              <Reveal key={i} delay={i * 0.06}>
                <motion.div whileHover={{ y: -5, borderColor: `${guide.color}30` }}
                  className="group relative rounded-2xl border border-white/8 bg-white/2 p-5 sm:p-6 overflow-hidden h-full cursor-pointer transition-all hover:bg-white/4">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `radial-gradient(circle at 20% 20%, ${guide.color}06, transparent 60%)` }} />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${guide.color}15`, border: `1px solid ${guide.color}25` }}>
                        <Icon className="h-5 w-5" style={{ color: guide.color }} />
                      </div>
                      <span className="text-[9px] font-semibold text-white/30 border border-white/8 bg-white/3 px-2 py-1 rounded-full flex-shrink-0 flex items-center gap-1">
                        <Book className="h-2.5 w-2.5" /> {guide.time}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white/85 mb-2 leading-snug group-hover:text-white transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/40 leading-relaxed mb-4">{guide.desc}</p>
                    <motion.div whileHover={{ x: 3 }} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: guide.color }}>
                      Read guide <ArrowRight className="h-3.5 w-3.5" />
                    </motion.div>
                  </div>
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
   BOTTOM CTA
═══════════════════════════════════════════════════ */

function DocsCTA() {
  return (
    <section className="py-12 sm:py-14 border-t border-white/5 bg-[#030712]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/8 to-violet-500/5 p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.14), transparent 60%)" }} />
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Ready to start building?</h2>
                <p className="text-sm text-white/45 mb-5 leading-relaxed">
                  Get your API key and make your first decision object in under 5 minutes.
                </p>
                <Link href={ROUTES.auth}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="relative group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-lg shadow-indigo-500/20 w-full sm:w-auto justify-center"
                    style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                    <span className="relative z-10 flex items-center gap-2">
                      Get API Key Free <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </Link>
              </div>
              <div className="space-y-2">
                {[
                  "REST API with OpenAPI 3.0 spec",
                  "Node.js, Python, Go and Ruby SDKs",
                  "Webhook support for all events",
                  "Sandbox environment for testing",
                  "Rate limits: 1,000 req/min on free tier",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="h-4 w-4 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-2.5 w-2.5 text-indigo-400" />
                    </div>
                    <span className="text-xs text-white/55">{f}</span>
                  </div>
                ))}
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

export default function DocsPage() {
  const [search, setSearch] = useState("");
  return (
    <div className="min-h-screen bg-[#030712]">
      <MarketingHeader />
      <DocsHero search={search} setSearch={setSearch} />
      <QuickStartSection />
      <APISection />
      <SDKSection />
      <GuidesSection />
      <DocsCTA />
      <MarketingFooter />
    </div>
  );
}