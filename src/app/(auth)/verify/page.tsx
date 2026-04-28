import type { Metadata } from 'next'
import { VerifyEmail } from '@/features/auth/components/verify-email'

export const metadata: Metadata = { title: 'Check Your Email' }

export default function VerifyPage() {
  return <VerifyEmail />
}
