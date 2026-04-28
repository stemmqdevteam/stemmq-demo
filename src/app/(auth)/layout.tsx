import Link from 'next/link'
import { Zap, ShieldCheck, Users, TrendingUp } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left — Brand panel (desktop only) ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[440px] xl:w-[500px] flex-col flex-shrink-0 relative overflow-hidden bg-brand-600">

        {/* Layered background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,60,255,0.35),transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-500/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/3 -left-20 w-56 h-56 bg-brand-700/40 rounded-full blur-2xl" />

        {/* Subtle dot-grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-[10px] bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/25 transition-colors">
              <Zap className="w-4.5 h-4.5 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              StemmQ
            </span>
          </Link>

          {/* Hero copy */}
          <div className="flex-1 flex flex-col justify-center mt-12">
            <p className="text-brand-200 text-[11px] font-bold uppercase tracking-[0.15em] mb-4">
              Decision Intelligence
            </p>
            <h2 className="font-display font-bold text-[2rem] xl:text-[2.4rem] leading-[1.18] text-white mb-5">
              Build smarter organizations with structured decision-making
            </h2>
            <p className="text-brand-100/80 leading-relaxed text-[0.9rem] mb-10 max-w-sm">
              Track every assumption. Measure every outcome. Build the institutional
              memory that compounds over time.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Users,       value: '500+',   label: 'Teams using StemmQ' },
                { icon: TrendingUp,  value: '87%',    label: 'Avg assumption accuracy' },
                { icon: ShieldCheck, value: '50k+',   label: 'Decisions tracked' },
                { icon: Zap,         value: '78 DQS', label: 'Avg quality score' },
              ].map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-3.5 h-3.5 text-brand-200" />
                  </div>
                  <p className="font-display font-bold text-2xl text-white leading-none mb-1">
                    {value}
                  </p>
                  <p className="text-brand-200/80 text-[11px] leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-brand-300/70 text-xs">
              © {new Date().getFullYear()} StemmQ ·{' '}
              <Link href="/privacy" className="hover:text-white/90 transition-colors">
                Privacy
              </Link>{' '}
              ·{' '}
              <Link href="/terms" className="hover:text-white/90 transition-colors">
                Terms
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Right — Form area ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen bg-background">

        {/* Mobile logo bar */}
        <div className="flex lg:hidden items-center justify-between px-5 py-4 border-b border-border bg-background">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-brand-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-[15px] tracking-tight">
              StemmQ
            </span>
          </Link>
        </div>

        {/* Centered card */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-[420px]">

            {/* Card */}
            <div className="bg-card rounded-2xl border border-border shadow-lg px-7 py-8 sm:px-8 sm:py-9">
              {children}
            </div>

            {/* Below-card security note */}
            <p className="mt-4 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              Secured with 256-bit TLS encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
