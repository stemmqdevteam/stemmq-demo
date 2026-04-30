'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import {
  Building2, Globe, Users, Compass, Target,
  ArrowRight, ArrowLeft, Check, Zap,
  GitBranch, Sparkles, ChevronRight,
} from 'lucide-react'
import { completeOnboarding } from '@/features/onboarding/actions'
import { cn } from '@/lib/utils'

/* ── Types ─────────────────────────────────────────────── */
interface Props {
  defaultOrgName: string
  postRedirect:   string
}

type StepId = 'welcome' | 'workspace' | 'industry' | 'team' | 'style' | 'risk' | 'success'

/* ── Option data ────────────────────────────────────────── */
const INDUSTRIES = [
  { value: 'technology',  label: 'Technology',   emoji: '💻' },
  { value: 'finance',     label: 'Finance',       emoji: '💰' },
  { value: 'healthcare',  label: 'Healthcare',    emoji: '🏥' },
  { value: 'ecommerce',   label: 'E-Commerce',    emoji: '🛒' },
  { value: 'education',   label: 'Education',     emoji: '📚' },
  { value: 'media',       label: 'Media',         emoji: '📱' },
  { value: 'consulting',  label: 'Consulting',    emoji: '🤝' },
  { value: 'real_estate', label: 'Real Estate',   emoji: '🏢' },
  { value: 'manufacturing',label:'Manufacturing', emoji: '⚙️' },
  { value: 'other',       label: 'Other',         emoji: '✨' },
]

const TEAM_SIZES = [
  { value: 'solo',    label: 'Just me',       sub: 'Solo founder or individual', icon: '👤' },
  { value: 'small',   label: '2–10',          sub: 'Small team',                 icon: '👥' },
  { value: 'medium',  label: '11–50',         sub: 'Growing team',               icon: '🏢' },
  { value: 'large',   label: '51–200',        sub: 'Mid-size company',           icon: '🏬' },
  { value: 'enterprise', label: '200+',       sub: 'Enterprise',                 icon: '🌐' },
]

const STAGES = [
  { value: 'idea',     label: 'Idea stage',     sub: 'Exploring the concept' },
  { value: 'early',    label: 'Early stage',    sub: 'Building the product' },
  { value: 'growth',   label: 'Growth stage',   sub: 'Scaling operations' },
  { value: 'mature',   label: 'Mature',         sub: 'Established business' },
]

const CULTURES = [
  { value: 'data_driven',  label: 'Data-driven',   sub: 'Numbers and metrics first', emoji: '📊' },
  { value: 'consensus',    label: 'Consensus',     sub: 'Team alignment matters',    emoji: '🤝' },
  { value: 'top_down',     label: 'Top-down',      sub: 'Leadership decides',        emoji: '⬇️' },
  { value: 'experimental', label: 'Experimental',  sub: 'Test and learn fast',       emoji: '🧪' },
]

const RISK_PROFILES = [
  { value: 'conservative', label: 'Conservative', sub: 'Minimize risk, protect value',         color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' },
  { value: 'moderate',     label: 'Moderate',     sub: 'Balance risk and reward',               color: 'text-brand-600 dark:text-brand-400',    bg: 'bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800' },
  { value: 'aggressive',   label: 'Aggressive',   sub: 'Maximize upside, accept volatility',    color: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' },
]

/* ── Step definitions ────────────────────────────────────── */
const STEPS: { id: StepId; label: string }[] = [
  { id: 'workspace', label: 'Workspace'  },
  { id: 'industry',  label: 'Industry'   },
  { id: 'team',      label: 'Team'       },
  { id: 'style',     label: 'Style'      },
  { id: 'risk',      label: 'Risk'       },
]

/* ── Transition variants ─────────────────────────────────── */
const slideVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 40 : -40,
  }),

  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.28,
      ease: "easeOut", // ✅ now works without `as const`
    },
  },

  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -40 : 40,
    transition: {
      duration: 0.18,
    },
  }),
};

/* ── Option card ─────────────────────────────────────────── */
function OptionCard({ selected, onClick, children, className }: {
  selected: boolean; onClick: () => void; children: React.ReactNode; className?: string
}) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 w-full',
        selected
          ? 'border-[var(--accent)] bg-[var(--accent-muted)] dark:bg-[var(--accent-muted)]'
          : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/40 hover:bg-[var(--muted)]',
        className
      )}>
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
          <Check className="w-3 h-3 text-white" />
        </span>
      )}
      {children}
    </button>
  )
}

/* ── Progress bar ────────────────────────────────────────── */
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current + 1) / total) * 100
  return (
    <div className="w-full h-1 bg-[var(--muted)] rounded-full overflow-hidden">
      <motion.div className="h-full bg-[var(--accent)] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   STEP SCREENS
══════════════════════════════════════════════════════════ */

/* Welcome */
function WelcomeStep({ onNext, orgName }: { onNext: () => void; orgName: string }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8 max-w-md mx-auto">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-20 h-20 rounded-3xl bg-[var(--accent)] flex items-center justify-center mb-8 shadow-brand animate-pulse-ring">
        <Zap className="w-9 h-9 text-white" fill="white" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold mb-3 leading-tight">
          Welcome to StemmQ{orgName ? `, ${orgName.split(' ')[0]}` : ''}
        </h1>
        <p className="text-[var(--muted-foreground)] text-base leading-relaxed mb-8 max-w-sm mx-auto">
          You're about to set up your decision intelligence workspace. This takes under 2 minutes and helps us personalize your experience.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}
        className="space-y-3 w-full max-w-xs mb-8">
        {[
          { icon: GitBranch, label: 'Structured decision tracking' },
          { icon: Sparkles,  label: 'AI-powered assumption generation' },
          { icon: Target,    label: 'Quality scores that improve over time' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
            <span className="w-7 h-7 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center flex-shrink-0">
              <Icon className="w-3.5 h-3.5 text-[var(--accent)]" />
            </span>
            {label}
          </div>
        ))}
      </motion.div>

      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
        onClick={onNext}
        className="w-full max-w-xs flex items-center justify-center gap-2 bg-[var(--accent)] hover:opacity-90 text-white font-semibold py-3.5 px-6 rounded-xl transition-all text-sm shadow-brand">
        Get started <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  )
}

/* Workspace name */
function WorkspaceStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold mb-1">Name your workspace</h2>
        <p className="text-sm text-[var(--muted-foreground)]">This is how your organization appears in StemmQ.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Workspace name</label>
        <div className="relative">
          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Acme Corp, My Startup"
            autoFocus
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all text-sm"
          />
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-2">You can change this anytime in Settings → Organization.</p>
      </div>
    </div>
  )
}

/* Industry */
function IndustryStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold mb-1">What industry are you in?</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Helps us tailor AI suggestions for your context.</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {INDUSTRIES.map((ind) => (
          <OptionCard key={ind.value} selected={value === ind.value} onClick={() => onChange(ind.value)}>
            <span className="text-xl">{ind.emoji}</span>
            <span className="text-sm font-medium text-[var(--foreground)]">{ind.label}</span>
          </OptionCard>
        ))}
      </div>
    </div>
  )
}

/* Team size + stage */
function TeamStep({ size, stage, onSize, onStage }: {
  size: string; stage: string; onSize: (v: string) => void; onStage: (v: string) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold mb-1">Tell us about your team</h2>
        <p className="text-sm text-[var(--muted-foreground)]">We'll calibrate collaboration features accordingly.</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)] mb-3">Team size</p>
        <div className="space-y-2">
          {TEAM_SIZES.map((s) => (
            <OptionCard key={s.value} selected={size === s.value} onClick={() => onSize(s.value)}>
              <span className="text-lg">{s.icon}</span>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{s.label}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{s.sub}</p>
              </div>
            </OptionCard>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)] mb-3">Company stage</p>
        <div className="grid grid-cols-2 gap-2">
          {STAGES.map((s) => (
            <OptionCard key={s.value} selected={stage === s.value} onClick={() => onStage(s.value)}>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{s.label}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{s.sub}</p>
              </div>
            </OptionCard>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Decision culture */
function StyleStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold mb-1">How does your team make decisions?</h2>
        <p className="text-sm text-[var(--muted-foreground)]">This shapes how we present insights and recommendations.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {CULTURES.map((c) => (
          <OptionCard key={c.value} selected={value === c.value} onClick={() => onChange(c.value)}>
            <div>
              <div className="text-2xl mb-2">{c.emoji}</div>
              <p className="text-sm font-semibold text-[var(--foreground)] mb-0.5">{c.label}</p>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{c.sub}</p>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  )
}

/* Risk profile */
function RiskStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold mb-1">What's your risk tolerance?</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Used to calibrate AI recommendations and scenario modeling.</p>
      </div>
      <div className="space-y-3">
        {RISK_PROFILES.map((r) => (
          <OptionCard key={r.value} selected={value === r.value} onClick={() => onChange(r.value)}
            className={value === r.value ? r.bg : ''}>
            <div className="flex-1">
              <p className={cn('text-sm font-bold mb-0.5', r.color)}>{r.label}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{r.sub}</p>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  )
}

/* Success */
function SuccessStep({ orgName }: { orgName: string }) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-6">
      {/* Animated checkmark */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-[var(--success)]/10 border-2 border-[var(--success)] flex items-center justify-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}>
            <Check className="w-10 h-10 text-[var(--success)]" />
          </motion.div>
        </div>
        {/* Orbiting dots */}
        {[0, 1, 2].map((i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}
            className="absolute w-2.5 h-2.5 rounded-full bg-[var(--accent)]"
            style={{
              top:  `${50 + 45 * Math.sin((i * 2 * Math.PI) / 3)}%`,
              left: `${50 + 45 * Math.cos((i * 2 * Math.PI) / 3)}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <p className="text-xs font-bold text-[var(--success)] uppercase tracking-widest mb-2">Setup complete</p>
        <h2 className="font-display text-2xl font-bold mb-2">
          {orgName ? `${orgName} is ready` : 'Your workspace is ready'}
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-8 max-w-xs mx-auto leading-relaxed">
          Your decision intelligence workspace is configured. Let's start making better decisions together.
        </p>
      </motion.div>

      {/* Feature cards */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8">
        {[
          { icon: GitBranch, label: 'Create a decision',     href: '/dashboard/decisions/new', color: 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400' },
          { icon: Users,     label: 'Invite your team',      href: '/dashboard/settings/members', color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400' },
          { icon: Compass,   label: 'Explore dashboard',     href: '/dashboard', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' },
        ].map(({ icon: Icon, label, href, color }) => (
          <a key={href} href={href}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] transition-all group">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', color)}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-center leading-tight text-[var(--foreground)]">{label}</span>
          </a>
        ))}
      </motion.div>

      <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        href="/dashboard"
        className="w-full max-w-xs flex items-center justify-center gap-2 bg-[var(--accent)] hover:opacity-90 text-white font-semibold py-3.5 px-6 rounded-xl transition-all text-sm shadow-brand">
        Go to dashboard <ArrowRight className="w-4 h-4" />
      </motion.a>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN WIZARD
══════════════════════════════════════════════════════════ */
export function OnboardingWizard({ defaultOrgName, postRedirect }: Props) {
  const [step, setStep]               = useState<StepId>('welcome')
  const [dir, setDir]                 = useState(1)
  const [isPending, startTransition]  = useTransition()
  const [error, setError]             = useState<string | null>(null)

  // Form state
  const [orgName,   setOrgName]   = useState(defaultOrgName)
  const [industry,  setIndustry]  = useState('')
  const [teamSize,  setTeamSize]  = useState('')
  const [stage,     setStage]     = useState('')
  const [culture,   setCulture]   = useState('')
  const [risk,      setRisk]      = useState('moderate')

  const stepOrder: StepId[] = ['welcome', 'workspace', 'industry', 'team', 'style', 'risk', 'success']
  const stepIdx = stepOrder.indexOf(step)

  // Steps for progress bar (exclude welcome and success)
  const progressSteps = STEPS
  const progressIdx   = progressSteps.findIndex((s) => s.id === step)

  const go = (next: StepId, direction = 1) => {
    setDir(direction)
    setStep(next)
    setError(null)
  }

  const next = () => {
    if (step === 'welcome')    return go('workspace')
    if (step === 'workspace') {
      if (!orgName.trim()) { setError('Please enter your workspace name.'); return }
      return go('industry')
    }
    if (step === 'industry')  return go('team')
    if (step === 'team')      return go('style')
    if (step === 'style')     return go('risk')
    if (step === 'risk')      return submit()
  }

  const back = () => {
    if (step === 'workspace') return go('welcome', -1)
    if (step === 'industry')  return go('workspace', -1)
    if (step === 'team')      return go('industry', -1)
    if (step === 'style')     return go('team', -1)
    if (step === 'risk')      return go('style', -1)
  }

  const submit = () => {
    setError(null)
    startTransition(async () => {
      const fd = new FormData()
      fd.append('org_name',         orgName.trim() || 'My Organization')
      fd.append('industry',         industry)
      fd.append('size',             teamSize)
      fd.append('stage',            stage)
      fd.append('decision_culture', culture)
      fd.append('risk_profile',     risk)
      fd.append('post_redirect',    postRedirect)

      const result = await completeOnboarding(fd)
      if (result?.success === false) {
        setError(result.error ?? 'Something went wrong. Please try again.')
      } else {
        go('success')
      }
    })
  }

  const canNext = () => {
    if (step === 'workspace') return orgName.trim().length > 0
    return true
  }

  const isConfigStep = !['welcome', 'success'].includes(step)

  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-4 gradient-mesh bg-[var(--background)]">
      <div className="w-full max-w-lg">

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-elevated overflow-hidden"
          style={{ boxShadow: 'var(--shadow-xl)' }}
        >
          {/* Header */}
          {isConfigStep && (
            <div className="px-6 pt-6 pb-0">
              {/* Logo + step count */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-white" fill="white" />
                  </div>
                  <span className="font-display font-bold text-sm text-[var(--foreground)]">StemmQ</span>
                </div>
                <span className="text-xs text-[var(--muted-foreground)] font-medium">
                  Step {progressIdx + 1} of {progressSteps.length}
                </span>
              </div>

              {/* Progress bar */}
              <ProgressBar current={progressIdx} total={progressSteps.length} />

              {/* Step labels */}
              <div className="flex items-center justify-between mt-2 mb-5">
                {progressSteps.map((s, i) => (
                  <div key={s.id} className="flex flex-col items-center gap-1">
                    <div className={cn(
                      'w-1.5 h-1.5 rounded-full transition-all',
                      i < progressIdx  ? 'bg-[var(--accent)]' :
                      i === progressIdx ? 'bg-[var(--accent)] scale-125' :
                                         'bg-[var(--border)]'
                    )} />
                    <span className={cn('text-[9px] uppercase tracking-wider font-semibold hidden sm:block',
                      i <= progressIdx ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                    )}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step content */}
          <div className={cn('overflow-hidden', isConfigStep ? 'px-6 pb-6' : '')}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={step} custom={dir}
                variants={slideVariants} initial="enter" animate="center" exit="exit">
                {step === 'welcome'   && <WelcomeStep   onNext={next} orgName={orgName} />}
                {step === 'workspace' && <WorkspaceStep value={orgName} onChange={setOrgName} />}
                {step === 'industry'  && <IndustryStep  value={industry} onChange={setIndustry} />}
                {step === 'team'      && <TeamStep size={teamSize} stage={stage} onSize={setTeamSize} onStage={setStage} />}
                {step === 'style'     && <StyleStep  value={culture} onChange={setCulture} />}
                {step === 'risk'      && <RiskStep   value={risk}    onChange={setRisk} />}
                {step === 'success'   && <SuccessStep orgName={orgName} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer nav — config steps only */}
          {isConfigStep && (
            <div className="px-6 pb-6 pt-2 border-t border-[var(--border)] flex items-center justify-between gap-3">
              <button type="button" onClick={back}
                className="flex items-center gap-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-3 py-2 rounded-xl hover:bg-[var(--muted)]">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="flex-1">
                {error && <p className="text-xs text-[var(--danger)] text-center">{error}</p>}
              </div>

              <button type="button" onClick={next} disabled={isPending || !canNext()}
                className={cn(
                  'flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all',
                  step === 'risk'
                    ? 'bg-[var(--accent)] text-white hover:opacity-90 shadow-brand disabled:opacity-50'
                    : 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-40',
                  !canNext() && 'opacity-40 cursor-not-allowed'
                )}>
                {isPending ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                ) : step === 'risk' ? (
                  <>Complete setup <Check className="w-4 h-4" /></>
                ) : (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Bottom note */}
        {step === 'welcome' && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-center text-xs text-[var(--muted-foreground)] mt-4">
            By continuing, you agree to our{' '}
            <a href="/terms"   className="hover:text-[var(--accent)] transition-colors underline-offset-2 hover:underline">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="hover:text-[var(--accent)] transition-colors underline-offset-2 hover:underline">Privacy Policy</a>
          </motion.p>
        )}

      </div>
    </div>
  )
}
