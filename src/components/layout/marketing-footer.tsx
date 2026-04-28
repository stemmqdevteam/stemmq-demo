"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Brain, CheckCircle2 } from "lucide-react";
import { FOOTER_LINKS } from "@/lib/constants";

/* ═══════════════════════════════════════════════════
   SOCIAL ICONS (inline SVGs — real brand shapes)
═══════════════════════════════════════════════════ */

const socials = [
  {
    label: "X (Twitter)",
    href: "https://x.com/stemmq",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/stemmq",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/stemmq",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@stemmq",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

/* ═══════════════════════════════════════════════════
   FOOTER LINK COLUMN
═══════════════════════════════════════════════════ */

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3.5">{title}</p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-foreground/55 hover:text-foreground transition-colors leading-none"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   NEWSLETTER
═══════════════════════════════════════════════════ */

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-foreground mb-1">Stay up to date</p>
      <p className="text-xs text-muted-foreground mb-3.5 leading-relaxed">
        Decision intelligence insights, product updates, and more.
      </p>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            You're subscribed!
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-1 min-w-0 h-9 rounded-lg border border-border bg-muted/40 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/40 focus:border-[var(--ring)]/40 transition-all"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="h-9 px-3.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
            >
              Subscribe <ArrowRight className="h-3 w-3" />
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN FOOTER
═══════════════════════════════════════════════════ */

function MarketingFooter() {
  return (
    <footer className="bg-background border-t border-border/40">

      {/* ── Top section ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-3">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl shadow-md shadow-indigo-500/30"
                style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
              >
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-foreground tracking-tight">StemmQ</span>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              Decision Intelligence Infrastructure for the Enterprise. Make better strategic decisions that compound over time.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.12, y: -1 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:border-border/60 hover:bg-muted/60 transition-all"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-7 sm:gap-8">
            <FooterColumn title="Product" links={FOOTER_LINKS.product} />
            <FooterColumn title="Platform" links={FOOTER_LINKS.platform} />
            <FooterColumn title="Solutions" links={FOOTER_LINKS.solutions} />
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-1 gap-7 sm:gap-8">
            {/* Second group of columns — Resources, Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-6 col-span-2 sm:col-span-1">
              <FooterColumn title="Company" links={FOOTER_LINKS.company} />
              <FooterColumn title="Resources" links={FOOTER_LINKS.resources} />
            </div>

            {/* Newsletter */}
            <div className="col-span-2 sm:col-span-1 border-t border-white/6 pt-6 sm:pt-0 sm:border-0 lg:border-t lg:pt-6">
              <Newsletter />
            </div>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px mx-4 sm:mx-6 max-w-7xl sm:mx-auto" style={{ background: "linear-gradient(90deg, transparent, var(--border), transparent)" }} />

      {/* ── Bottom bar ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          {/* Copyright */}
          <p className="text-[11px] text-foreground/30 order-2 sm:order-1">
            © {new Date().getFullYear()} StemmQ, Inc. All rights reserved.
          </p>

          {/* Legal links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 order-1 sm:order-2">
            {(FOOTER_LINKS.legal ?? [
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Security", href: "/security" },
              { label: "Cookies", href: "/cookies" },
            ]).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] text-foreground/35 hover:text-foreground/65 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* SOC 2 badge */}
          <div className="hidden sm:flex items-center gap-1.5 order-3">
            <div className="h-4 w-4 rounded bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
            </div>
            <span className="text-[10px] text-foreground/35 font-semibold">SOC 2 Certified</span>
          </div>
        </div>
      </div>

    </footer>
  );
}

export { MarketingFooter };