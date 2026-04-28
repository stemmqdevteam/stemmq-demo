import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/providers'
import "./globals.css";


/* ── Fonts ──────────────────────────────────────────────── */
const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

/* ── Metadata ───────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: 'StemmQ',
    template: '%s · StemmQ',
  },
  description:
    'Decision Intelligence Infrastructure for forward-thinking organizations. Make smarter decisions with structured reasoning, assumption tracking, and AI-powered insights.',
  keywords: [
    'decision intelligence',
    'decision making',
    'strategy',
    'assumption tracking',
    'business intelligence',
    'DQS',
  ],
  authors: [{ name: 'StemmQ' }],
  creator: 'StemmQ',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://stemmq.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stemmq.com',
    title: 'StemmQ — Decision Intelligence Infrastructure',
    description:
      'Make smarter decisions with structured reasoning and AI-powered insights.',
    siteName: 'StemmQ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StemmQ',
    description: 'Decision Intelligence Infrastructure',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafbfc' },
    { media: '(prefers-color-scheme: dark)',  color: '#030712' },
  ],
  width: 'device-width', initialScale: 1,
}

/* ── Root Layout ────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/*
          Inline script: runs synchronously before React hydrates.
          Reads theme from localStorage and applies 'dark' class immediately
          to prevent white flash on dark mode preference.
          This is the industry-standard approach used by next-themes, Radix, etc.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=JSON.parse(localStorage.getItem('stemmq:ui')||'{}');var t=s.state?.theme||'system';if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();(function(){requestAnimationFrame(function(){document.documentElement.setAttribute('data-theme-ready','1')})})()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'var(--font-body)', borderRadius: '12px' },
          }}
        />
      </body>
    </html>
  )
}
