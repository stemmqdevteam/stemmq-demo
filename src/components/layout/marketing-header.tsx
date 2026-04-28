"use client";

import { useState, useEffect, useRef, SetStateAction } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MARKETING_NAV, ROUTES } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close dropdown / drawer on navigation
  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  function handleMouseEnter(label: SetStateAction<string | null>) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveDropdown(label);
  }

  function handleMouseLeave() {
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 150);
  }

  function isDropdownActive(item: { label?: string; href?: undefined; children: { href: string }[] }) {
    if (!item.children) return false;
    return item.children.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + "/")
    );
  }

  return (
    <>
      {/* ── Desktop/Tablet header bar ──────────────────────────────────────── */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 relative z-10 shrink-0 group"
          >
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/25"
            >
              <Brain className="h-4 w-4 text-white" />
            </motion.div>
            <span className="text-[15px] font-bold tracking-tight text-foreground group-hover:opacity-80 transition-opacity">
              StemmQ
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {MARKETING_NAV.map((item) => {
              if (!item.children) {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-3.5 py-2 text-sm font-medium transition-colors rounded-xl",
                      isActive
                        ? "text-foreground bg-muted/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }

              const isActive = isDropdownActive(item);
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors rounded-xl",
                      isActive || activeDropdown === item.label
                        ? "text-foreground bg-muted/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200 opacity-60",
                        activeDropdown === item.label ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-xl shadow-black/8 p-2 z-50"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex flex-col gap-0.5 rounded-xl px-3.5 py-3 transition-colors",
                              pathname === child.href
                                ? "bg-accent/8 text-accent"
                                : "hover:bg-muted/80"
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm font-semibold",
                                pathname === child.href ? "text-accent" : "text-foreground"
                              )}
                            >
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="text-xs text-muted-foreground leading-relaxed">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-1 shrink-0">

            {/* ── Theme toggle ── */}
            <ThemeToggle variant="compact" modes={['light', 'dark']} />

            {/* Divider */}
            <div className="w-px h-5 bg-border mx-1" />

            <Link href={ROUTES.login}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Log in
              </motion.button>
            </Link>

            <Link href={ROUTES.signup}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="relative group flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/30"
                style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            </Link>
          </div>

          {/* Mobile row: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle variant="compact" modes={['light', 'dark']} />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative z-10 rounded-xl p-2.5 text-foreground bg-muted/50 hover:bg-muted transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close"
                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu"
                    initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 md:hidden bg-background/96 backdrop-blur-2xl overflow-y-auto"
          >
            <div className="flex flex-col px-5 pt-24 pb-8 min-h-full">
              <nav className="flex flex-col gap-1.5 w-full">
                {MARKETING_NAV.map((item, idx) => {
                  if (!item.children) {
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center rounded-2xl px-5 py-4 text-base font-semibold transition-colors",
                            pathname === item.href
                              ? "bg-accent/10 text-accent"
                              : "text-foreground bg-muted/30 hover:bg-muted"
                          )}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  }

                  const isOpen = mobileExpanded === item.label;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <button
                        onClick={() => setMobileExpanded(isOpen ? null : item.label)}
                        className={cn(
                          "flex items-center justify-between w-full rounded-2xl px-5 py-4 text-base font-semibold transition-colors",
                          isDropdownActive(item)
                            ? "bg-accent/10 text-accent"
                            : "text-foreground bg-muted/30 hover:bg-muted"
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 transition-transform duration-300 opacity-50",
                            isOpen ? "rotate-180" : ""
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pt-1.5 pb-1 space-y-0.5 pl-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    "flex flex-col rounded-xl px-5 py-3.5 transition-colors",
                                    pathname === child.href
                                      ? "bg-accent/8 text-accent"
                                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                  )}
                                >
                                  <span className="text-sm font-semibold">{child.label}</span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile CTA buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex flex-col gap-3 mt-8 pt-6 border-t border-border/50"
              >
                {/* Theme segmented control in mobile menu */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm text-muted-foreground font-medium">Appearance</span>
                  <ThemeToggle variant="segmented" modes={['light', 'dark']} />
                </div>

                <Link href={ROUTES.login} className="w-full">
                  <button className="w-full flex items-center justify-center py-3.5 rounded-xl text-sm font-semibold text-foreground bg-muted/50 hover:bg-muted transition-colors">
                    Log in
                  </button>
                </Link>

                <Link href={ROUTES.signup} className="w-full">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
                    style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { MarketingHeader };
