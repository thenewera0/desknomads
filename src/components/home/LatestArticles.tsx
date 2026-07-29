"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, FunnelSimple } from "@phosphor-icons/react";
import type { Article } from "@/types";

// Demo articles — replace with Firestore query
const allArticles: Partial<Article>[] = [
  {
    id: "a1",
    title: "The Complete Guide to AI-Powered SEO in 2025",
    slug: "ai-powered-seo-guide-2025",
    excerpt: "Learn how artificial intelligence is transforming search engine optimization and how you can leverage AI tools to rank higher.",
    featuredImage: "https://picsum.photos/seed/seo-ai/600/400",
    category: { name: "AI Tools", slug: "ai-tools", color: "#3B82F6" } as Article["category"],
    readingTime: 12,
    publishedAt: "2025-06-14T10:00:00Z",
    tags: ["SEO", "AI"],
  },
  {
    id: "a2",
    title: "How to Start Freelancing on Fiverr: A Step-by-Step Guide",
    slug: "start-freelancing-fiverr-guide",
    excerpt: "From setting up your profile to landing your first client. Everything you need to start earning on Fiverr.",
    featuredImage: "https://picsum.photos/seed/fiverr-freelance/600/400",
    category: { name: "Freelancing", slug: "freelancing", color: "#F97316" } as Article["category"],
    readingTime: 8,
    publishedAt: "2025-06-13T10:00:00Z",
    tags: ["Freelancing", "Fiverr"],
  },
  {
    id: "a3",
    title: "Top 20 Automation Tools That Save 10+ Hours Per Week",
    slug: "automation-tools-save-time",
    excerpt: "Automate your repetitive tasks with these powerful tools. From email sequences to social media scheduling.",
    featuredImage: "https://picsum.photos/seed/automation-tools/600/400",
    category: { name: "Automation", slug: "automation", color: "#A855F7" } as Article["category"],
    readingTime: 7,
    publishedAt: "2025-06-12T10:00:00Z",
    tags: ["Automation", "Productivity"],
  },
  {
    id: "a4",
    title: "Building a Digital Product Empire: From Idea to $10K/Month",
    slug: "digital-product-empire-guide",
    excerpt: "A complete blueprint for creating, launching, and scaling digital products that generate recurring revenue.",
    featuredImage: "https://picsum.photos/seed/digital-products/600/400",
    category: { name: "Digital Products", slug: "digital-products", color: "#EC4899" } as Article["category"],
    readingTime: 15,
    publishedAt: "2025-06-11T10:00:00Z",
    tags: ["Digital Products", "Passive Income"],
  },
  {
    id: "a5",
    title: "Remote Work in India: Best Companies Hiring Right Now",
    slug: "remote-work-india-companies-hiring",
    excerpt: "A curated list of top companies offering remote positions in India with competitive salaries and benefits.",
    featuredImage: "https://picsum.photos/seed/remote-india/600/400",
    category: { name: "Remote Jobs", slug: "remote-jobs", color: "#10B981" } as Article["category"],
    readingTime: 6,
    publishedAt: "2025-06-10T10:00:00Z",
    tags: ["Remote Work", "India", "Jobs"],
  },
  {
    id: "a6",
    title: "10 AI Side Hustles You Can Start Today with Zero Investment",
    slug: "ai-side-hustles-zero-investment",
    excerpt: "Leverage free AI tools to start earning immediately. No upfront costs, no technical skills needed.",
    featuredImage: "https://picsum.photos/seed/side-hustles/600/400",
    category: { name: "Passive Income", slug: "passive-income", color: "#F59E0B" } as Article["category"],
    readingTime: 9,
    publishedAt: "2025-06-09T10:00:00Z",
    tags: ["Side Hustles", "AI"],
  },
];

const filterOptions = ["All", "AI Tools", "Remote Jobs", "Passive Income", "Automation", "Freelancing"];

export default function LatestArticles({ articles }: { articles?: Partial<Article>[] }) {
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const reduceMotion = useReducedMotion();

  // Server-provided articles (SSR); fall back to the seed set if none exist yet.
  const data = articles && articles.length ? articles : allArticles;

  const filtered = data.filter(
    (a) => filter === "All" || a.category?.name === filter
  );
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 32, filter: "blur(8px)" } as const,
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
          viewport: { once: true, amount: 0.1 },
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="relative w-full z-10 pt-24 md:pt-36 pb-32 md:pb-48" style={{ backgroundColor: "var(--dn-bg)" }}>
      <div className="dn-container">
        
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 mb-4">
               <span className="w-1.5 h-1.5 rounded-full bg-[var(--dn-accent)] shadow-[0_0_8px_var(--dn-accent)]" />
               <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--dn-text-muted)]">
                 Recent Dispatches
               </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2 drop-shadow-lg">
              Latest <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[var(--dn-accent)] to-[var(--dn-primary)]">Articles</span>
            </h2>
            <p className="text-sm md:text-base text-[var(--dn-text-secondary)] max-w-[45ch]">
              Fresh insights and guides on digital independence published regularly.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div {...fadeUp(0.1)} className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--dn-bg-card)] border border-[var(--dn-glass-border)] flex-shrink-0 mr-1 shadow-sm">
              <FunnelSimple size={14} weight="duotone" className="text-[var(--dn-text-muted)]" />
            </div>
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setFilter(opt);
                  setVisibleCount(6);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap
                         transition-all duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-out)] active:scale-[0.98] ${
                           filter === opt
                             ? "bg-white text-black shadow-lg shadow-white/10"
                             : "bg-[var(--dn-bg-card)] border border-[var(--dn-glass-border)] text-[var(--dn-text-secondary)] hover:bg-white/[0.08] hover:text-white"
                         }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {visible.map((article, i) => (
            <motion.div
              key={article.id}
              {...fadeUp(0.1 + (i % 3) * 0.1)}
              className="h-full flex"
            >
              <Link
                href={`/${article.slug}`}
                className="group w-full h-full"
              >
                <div className="glass-card h-full flex flex-col group-hover:bg-white/[0.04] transition-colors duration-[var(--dn-duration)]">
                  <div className="glass-core h-full flex flex-col overflow-hidden relative">
                    
                    {/* Background glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-[var(--dn-duration)] pointer-events-none z-10"
                         style={{ background: `radial-gradient(circle at top right, ${article.category?.color || '#3B82F6'}, transparent 70%)` }} />
                    
                    {/* Thumbnail Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden flex-shrink-0 bg-[var(--dn-bg-elevated)] border-b border-[var(--dn-glass-border)] z-0">
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={article.title || "Article"}
                          fill
                          className="object-cover transition-transform duration-1000 ease-[var(--dn-ease)] group-hover:scale-[1.05]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--dn-primary)]/15 to-transparent text-[var(--dn-text-muted)] text-xs">
                          DeskNomads
                        </div>
                      )}
                      
                      {/* Image Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 z-10 pointer-events-none" />

                      <div className="absolute top-3 left-3 z-20">
                        <span
                          className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest
                                    backdrop-blur-md bg-black/60 border border-white/[0.15] shadow-lg"
                          style={{ color: article.category?.color || "#60A5FA" }}
                        >
                          {article.category?.name || "Article"}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-1 p-6 relative z-20">
                      <h3 className="text-xl font-bold text-white leading-tight mb-3 line-clamp-2 group-hover:text-[var(--dn-accent)] transition-colors duration-[var(--dn-duration-fast)]">
                        {article.title}
                      </h3>
                      <p className="text-[13px] text-[var(--dn-text-secondary)] leading-relaxed line-clamp-2 mb-6">
                        {article.excerpt}
                      </p>
                      
                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--dn-glass-border)]">
                        <span className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--dn-text-muted)]">
                          <Clock size={14} weight="duotone" className="text-[var(--dn-text-secondary)]" />
                          {article.readingTime} min read
                        </span>
                        
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--dn-bg-card)] border border-[var(--dn-glass-border)] group-hover:bg-[var(--dn-primary)] group-hover:border-[var(--dn-primary)] transition-all duration-[var(--dn-duration-fast)] overflow-hidden relative">
                           <ArrowRight size={14} weight="bold" className="text-white absolute transition-transform duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-spring)] -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                           <ArrowRight size={14} weight="bold" className="text-white absolute transition-transform duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-spring)] translate-x-0 opacity-100 group-hover:translate-x-4 group-hover:opacity-0" />
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <motion.div {...fadeUp(0.2)} className="flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="group h-12 px-8 rounded-xl border border-[var(--dn-glass-border)] bg-[var(--dn-bg-card)]
                       text-sm font-semibold text-white hover:bg-white/[0.06] hover:border-white/[0.15]
                       transition-all duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-out)]
                       active:scale-[0.98] inline-flex items-center gap-3 shadow-[var(--dn-shadow-inset)]"
            >
              Load more articles
              <ArrowRight
                size={14}
                weight="bold"
                className="group-hover:translate-x-1 transition-transform duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-out)] text-[var(--dn-accent)]"
              />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
