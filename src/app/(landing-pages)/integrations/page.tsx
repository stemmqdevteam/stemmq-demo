"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Code2, Zap, Database, Bot, Globe, ArrowRight, CheckCircle2,
  Shield, Sparkles, Network, Brain, Copy, Check, ExternalLink,
  TrendingUp, BarChart3, Layers, Users, Lock, ChevronRight,
  Activity, FileText, Hash, Terminal
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { CTASection } from "@/components/marketing/cta-section";
import { EnterpriseSection } from "@/components/marketing/enterprise-section";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════ */

function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [-15, 15, -15], x: [-8, 8, -8] }}
      transition={{ duration: 11 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    />
  );
}

function Reveal({
  children, delay = 0, className = "", direction = "up",
}: { children: React.ReactNode; delay?: number; className?: string; direction?: "up" | "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const xInit = direction === "left" ? -28 : direction === "right" ? 28 : 0;
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: direction === "up" ? 22 : 0, x: xInit }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.button
      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 text-[10px] font-semibold rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 transition-all hover:bg-white/10"
      style={{ color: copied ? "#10b981" : "rgba(255,255,255,0.4)" }}
    >
      {copied ? <><Check className="h-3 w-3" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
    </motion.button>
  );
}

function CodeBlock({ code, lang = "ts", title }: { code: string; lang?: string; title?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#080d1a] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/6 bg-white/3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-red-500/50" />
            <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
            <div className="h-2 w-2 rounded-full bg-green-500/50" />
          </div>
          {title && <span className="text-[10px] text-white/30 font-mono ml-1">{title}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-white/20 font-mono uppercase">{lang}</span>
          <CopyButton text={code} />
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-[10px] sm:text-xs font-mono text-slate-300 whitespace-pre leading-relaxed"><code>{code}</code></pre>
      </div>
    </div>
  );
}

function LiveBadge({ label, color = "emerald" }: { label: string; color?: "emerald" | "indigo" | "violet" }) {
  const c = {
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" },
    indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-300", dot: "bg-indigo-400" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-300", dot: "bg-violet-400" },
  }[color];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${c.bg} border ${c.border} px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${c.text}`}>
      <span className="relative flex h-1.5 w-1.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-75`} />
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${c.dot}`} />
      </span>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */

const integrationLogos = [
  { name: "Salesforce", color: "#06b6d4", abbr: "SF" },
  { name: "HubSpot", color: "#f97316", abbr: "HS" },
  { name: "Slack", color: "#6366f1", abbr: "SL" },
  { name: "Notion", color: "#94a3b8", abbr: "NT" },
  { name: "Zapier", color: "#f59e0b", abbr: "ZP" },
  { name: "OpenAI", color: "#10b981", abbr: "OA" },
  { name: "Anthropic", color: "#a855f7", abbr: "AN" },
  { name: "Stripe", color: "#6366f1", abbr: "ST" },
  { name: "Segment", color: "#10b981", abbr: "SG" },
  { name: "Amplitude", color: "#3b82f6", abbr: "AM" },
  { name: "Linear", color: "#8b5cf6", abbr: "LN" },
  { name: "Jira", color: "#3b82f6", abbr: "JR" },
  { name: "GitHub", color: "#64748b", abbr: "GH" },
  { name: "Datadog", color: "#ef4444", abbr: "DD" },
  { name: "Snowflake", color: "#06b6d4", abbr: "SW" },
  { name: "dbt", color: "#f59e0b", abbr: "dbt" },
];

const tabs = [
  { id: "api", label: "REST API", icon: Code2, color: "#6366f1" },
  { id: "webhooks", label: "Webhooks", icon: Zap, color: "#f59e0b" },
  { id: "crm", label: "CRM", icon: Database, color: "#10b981" },
  { id: "agents", label: "External Agents", icon: Bot, color: "#a855f7" },
];

const webhookEvents = [
  { event: "decision.created", trigger: "New decision object created", color: "#6366f1" },
  { event: "decision.gate.triggered", trigger: "Decision Gate review required", color: "#f59e0b" },
  { event: "decision.approved", trigger: "Decision approved for execution", color: "#10b981" },
  { event: "agent.proposal.pending", trigger: "Agent awaiting human approval", color: "#a855f7" },
  { event: "assumption.invalidated", trigger: "Assumption marked as false", color: "#ef4444" },
  { event: "outcome.logged", trigger: "Outcome tracking entry created", color: "#06b6d4" },
];

const crmIntegrations = [
  { name: "Salesforce", color: "#06b6d4" },
  { name: "HubSpot", color: "#f97316" },
  { name: "Pipedrive", color: "#ef4444" },
  { name: "Intercom", color: "#3b82f6" },
  { name: "Segment", color: "#10b981" },
  { name: "Amplitude", color: "#6366f1" },
];

const API_CODE = `POST /v1/decisions
Authorization: Bearer sk_live_...

{
  "title": "Launch EMEA market expansion",
  "intent": "Growth",
  "owner": "sarah@company.com",
  "assumptions": [
    { "text": "TAM > $50M", "weight": 5 },
    { "text": "6-month ramp time", "weight": 3 }
  ]
}

// → 201 Created
{
  "id": "dec_abc123",
  "dqs": 87,
  "status": "active",
  "createdAt": "2026-03-19T..."
}`;

const AGENT_CODE = `POST /v1/external-agent/decision
X-Agent-ID: agent_pricing_gpt4

{
  "agent_name": "GPT-4 Pricing Agent",
  "proposed_action": "Set Q4 price to $149/seat",
  "reasoning": "Competitor analysis shows...",
  "confidence": 0.81
}

// → Decision Gate evaluates in real-time
{
  "gate_result": "approved",
  "decision_id": "dec_xyz789",
  "dqs": 79,
  "audit_trail": true
}`;

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */

function IntegrationsHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 sm:pt-32 pb-14 sm:pb-16 bg-background">
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "52px 52px" }} />
      <Orb delay={0} className="absolute top-[-8%] right-[-3%] w-[420px] h-[420px] rounded-full bg-indigo-600/10 blur-[110px] pointer-events-none" />
      <Orb delay={4} className="absolute bottom-[-5%] left-[-3%] w-[360px] h-[360px] rounded-full bg-violet-600/8 blur-[90px] pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-5 backdrop-blur-sm">
            <Network className="h-3.5 w-3.5" /> Integrations
          </span>
        </Reveal>
        <Reveal delay={0.07}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.06] mb-4">
            Connect StemmQ to your{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              entire stack
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.13}>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            StemmQ sits at the intelligence layer — not the execution layer. Connect your existing tools
            and let every action become a governed, auditable decision.
          </p>
        </Reveal>

        {/* Integration logo marquee */}
        <Reveal delay={0.2}>
          <div className="relative overflow-hidden mb-6">
            {/* Fade masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-4 sm:gap-5 flex-nowrap"
              style={{ willChange: "transform" }}
            >
              {[...integrationLogos, ...integrationLogos].map((logo, i) => (
                <div key={i} className="flex items-center gap-2 flex-shrink-0 group cursor-default">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white/60 group-hover:text-white/90 transition-all"
                    style={{ background: `${logo.color}15`, border: `1px solid ${logo.color}25` }}>
                    {logo.abbr}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground/55 transition-colors whitespace-nowrap">{logo.name}</span>
                  <span className="ml-4 h-1 w-1 rounded-full bg-white/10 flex-shrink-0" />
                </div>
              ))}
            </motion.div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="text-[11px] text-muted-foreground">{integrationLogos.length}+ integrations · REST API · Webhooks · SDKs</p>
        </Reveal>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   HOW IT WORKS — the intelligence layer diagram
═══════════════════════════════════════════════════ */

function IntelligenceLayerSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => { setActive(i); i++; if (i > 4) clearInterval(t); }, 500);
    return () => clearInterval(t);
  }, [inView]);

  const layers = [
    { label: "Your Tools", items: ["Slack", "CRM", "Notion"], color: "#64748b", icon: Globe },
    { label: "External Agents", items: ["GPT-4", "Claude", "Custom"], color: "#a855f7", icon: Bot },
    { label: "StemmQ Gate", items: ["Evaluate", "Govern", "Log"], color: "#6366f1", icon: Shield, highlight: true },
    { label: "Org Memory", items: ["History", "Patterns", "DQS"], color: "#3b82f6", icon: Brain },
    { label: "Execution", items: ["Approved", "Tracked", "Audited"], color: "#10b981", icon: Zap },
  ];

  return (
    <section className="py-14 sm:py-16 border-y border-border/30 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-8 sm:mb-10">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">Architecture</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            StemmQ is the{" "}
            <span style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              intelligence layer
            </span>
          </h2>
        </Reveal>

        <div ref={ref}>
          {/* Desktop: horizontal */}
          <div className="hidden md:flex items-stretch justify-center gap-1">
            {layers.map((layer, i) => {
              const Icon = layer.icon;
              const done = active >= i;
              return (
                <div key={layer.label} className="flex items-center gap-1 flex-1 max-w-[160px]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={done ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all"
                    style={{
                      borderColor: done ? (layer.highlight ? `${layer.color}60` : `${layer.color}30`) : "var(--border)",
                      background: done ? (layer.highlight ? `${layer.color}14` : `${layer.color}07`) : "var(--card)",
                      boxShadow: done && layer.highlight ? `0 0 40px ${layer.color}15` : "none",
                    }}
                  >
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                      style={{ background: done ? `${layer.color}20` : "var(--muted)" }}>
                      <Icon className="h-5 w-5" style={{ color: done ? layer.color : "var(--muted-foreground)" }} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: done ? "var(--foreground)" : "var(--muted-foreground)" }}>
                      {layer.label}
                    </p>
                    <div className="space-y-0.5">
                      {layer.items.map(item => (
                        <p key={item} className="text-[9px]"
                          style={{ color: done ? "var(--muted-foreground)" : "var(--muted-foreground)" }}>
                          {item}
                        </p>
                      ))}
                    </div>
                    {layer.highlight && done && (
                      <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: layer.color }} />
                    )}
                  </motion.div>
                  {i < layers.length - 1 && (
                    <motion.div animate={{ opacity: active > i ? 1 : 0.1 }} className="h-px w-5 flex-shrink-0"
                      style={{ background: active > i ? `linear-gradient(90deg,${layer.color}80,${layers[i+1].color}80)` : "var(--border)" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: 2-col grid */}
          <div className="md:hidden grid grid-cols-2 gap-2.5 sm:gap-3">
            {layers.map((layer, i) => {
              const Icon = layer.icon;
              const done = active >= i;
              return (
                <motion.div key={layer.label}
                  initial={{ opacity: 0, y: 16 }} animate={done ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4 }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center ${layer.highlight && done ? "col-span-2" : ""}`}
                  style={{ borderColor: done ? `${layer.color}30` : "var(--border)", background: done ? `${layer.color}07` : "var(--card)" }}>
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ background: done ? `${layer.color}18` : "var(--muted)" }}>
                    <Icon className="h-4 w-4" style={{ color: done ? layer.color : "var(--muted-foreground)" }} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: done ? "var(--foreground)" : "var(--muted-foreground)" }}>
                    {layer.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   INTEGRATION CATEGORIES — tabbed
═══════════════════════════════════════════════════ */

/* Webhook events visual */
function WebhookEventsPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(v => (v + 1) % webhookEvents.length), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative">
      <div className="absolute -top-3 -right-3 z-20"><LiveBadge label="Firing live" color="indigo" /></div>
      <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 px-4 py-3 bg-white/3 border-b border-white/6">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/5 border border-white/8 px-3 py-0.5 text-[10px] text-white/30">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Webhook Event Stream
            </div>
          </div>
        </div>
        <div className="p-4 space-y-1.5">
          <div className="grid grid-cols-5 text-[8px] font-bold text-white/20 uppercase tracking-widest px-2 pb-2 border-b border-white/5">
            <span className="col-span-2">Event</span>
            <span className="col-span-3">Trigger</span>
          </div>
          {webhookEvents.map((e, i) => (
            <motion.div key={i}
              animate={{ borderColor: tick === i ? `${e.color}35` : "rgba(255,255,255,0.05)", background: tick === i ? `${e.color}06` : "rgba(255,255,255,0.01)" }}
              className="grid grid-cols-5 items-center rounded-lg border px-3 py-2 transition-all gap-2"
            >
              <code className="col-span-2 text-[9px] font-mono truncate" style={{ color: tick === i ? e.color : "rgba(99,102,241,0.7)" }}>{e.event}</code>
              <span className="col-span-3 text-[9px] text-white/40 leading-snug">{e.trigger}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* CRM visual */
function CRMVisual() {
  const [validated, setValidated] = useState(0);
  useEffect(() => {
    if (validated >= 3) return;
    const t = setTimeout(() => setValidated(v => v + 1), 1200);
    return () => clearTimeout(t);
  }, [validated]);

  return (
    <div className="relative">
      <div className="absolute -top-3 -right-3 z-20"><LiveBadge label="Validating" /></div>
      <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 px-4 py-3 bg-white/3 border-b border-white/6">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/5 border border-white/8 px-3 py-0.5 text-[10px] text-white/30">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CRM → Assumption Validation
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-5 space-y-3">
          {/* Decision */}
          <div className="rounded-xl border border-white/8 bg-white/3 p-3">
            <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Decision</p>
            <p className="text-xs font-semibold text-white/75">Expand into EMEA Q1 2026</p>
          </div>
          {/* Assumptions being validated */}
          {[
            { text: "EMEA TAM > $50M", source: "Salesforce", result: "Validated — $63.2M per CRM data" },
            { text: "Enterprise buyer in DACH", source: "HubSpot", result: "47 qualified leads matched" },
            { text: "No active contract conflicts", source: "Pipedrive", result: "0 conflicts found in pipeline" },
          ].map((a, i) => (
            <motion.div key={i}
              className={`rounded-xl border p-3 transition-all ${validated > i ? "border-emerald-500/20 bg-emerald-500/4" : "border-white/6 bg-white/2"}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-[10px] text-white/55 flex-1">{a.text}</span>
                {validated > i
                  ? <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full flex-shrink-0">✓ {a.source}</span>
                  : <span className="text-[8px] font-bold text-white/20 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded-full flex-shrink-0">Checking…</span>
                }
              </div>
              {validated > i && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-emerald-400/60">{a.result}</motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Integration categories section */
function IntegrationCategoriesSection() {
  const [activeTab, setActiveTab] = useState("api");
  const tab = tabs.find(t => t.id === activeTab)!;

  const contentMap: Record<string, {
    title: string; desc: string; features: string[];
    visual: "api-code" | "webhook" | "crm" | "agent-code";
  }> = {
    api: {
      title: "API-First Architecture",
      desc: "Every StemmQ capability is available via REST API. Create decisions, query assumptions, trigger simulations, and manage agents programmatically.",
      features: ["Full REST API with OpenAPI 3.0 spec", "Rate limiting with burst support", "JWT + API key authentication", "Sandbox environment included", "SDKs for Node.js, Python, Go, Ruby"],
      visual: "api-code",
    },
    webhooks: {
      title: "Real-Time Webhook Events",
      desc: "Subscribe to any StemmQ event and trigger your own workflows. Every decision lifecycle event fires a signed, HMAC-verified webhook payload.",
      features: ["HMAC-SHA256 signed payloads", "Retry logic with exponential backoff", "Event filtering by type and risk level", "Webhook delivery logs in dashboard", "Batch delivery for high-volume events"],
      visual: "webhook",
    },
    crm: {
      title: "CRM Validation Layer",
      desc: "Cross-reference strategic decisions against real customer data. Connect your CRM to validate assumptions with ground truth — automatically.",
      features: ["Salesforce, HubSpot, Pipedrive support", "Automated assumption validation against CRM data", "Decision-to-customer outcome mapping", "Revenue impact attribution", "Bi-directional sync on decision outcomes"],
      visual: "crm",
    },
    agents: {
      title: "External Agent Gateway",
      desc: "Connect any third-party AI agent — GPT, Claude, custom models — to StemmQ's Decision Gate. All external actions become governed decision objects.",
      features: ["Webhook receiver for agent actions", "Passive observation mode (detect + convert)", "SDKs for Node.js, Python, Go, Ruby", "OpenAI and Anthropic function calling", "Full audit trail for every agent action"],
      visual: "agent-code",
    },
  };

  const content = contentMap[activeTab];

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-4">
            Integration Types
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Every connection goes through the{" "}
            <span style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Decision Gate
            </span>
          </h2>
        </Reveal>

        {/* Tab bar */}
        <Reveal delay={0.1} className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <motion.button key={t.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(t.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all"
                style={{
                  borderColor: isActive ? `${t.color}50` : "var(--border)",
                  background: isActive ? `${t.color}12` : "var(--muted)/30",
                  color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                }}
              >
                <Icon className="h-4 w-4" style={{ color: isActive ? t.color : "var(--muted-foreground)" }} />
                {t.label}
              </motion.button>
            );
          })}
        </Reveal>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center"
          >
            {/* Text */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${tab.color}15`, border: `1px solid ${tab.color}25` }}>
                  <tab.icon className="h-4.5 w-4.5" style={{ color: tab.color }} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: tab.color }}>{tab.label}</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-4">{content.title}</h3>
              <p className="text-sm sm:text-base text-foreground/50 leading-relaxed mb-6">{content.desc}</p>
              <ul className="space-y-3 mb-8">
                {content.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                      style={{ background: `${tab.color}15`, border: `1px solid ${tab.color}25` }}>
                      <CheckCircle2 className="h-3 w-3" style={{ color: tab.color }} />
                    </div>
                    <span className="text-xs sm:text-sm text-foreground/55">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CRM logos */}
              {activeTab === "crm" && (
                <div className="flex flex-wrap gap-2">
                  {crmIntegrations.map(c => (
                    <span key={c.name} className="text-xs px-3 py-1.5 rounded-xl border font-semibold"
                      style={{ color: c.color, background: `${c.color}10`, borderColor: `${c.color}25` }}>
                      {c.name}
                    </span>
                  ))}
                </div>
              )}

              <Link href={ROUTES.auth}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: `${tab.color}18`, border: `1px solid ${tab.color}30`, color: "rgba(255,255,255,0.8)" }}>
                  Get started <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </div>

            {/* Visual */}
            <div>
              {content.visual === "api-code" && <CodeBlock code={API_CODE} lang="http" title="POST /v1/decisions" />}
              {content.visual === "webhook" && <WebhookEventsPanel />}
              {content.visual === "crm" && <CRMVisual />}
              {content.visual === "agent-code" && <CodeBlock code={AGENT_CODE} lang="http" title="POST /v1/external-agent/decision" />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   EXTERNAL AGENT FLOW — animated pipeline
═══════════════════════════════════════════════════ */

function ExternalAgentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => { setActive(i); i++; if (i > 4) clearInterval(t); }, 550);
    return () => clearInterval(t);
  }, [inView]);

  const nodes = [
    { label: "External Agent", sub: "GPT-4, Claude, Custom", color: "#a855f7", icon: Bot },
    { label: "Decision Object", sub: "SDO auto-created", color: "#6366f1", icon: FileText },
    { label: "Decision Gate", sub: "Risk eval + approval", color: "#f59e0b", icon: Shield },
    { label: "Execution", sub: "Only if approved", color: "#10b981", icon: Zap },
    { label: "Audit Trail", sub: "Immutable log", color: "#06b6d4", icon: Lock },
  ];

  return (
    <section className="py-16 sm:py-20 bg-muted/20 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-medium text-violet-300 mb-4">
            External Agents
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Any agent.{" "}
            <span style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              One Decision Gate.
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            Whether you're running GPT-4, Claude, a custom model, or a third-party AI platform —
            all actions route through StemmQ's Decision Gate before execution.
          </p>
        </Reveal>

        <div ref={ref}>
          {/* Desktop */}
          <div className="hidden md:flex items-center justify-center gap-1 max-w-5xl mx-auto mb-8">
            {nodes.map((node, i) => {
              const Icon = node.icon;
              const done = active >= i;
              const isGate = node.label === "Decision Gate";
              return (
                <div key={node.label} className="flex items-center gap-1 flex-1">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={done ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="flex-1 flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border text-center transition-all"
                    style={{
                      borderColor: done ? (isGate ? `${node.color}60` : `${node.color}30`) : "var(--border)",
                      background: done ? (isGate ? `${node.color}14` : `${node.color}07`) : "var(--card)",
                      boxShadow: done && isGate ? `0 0 40px ${node.color}15` : "none",
                    }}
                  >
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                      style={{ background: done ? `${node.color}20` : "var(--muted)" }}>
                      <Icon className="h-5 w-5" style={{ color: done ? node.color : "var(--muted-foreground)" }} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider leading-tight"
                      style={{ color: done ? "var(--foreground)" : "var(--muted-foreground)" }}>
                      {node.label}
                    </p>
                    <p className="text-[8px]" style={{ color: done ? "var(--muted-foreground)" : "var(--muted-foreground)" }}>{node.sub}</p>
                    {done && <div className="h-1.5 w-1.5 rounded-full" style={{ background: node.color }} />}
                  </motion.div>
                  {i < nodes.length - 1 && (
                    <motion.div animate={{ opacity: active > i ? 1 : 0.08 }} className="h-px w-5 flex-shrink-0"
                      style={{ background: active > i ? `linear-gradient(90deg,${node.color}80,${nodes[i+1].color}80)` : "var(--border)" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile */}
          <div className="md:hidden grid grid-cols-2 gap-2.5 mb-6 max-w-sm mx-auto">
            {nodes.map((node, i) => {
              const Icon = node.icon;
              const done = active >= i;
              return (
                <motion.div key={node.label}
                  initial={{ opacity: 0, y: 16 }} animate={done ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4 }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center ${node.label === "Decision Gate" ? "col-span-2" : ""}`}
                  style={{ borderColor: done ? `${node.color}30` : "var(--border)", background: done ? `${node.color}06` : "var(--card)" }}>
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ background: done ? `${node.color}18` : "var(--muted)" }}>
                    <Icon className="h-4 w-4" style={{ color: done ? node.color : "var(--muted-foreground)" }} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: done ? "var(--foreground)" : "var(--muted-foreground)" }}>
                    {node.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Connect tip */}
        <Reveal delay={0.3} className="text-center">
          <div className="inline-flex items-center gap-2.5 rounded-2xl border border-violet-500/20 bg-violet-500/5 px-5 py-3">
            <Terminal className="h-4 w-4 text-violet-400 flex-shrink-0" />
            <p className="text-xs text-foreground/55">
              Connect via{" "}
              <code className="text-violet-300 font-mono">POST /v1/external-agent/decision</code>
              {" "}or passive observation mode — zero agent changes required
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   INTEGRATION ECOSYSTEM GRID
═══════════════════════════════════════════════════ */

function EcosystemSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-4">
            Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Works with the tools{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              you already use
            </span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            {integrationLogos.length}+ integrations and growing. Can't find yours? Use our REST API or submit a request.
          </p>
        </Reveal>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {integrationLogos.map((logo, i) => (
            <Reveal key={logo.name} delay={i * 0.03}>
              <motion.div
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -4, scale: 1.04 }}
                className="flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-xl border cursor-default transition-all"
                style={{
                  borderColor: hovered === i ? `${logo.color}35` : "var(--border)",
                  background: hovered === i ? `${logo.color}08` : "var(--card)",
                }}
              >
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl flex items-center justify-center text-[9px] sm:text-[10px] font-bold"
                  style={{ background: `${logo.color}15`, border: `1px solid ${logo.color}20`, color: hovered === i ? logo.color : "var(--muted-foreground)" }}>
                  {logo.abbr}
                </div>
                <span className="text-[8px] sm:text-[9px] text-muted-foreground text-center leading-tight">{logo.name}</span>
              </motion.div>
            </Reveal>
          ))}

          {/* Request more */}
          <Reveal delay={integrationLogos.length * 0.03}>
            <motion.div whileHover={{ y: -4, scale: 1.04 }}
              className="flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-xl border border-dashed border-border/40 bg-muted/20 cursor-pointer hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-muted/50 flex items-center justify-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-[8px] sm:text-[9px] text-muted-foreground text-center">Request</span>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <IntegrationsHero />
      <IntelligenceLayerSection />
      <IntegrationCategoriesSection />
      <ExternalAgentSection />
      <EcosystemSection />
      <EnterpriseSection />
      <CTASection />
      <MarketingFooter />
    </div>
  );
}