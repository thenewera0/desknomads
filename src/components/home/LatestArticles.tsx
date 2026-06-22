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
    category: { name: "Remote Jobs", slug: "remote-jobs", color: "#22C55E" } as Article["category"],
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
    category: { name: "Side Hustles", slug: "side-hustles", color: "#F59E0B" } as Article["category"],
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

  return (
    <section 
      className="pt-24 md:pt-36 pb-32 md:pb-48"
      style={{
        backgroundColor: "#040B17",
        borderTop: "1px solid rgba(255, 255, 255, 0.04)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div className="dn-container">
        {/* Section header */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          style={{ marginBottom: "48px" }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              Latest <span className="font-serif italic font-normal text-[var(--dn-accent)]">Articles</span>
            </h2>
            <p className="text-xs text-[var(--dn-text-muted)] uppercase tracking-wider">
              Fresh content published regularly
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <FunnelSimple size={14} weight="light" className="text-[var(--dn-text-muted)] mr-1 flex-shrink-0" />
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setFilter(opt);
                  setVisibleCount(6);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap
                         transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.98] ${
                           filter === opt
                             ? "bg-[var(--dn-primary)] text-white"
                             : "bg-white/[0.04] text-[var(--dn-text-secondary)] hover:bg-white/[0.08] hover:text-white"
                         }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Articles Grid — clean uniform cards with Read More */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
             style={{ marginBottom: "64px" }}>
          {visible.map((article, i) => (
            <motion.div
              key={article.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              whileHover={reduceMotion ? {} : { y: -4 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                delay: reduceMotion ? 0 : (i % 3) * 0.05,
              }}
              className="flex"
            >
              <Link
                href={`/${article.slug}`}
                className="group flex flex-col w-full h-full rounded-2xl overflow-hidden
                         border border-white/[0.06] bg-[var(--dn-bg-card)]
                         hover:border-[var(--dn-primary)]/30 hover:bg-white/[0.02]
                         transition-all duration-300 ease-[var(--dn-ease-out)]"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden flex-shrink-0 bg-white/[0.03]">
                  {article.featuredImage ? (
                    <Image
                      src={article.featuredImage}
                      alt={article.title || "Article"}
                      fill
                      className="object-cover transition-transform duration-700 ease-[var(--dn-ease)] group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--dn-primary)]/15 to-transparent text-[var(--dn-text-muted)] text-xs">
                      DeskNomads
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider
                                backdrop-blur-md bg-black/40 border border-white/[0.12]"
                      style={{ color: article.category?.color || "#60A5FA" }}
                    >
                      {article.category?.name || "Article"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 md:p-6">
                  <h3 className="text-base md:text-lg font-bold text-white leading-snug mb-2.5 line-clamp-2 group-hover:text-[var(--dn-accent)] transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-[13px] text-[var(--dn-text-secondary)] leading-relaxed line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.05]">
                    <span className="flex items-center gap-1.5 text-[11px] text-[var(--dn-text-muted)]">
                      <Clock size={12} weight="light" />
                      {article.readingTime} min read
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full
                               bg-[var(--dn-primary)] group-hover:bg-[var(--dn-primary-hover)]
                               text-white text-[12px] font-semibold
                               transition-all duration-200 ease-[var(--dn-ease-out)]"
                    >
                      Read More
                      <ArrowRight size={13} weight="bold" className="group-hover:translate-x-0.5 transition-transform duration-200" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="group h-11 px-7 rounded-full border border-white/[0.1] hover:border-white/[0.2]
                       text-sm text-[var(--dn-text-secondary)] hover:text-white
                       hover:bg-white/[0.04] transition-all duration-200 ease-[var(--dn-ease-out)]
                       active:scale-[0.97] inline-flex items-center gap-2"
            >
              Load more articles
              <ArrowRight
                size={14}
                weight="light"
                className="group-hover:translate-x-0.5 transition-transform duration-200 ease-[var(--dn-ease-out)]"
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
