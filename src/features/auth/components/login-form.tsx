'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/* Google "G" SVG — keeps colours correct in both light and dark mode */
function GoogleIcon() {
  return (
    <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

/* Divider — "or continue with email" */
function OrDivider({ label }: { label: string }) {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-3 text-[11px] font-medium text-muted-foreground bg-card uppercase tracking-wider">
          {label}
        </span>
      </div>
    </div>
  )
}

export function LoginForm() {
  const [sent, setSent] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema as any) })

  const onSubmit = async ({ email }: LoginInput) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    })
    if (error) { toast.error(error.message); return }
    setSent(true)
  }

  const handleGoogle = async () => {
    setOauthLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback?redirect=${encodeURIComponent(redirect)}`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (error) { toast.error(error.message); setOauthLoading(false) }
  }

  /* ── Success state ─────────────────────────────────────────────────────── */
  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-6 h-6 text-success" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2 tracking-tight">
          Check your email
        </h2>
        <p className="text-muted-foreground text-sm mb-1.5">
          Magic link sent to{' '}
          <strong className="text-foreground font-semibold">
            {getValues('email')}
          </strong>
        </p>
        <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
          Click the link in the email to sign in. It expires in 1 hour.
          <br />
          Check your spam folder if you don't see it.
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setSent(false)}
        >
          Try a different email
        </Button>
      </motion.div>
    )
  }

  /* ── Main form ─────────────────────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Heading */}
      <div className="mb-7">
        <h2 className="font-display text-[1.7rem] font-bold tracking-tight mb-1.5">
          Welcome back
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Sign in to your StemmQ workspace.
        </p>
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={oauthLoading}
        className="w-full h-11 flex items-center justify-center gap-2.5 rounded-[10px] border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-all duration-150 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {oauthLoading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <GoogleIcon />}
        Continue with Google
      </button>

      <OrDivider label="or continue with email" />

      {/* Magic link form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          type="email"
          label="Email address"
          placeholder="you@company.com"
          autoComplete="email"
          autoFocus
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          className="w-full h-11"
          loading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Send magic link
        </Button>
      </form>

      {/* Sign up link */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        No account?{' '}
        <Link
          href="/signup"
          className="text-brand-600 dark:text-brand-400 font-semibold hover:underline underline-offset-4"
        >
          Create workspace
        </Link>
      </p>

      {/* Legal */}
      <p className="text-center text-[11px] text-muted-foreground/70 mt-4 leading-relaxed">
        By signing in you agree to our{' '}
        <Link href="/terms" className="hover:text-muted-foreground underline underline-offset-2">
          Terms
        </Link>
        {' '}and{' '}
        <Link href="/privacy" className="hover:text-muted-foreground underline underline-offset-2">
          Privacy Policy
        </Link>
      </p>
    </motion.div>
  )
}
