'use client'

import Link from 'next/link'
import { AlertCircle, Zap } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { buttonClass } from '@/components/ui/button'

export function AuthError() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') ?? 'An unexpected error occurred.'

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center gap-2 justify-center mb-10">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-display font-bold text-xl">StemmQ</span>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">Authentication failed</h2>
        <p className="text-muted-foreground text-sm mb-2">{message}</p>
        <p className="text-muted-foreground/70 text-xs mb-8">The link may have expired or already been used.</p>
        <div className="flex flex-col gap-3">
          <Link href="/login" className={buttonClass({ variant: 'primary', className: 'w-full' })}>
            Try again
          </Link>
          <Link href="/" className={buttonClass({ variant: 'ghost', className: 'w-full' })}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

