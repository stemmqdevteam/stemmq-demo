import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ── Class merge ───────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Date ──────────────────────────────────────────────────
export function formatDate(
  date: string | Date,
  opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
) {
  return new Intl.DateTimeFormat('en-US', opts).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w ago`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`
  return formatDate(date)
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// ── Number ────────────────────────────────────────────────
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// ── String ────────────────────────────────────────────────
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateOrgSlug(name: string): string {
  return slugify(name) + '-' + Math.random().toString(36).slice(2, 6)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// ── Score colours ─────────────────────────────────────────
export function scoreTextColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  if (score >= 40) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

export function scoreBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-950/40'
  if (score >= 60) return 'bg-amber-50 dark:bg-amber-950/40'
  if (score >= 40) return 'bg-orange-50 dark:bg-orange-950/40'
  return 'bg-red-50 dark:bg-red-950/40'
}

// ── Intent / Status colour maps ───────────────────────────
export function intentBadgeClass(intent: string): string {
  const map: Record<string, string> = {
    growth: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    efficiency: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
    risk: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    experiment: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
    other: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
  }
  return map[intent] ?? (map['other'] as string)
}

export function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    draft: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
    active: 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300',
    resolved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    archived: 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-500',
  }
  return map[status] ?? (map['draft'] as string)
}

export function assumptionStatusClass(status: string): string {
  const map: Record<string, string> = {
    unknown: 'bg-surface-100 text-surface-500 dark:bg-surface-800',
    correct: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    incorrect: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    partially_correct:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  }
  return map[status] ?? (map['unknown'] as string)
}

// ── Misc ──────────────────────────────────────────────────
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function isServer(): boolean {
  return typeof window === 'undefined'
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

// ── URL helpers ───────────────────────────────────────────
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const query = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') query.set(k, String(v))
  }
  const qs = query.toString()
  return qs ? `?${qs}` : ''
}
