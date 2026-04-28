"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Clock, ArrowRight, Sparkles, TrendingUp, Shield, Brain,
  BookOpen, Zap, Target, Users, Search, ChevronRight,
  Mail, CheckCircle2, Star
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════ */

function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [-14, 14, -14], x: [-8, 8, -8] }}
      transition={{ duration: 11 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    />
  );
}

function Reveal({
  children, delay = 0, className = "", direction = "up",
}: {
  children: React.ReactNode; delay?: number; className?: string;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const xInit = direction === "left" ? -28 : direction === "right" ? 28 : 0;
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: direction === "up" ? 24 : 0, x: xInit }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */

const categoryMeta: Record<string, { color: string; icon: typeof Brain }> = {
  "Decision Intelligence": { color: "#6366f1", icon: Brain },
  "AI Governance": { color: "#a855f7", icon: Shield },
  "Product": { color: "#10b981", icon: Zap },
  "Enterprise AI": { color: "#3b82f6", icon: TrendingUp },
  "Strategic Planning": { color: "#f59e0b", icon: Target },
};

const featuredPost = {
  category: "Decision Intelligence",
  title: "Why Every AI Agent Needs a Decision Gate",
  excerpt: "As AI agents proliferate across organizations, the question isn't whether to use them — it's how to govern them. Decision Gates are the answer organizations have been looking for.",
  author: "Sarah Chen",
  authorInitials: "SC",
  authorColor: "#6366f1",
  date: "March 12, 2026",
  readTime: "8 min read",
  tags: ["AI Governance", "Decision Gate", "Enterprise"],
};

const posts = [
  {
    category: "AI Governance",
    title: "The Hidden Cost of Ungoverned AI Decisions",
    excerpt: "Organizations deploying AI without a decision layer are accumulating invisible debt. Here's how to quantify it.",
    author: "Marcus Webb", initials: "MW", authorColor: "#a855f7",
    date: "March 8, 2026", readTime: "6 min", featured: false,
  },
  {
    category: "Decision Intelligence",
    title: "Decision Quality Score: A New Metric for Strategic Work",
    excerpt: "DQS is the metric that answers the question every executive wants answered: how confident should we be in this decision?",
    author: "Priya Sharma", initials: "PS", authorColor: "#6366f1",
    date: "March 4, 2026", readTime: "5 min", featured: false,
  },
  {
    category: "Product",
    title: "How Assumption Calibration Reduces Strategic Risk",
    excerpt: "Most strategic mistakes aren't failures of execution — they're failures of assumption. Here's how to fix that.",
    author: "Jordan Kim", initials: "JK", authorColor: "#10b981",
    date: "Feb 28, 2026", readTime: "7 min", featured: false,
  },
  {
    category: "Enterprise AI",
    title: "Building Institutional Memory with AI: Beyond RAG",
    excerpt: "RAG retrieves information. Decision intelligence captures reasoning. The difference is profound for organizations at scale.",
    author: "Sarah Chen", initials: "SC", authorColor: "#3b82f6",
    date: "Feb 22, 2026", readTime: "9 min", featured: true,
  },
  {
    category: "Strategic Planning",
    title: "The Simulation Gap: Why Teams Stop at Scenarios",
    excerpt: "Most teams run one scenario. StemmQ users run dozens — and it fundamentally changes how they commit to strategy.",
    author: "Marcus Webb", initials: "MW", authorColor: "#f59e0b",
    date: "Feb 17, 2026", readTime: "4 min", featured: false,
  },
  {
    category: "AI Governance",
    title: "Multi-Agent Orchestration: Governance Before Capability",
    excerpt: "When agents depend on other agents, governance complexity multiplies. StemmQ's joint decision evaluation solves this.",
    author: "Priya Sharma", initials: "PS", authorColor: "#a855f7",
    date: "Feb 10, 2026", readTime: "6 min", featured: false,
  },
];

const topics = [
  "All", "Decision Intelligence", "AI Governance", "Assumption Calibration",
  "Strategic Planning", "Enterprise AI", "Decision Quality", "Agent Systems",
  "Org Memory", "Risk Modeling", "Product Strategy",
];

/* ═══════════════════════════════════════════════════
   READING TIME BADGE
═══════════════════════════════════════════════════ */

function ReadBadge({ time }: { time: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-muted-foreground">
      <Clock className="h-3 w-3" /> {time}
    </span>
  );
}

function CategoryBadge({ cat, size = "sm" }: { cat: string; size?: "sm" | "md" }) {
  const meta = categoryMeta[cat] ?? { color: "#64748b", icon: BookOpen };
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold border ${
      size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]"
    }`}
      style={{ color: meta.color, background: `${meta.color}12`, borderColor: `${meta.color}25` }}>
      <Icon className="h-3 w-3" />
      {cat}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */

function BlogHero({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 sm:pt-32 pb-14 sm:pb-16 bg-background">
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.8) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
      <Orb delay={0} className="absolute top-[-8%] left-[-4%] w-[440px] h-[440px] rounded-full bg-indigo-600/10 blur-[110px] pointer-events-none" />
      <Orb delay={4} className="absolute bottom-[-5%] right-[-3%] w-[360px] h-[360px] rounded-full bg-violet-600/8 blur-[90px] pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-medium text-(--accent) mb-5 backdrop-blur-sm">
            <BookOpen className="h-3.5 w-3.5" /> Decision Intelligence Blog
          </span>
        </Reveal>
        <Reveal delay={0.07}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.06] mb-4">
            Decision Intelligence{" "}
            <span style={{ background: "linear-gradient(135deg,#818cf8 0%,#6366f1 40%,#a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Insights
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.13}>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Thought leadership on AI governance, strategic decision-making, and building organizations that learn over time.
          </p>
        </Reveal>

        {/* Search bar */}
        <Reveal delay={0.19}>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-12 rounded-2xl border border-border bg-muted/40 pl-11 pr-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all backdrop-blur-sm"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground/60 transition-colors text-xs">
                ✕
              </button>
            )}
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FEATURED POST — big hero card
═══════════════════════════════════════════════════ */

function FeaturedPost() {
  const meta = categoryMeta[featuredPost.category] ?? { color: "#6366f1", icon: Brain };

  return (
    <Reveal className="mb-6">
      <motion.div whileHover={{ y: -4 }}
        className="group rounded-2xl border border-border/60 bg-card/30 overflow-hidden cursor-pointer transition-all hover:border-border hover:bg-card/50 shadow-xl shadow-black/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Text side (3/5) */}
          <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                <Star className="h-3 w-3 fill-amber-400" /> Featured
              </span>
              <CategoryBadge cat={featuredPost.category} size="md" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4 group-hover:text-indigo-400 transition-colors">
              {featuredPost.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 flex-1">{featuredPost.excerpt}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {featuredPost.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full border border-border/60 bg-muted/30 text-muted-foreground">{tag}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${featuredPost.authorColor}, ${featuredPost.authorColor}88)` }}>
                  {featuredPost.authorInitials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground/75">{featuredPost.author}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{featuredPost.readTime}</span>
                    <span>·</span>
                    <span>{featuredPost.date}</span>
                  </div>
                </div>
              </div>
              <motion.div whileHover={{ x: 3 }} className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold">
                Read article <ArrowRight className="h-3.5 w-3.5" />
              </motion.div>
            </div>
          </div>

          {/* Visual side (2/5) */}
          <div className="lg:col-span-2 min-h-[160px] lg:min-h-0 flex items-center justify-center p-8 relative overflow-hidden border-t lg:border-t-0 lg:border-l border-border/40"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.06), rgba(59,130,246,0.04))" }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "radial-gradient(circle at 60% 40%, rgba(99,102,241,0.15), transparent 60%)"
            }} />
            <div className="relative text-center">
              {/* Animated DG visual */}
              <motion.div
                animate={{ scale: [1, 1.04, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl sm:text-7xl font-black mb-2"
                style={{ background: "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                DG
              </motion.div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Decision Gate</p>
              {/* Orbiting dots */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 pointer-events-none">
                {[0, 120, 240].map((deg, i) => (
                  <div key={i} className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full"
                    style={{
                      transform: `rotate(${deg}deg) translateX(52px) translateY(-50%)`,
                      background: ["#6366f1", "#a855f7", "#3b82f6"][i],
                      opacity: 0.5,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════
   POST CARD
═══════════════════════════════════════════════════ */

function PostCard({ post, i }: { post: typeof posts[0]; i: number }) {
  const meta = categoryMeta[post.category] ?? { color: "#64748b", icon: BookOpen };
  return (
    <Reveal delay={i * 0.06}>
      <motion.div whileHover={{ y: -5 }}
        className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/30 overflow-hidden h-full cursor-pointer transition-all hover:border-border hover:bg-card/50"
      >
        {post.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ background: "#f59e0b15", color: "#f59e0b", border: "1px solid #f59e0b25" }}>
              Editor's Pick
            </span>
          </div>
        )}

        {/* Top accent line */}
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${meta.color}60, transparent)` }} />

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <div className="mb-3">
            <CategoryBadge cat={post.category} />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-foreground/85 mb-2.5 leading-snug group-hover:text-foreground transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${post.authorColor}, ${post.authorColor}88)` }}>
                {post.initials}
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <ReadBadge time={post.readTime} />
              <motion.div whileHover={{ x: 2 }}>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-indigo-400 transition-colors" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════
   TOPICS FILTER
═══════════════════════════════════════════════════ */

function TopicsFilter({ active, setActive }: { active: string; setActive: (t: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {topics.map(topic => {
        const isActive = active === topic;
        const meta = categoryMeta[topic];
        return (
          <motion.button
            key={topic}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActive(topic)}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-medium transition-all ${
              isActive ? "" : "border-border bg-muted/30 text-muted-foreground hover:border-border/80 hover:text-foreground"
            }`}
            style={isActive ? {
              borderColor: (meta?.color ?? "#6366f1") + "50",
              background: (meta?.color ?? "#6366f1") + "14",
              color: meta?.color ?? "#6366f1",
            } : undefined}
          >
            {topic}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   NEWSLETTER
═══════════════════════════════════════════════════ */

function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="py-14 sm:py-16 border-y border-border/30 bg-background">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/8 to-violet-500/5 p-7 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 60% 20%, rgba(99,102,241,0.12), transparent 60%)" }} />
            <div className="relative text-center">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-indigo-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Stay sharp on decision intelligence
              </h2>
              <p className="text-sm text-muted-foreground mb-7 max-w-sm mx-auto">
                New posts on AI governance, strategic decisions, and org intelligence. Every two weeks. No spam.
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-semibold">You're subscribed! Check your inbox.</span>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="flex-1 h-11 rounded-xl border border-border bg-muted/40 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                    />
                    <motion.button type="submit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      className="h-11 px-5 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
                      Subscribe
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

              <p className="text-[10px] text-foreground/20 mt-4">No spam. Unsubscribe any time.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState("All");

  const filtered = posts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchTopic = activeTopic === "All" || p.category === activeTopic;
    return matchSearch && matchTopic;
  });

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <BlogHero search={search} setSearch={setSearch} />

      {/* Featured */}
      <section className="py-8 sm:py-10 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {!search && activeTopic === "All" && <FeaturedPost />}
        </div>
      </section>

      {/* Topics filter */}
      <section className="py-6 sm:py-8 border-y border-border/30 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <TopicsFilter active={activeTopic} setActive={setActiveTopic} />
          </Reveal>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-10 sm:py-14 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filtered.map((post, i) => (
                <PostCard key={post.title} post={post} i={i} />
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="text-center py-16">
                <div className="h-14 w-14 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-foreground/50 font-semibold mb-1">No articles found</p>
                <p className="text-xs text-muted-foreground">Try a different search term or topic filter.</p>
                <button onClick={() => { setSearch(""); setActiveTopic("All"); }}
                  className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Clear filters
                </button>
              </div>
            </Reveal>
          )}

          {/* Load more placeholder */}
          {filtered.length > 0 && !search && activeTopic === "All" && (
            <Reveal delay={0.2} className="text-center mt-10">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-foreground/60 border border-border bg-muted/30 hover:bg-muted/60 hover:text-foreground transition-all">
                Load More Articles <ChevronRight className="h-4 w-4" />
              </motion.button>
            </Reveal>
          )}
        </div>
      </section>

      {/* Topics section */}
      <section className="py-12 sm:py-14 border-t border-border/30 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/25 bg-(--accent)/8 px-4 py-1.5 text-xs font-medium text-(--accent) mb-5">
              All Topics
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Explore by category</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2">
              {topics.filter(t => t !== "All").map((topic, i) => {
                const meta = categoryMeta[topic];
                const Icon = meta?.icon ?? BookOpen;
                return (
                  <motion.button
                    key={topic}
                    whileHover={{ scale: 1.05, y: -2 }}
                    onClick={() => { setActiveTopic(topic); document.getElementById("posts")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-medium transition-all"
                    style={{ borderColor: meta ? `${meta.color}25` : "var(--border)", background: meta ? `${meta.color}08` : "var(--muted)", color: meta ? `${meta.color}cc` : "var(--muted-foreground)" }}
                  >
                    {meta && <Icon className="h-3 w-3" />}
                    {topic}
                  </motion.button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <Newsletter />

      <MarketingFooter />
    </div>
  );
}
