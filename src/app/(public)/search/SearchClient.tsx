"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, Clock, X, ArrowRight } from "@phosphor-icons/react";

// Demo search results — replace with Firestore full-text search or Algolia
const allArticles = [
  { id: "1", title: "ChatGPT vs Claude vs Gemini: The Ultimate AI Comparison", slug: "chatgpt-vs-claude-vs-gemini-comparison", excerpt: "We tested all three AI assistants across 50 tasks.", category: { name: "AI Tools", color: "#3B82F6" }, readingTime: 8, featuredImage: "https://picsum.photos/seed/ai-comparison/400/280" },
  { id: "2", title: "15 Remote Jobs Paying $100K+ Without a Degree", slug: "remote-jobs-100k-no-degree", excerpt: "High-paying remote careers you can start with skills alone.", category: { name: "Remote Jobs", color: "#22C55E" }, readingTime: 6, featuredImage: "https://picsum.photos/seed/remote-work/400/280" },
  { id: "3", title: "How I Built 7 Passive Income Streams Using Only AI Tools", slug: "passive-income-streams-ai-tools", excerpt: "From AI-generated content to automated digital products.", category: { name: "Passive Income", color: "#F59E0B" }, readingTime: 10, featuredImage: "https://picsum.photos/seed/passive-income/400/280" },
  { id: "4", title: "Top 20 Automation Tools That Save 10+ Hours Per Week", slug: "automation-tools-save-time", excerpt: "Automate repetitive tasks with these powerful tools.", category: { name: "Automation", color: "#A855F7" }, readingTime: 7, featuredImage: "https://picsum.photos/seed/automation-tools/400/280" },
  { id: "5", title: "The Complete Guide to AI-Powered SEO in 2025", slug: "ai-powered-seo-guide-2025", excerpt: "Learn how AI is transforming search engine optimization.", category: { name: "AI Tools", color: "#3B82F6" }, readingTime: 12, featuredImage: "https://picsum.photos/seed/seo-ai/400/280" },
];

const popularSearches = ["AI Tools", "Remote Work", "Passive Income", "ChatGPT", "Automation", "Freelancing"];

const ease = [0.32, 0.72, 0, 1] as const;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input without scrolling it under the fixed navbar
  // (plain autoFocus jumps the page to the top, causing overlap).
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const results = query.trim()
    ? allArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          a.category.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-[calc(100vh-72px)] py-12 md:py-16">
      {/* Background subtle glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="dn-container max-w-3xl relative z-10">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-6">
            Search DeskNomads
          </h1>

          {/* Search Input */}
          <div className="relative max-w-xl mx-auto group">
            <MagnifyingGlass
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--dn-text-muted)]
                       group-focus-within:text-[var(--dn-accent)] transition-colors duration-300"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search articles, tools, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-12 rounded-2xl bg-[var(--dn-bg-card)] border border-white/[0.08]
                       text-base text-white placeholder-[var(--dn-text-muted)]
                       focus:outline-none focus:border-[var(--dn-primary)] focus:ring-2 focus:ring-[var(--dn-primary)]/20
                       focus:shadow-[0_0_40px_rgba(59,130,246,0.1)]
                       transition-all duration-500"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
                           bg-white/[0.06] flex items-center justify-center
                           text-[var(--dn-text-muted)] hover:text-white hover:bg-white/[0.1]
                           transition-colors duration-200"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {query.trim() ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease }}
            >
              <p className="text-sm text-[var(--dn-text-muted)] mb-6">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>

              {results.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 rounded-2xl border border-white/[0.04] bg-white/[0.01]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                    <MagnifyingGlass size={28} className="text-[var(--dn-text-muted)]" />
                  </div>
                  <p className="text-[var(--dn-text-secondary)] font-medium mb-2">No results found</p>
                  <p className="text-sm text-[var(--dn-text-muted)]">Try different keywords or browse our categories.</p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-3">
                  {results.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.06, ease }}
                    >
                      <Link href={`/${article.slug}`} className="group block">
                        <div className="flex gap-4 p-4 rounded-xl border border-white/[0.06]
                                      bg-[var(--dn-bg-card)] hover:border-white/[0.12] hover:bg-[var(--dn-bg-card-hover)]
                                      transition-all duration-500 ease-[var(--dn-ease)]
                                      hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
                          <div className="relative w-28 h-20 md:w-36 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={article.featuredImage}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-700 ease-[var(--dn-ease)]
                                       group-hover:scale-[1.06]"
                              sizes="160px"
                            />
                          </div>
                          <div className="min-w-0 flex-1 flex flex-col justify-center">
                            <span
                              className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 inline-block"
                              style={{ color: article.category.color }}
                            >
                              {article.category.name}
                            </span>
                            <h2 className="text-sm font-semibold text-white line-clamp-2 leading-snug
                                         group-hover:text-[var(--dn-accent)] transition-colors duration-300">
                              {article.title}
                            </h2>
                            <div className="flex items-center gap-2 mt-2 text-[11px] text-[var(--dn-text-muted)]">
                              <Clock size={11} />
                              {article.readingTime} min read
                              <ArrowRight
                                size={11}
                                className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1
                                         transition-all duration-300 text-[var(--dn-accent)]"
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* Popular Searches */
            <motion.div
              key="popular"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease }}
              className="text-center"
            >
              <p className="text-sm text-[var(--dn-text-muted)] mb-5">Popular searches</p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {popularSearches.map((term, i) => (
                  <motion.button
                    key={term}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + i * 0.05, ease }}
                    onClick={() => setQuery(term)}
                    className="px-5 py-2.5 rounded-full text-[13px] font-medium
                             bg-white/[0.04] text-[var(--dn-text-secondary)]
                             hover:bg-[var(--dn-primary)]/10 hover:text-[var(--dn-accent)]
                             hover:border-[var(--dn-primary)]/20
                             border border-white/[0.06]
                             transition-all duration-500 ease-[var(--dn-ease)]
                             hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]
                             active:scale-[0.96]"
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
