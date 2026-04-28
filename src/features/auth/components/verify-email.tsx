'use client'

import Link from 'next/link'
import { Mail, Zap } from 'lucide-react'
import { buttonClass } from '@/components/ui/button'

export function VerifyEmail() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center gap-2 justify-center mb-10">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-display font-bold text-xl">StemmQ</span>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-accent-50 dark:bg-accent-950/30 flex items-center justify-center mx-auto mb-5">
          <Mail className="w-6 h-6 text-accent-600" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">Check your inbox</h2>
        <p className="text-muted-foreground text-sm mb-8">
          We sent you a magic link. Click it to sign in — it expires in 10 minutes.
        </p>
        <Link href="/login" className={buttonClass({ variant: 'ghost', className: 'w-full' })}>
          Back to login
        </Link>
      </div>
    </div>
  )
}
