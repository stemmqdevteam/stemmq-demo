import type { Metadata } from 'next'
import { AuthError } from '@/features/auth/components/auth-error'

export const metadata: Metadata = { title: 'Authentication Error' }

export default function ErrorPage() {
  return <AuthError />
}
