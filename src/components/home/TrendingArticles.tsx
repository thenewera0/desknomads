"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, ArrowUpRight } from "@phosphor-icons/react";
import type { Article } from "@/types";

// Demo data — replace with Firestore query
const trendingArticles: Partial<Article>[] = [
  {
    id: "1",
    title: "ChatGPT vs Claude vs Gemini: The Ultimate AI Comparison for 2025",
    slug: "chatgpt-vs-claude-vs-gemini-comparison",
    excerpt:
      "We tested all three AI assistants across 50 real-world tasks. Here's which one actually delivers and when to use each.",
    featuredImage: "https://picsum.photos/seed/ai-comparison/800/500",
    category: { name: "AI Tools", slug: "ai-tools", color: "#3B82F6" } as Article["category"],
    readingTime: 8,
    views: 12400,
    publishedAt: "2025-06-15T10:00:00Z",
    tags: ["AI", "ChatGPT", "Claude", "Gemini"],
  },
  {
    id: "2",
    title: "15 Remote Jobs Paying $100K+ That Don't Require a Degree",
    slug: "remote-jobs-100k-no-degree",
    excerpt:
      "High-paying remote careers you can start with skills alone. From UX to DevOps, here's your roadmap.",
    featuredImage: "https://picsum.photos/seed/remote-work/800/500",
    category: { name: "Remote Jobs", slug: "remote-jobs", color: "#22C55E" } as Article["category"],
    readingTime: 6,
    views: 8900,
    publishedAt: "2025-06-12T10:00:00Z",
    tags: ["Remote Work", "Careers"],
  },
  {
    id: "3",
    title: "How I Built 7 Passive Income Streams Using Only AI Tools",
    slug: "passive-income-streams-ai-tools",
    excerpt:
      "From AI-generated content to automated digital products. A step-by-step breakdown of each income stream.",
    featuredImage: "https://picsum.photos/seed/passive-income/800/500",
    category: { name: "Passive Income", slug: "passive-income", color: "#F59E0B" } as Article["category"],
    readingTime: 10,
    views: 15200,
    publishedAt: "2025-06-10T10:00:00Z",
    tags: ["Passive Income", "AI"],
  },
];

function formatViews(views: number): string {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

export default function TrendingArticles({ articles }: { articles?: Partial<Article>[] }) {
  const reduceMotion = useReducedMotion();

  // Server-provided trending articles (SSR); fall back to the seed set if too few.
  const data = articles && articles.length >= 3 ? articles : trendingArticles;
  const featured = data[0];
  const secondary = data.slice(1, 3);

  return (
    <section 
      className="py-24 md:py-32 border-t border-b border-white/[0.04]"
      style={{
        backgroundColor: "#070E1A", // Distinct section tone to prevent merging
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
          className="flex items-end justify-between"
          style={{ marginBottom: "40px" }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Trending <span className="font-serif italic font-normal text-[var(--dn-accent)]">Now</span>
            </h2>
            <p className="text-xs text-[var(--dn-text-muted)] mt-1.5 uppercase tracking-wider">
              Most-read articles this week
            </p>
          </div>
          <Link
            href="/trending"
            className="hidden md:flex items-center gap-1 text-xs font-semibold text-[var(--dn-accent)]
                     hover:text-white transition-colors duration-300"
          >
            View all
            <ArrowUpRight size={13} weight="light" />
          </Link>
        </motion.div>

        {/* Bento Grid: 1 large + 2 stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large featured card */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={reduceMotion ? {} : { y: -4 }}
            whileTap={reduceMotion ? {} : { scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex"
          >
            <Link href={`/${featured.slug}`} className="group block w-full h-full">
              <article
                className="relative flex-1 rounded-xl overflow-hidden border border-white/[0.05]
                         bg-[var(--dn-bg-card)] hover:border-white/[0.1] hover:bg-white/[0.02]
                         transition-all duration-300 ease-[var(--dn-ease-out)] flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
                  <Image
                    src={featured.featuredImage!}
                    alt={featured.title!}
                    fill
                    className="object-cover transition-transform duration-700 ease-[var(--dn-ease)]
                             group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--dn-bg-card)] via-transparent to-transparent opacity-80" />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider
                                backdrop-blur-md bg-white/[0.04] border border-white/[0.08]"
                      style={{ color: featured.category!.color }}
                    >
                      {featured.category!.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-extrabold text-white leading-snug mb-3 group-hover:text-[var(--dn-accent)] transition-colors duration-300">
                      {featured.title}
                    </h3>
                    <p className="text-xs md:text-sm text-[var(--dn-text-secondary)] leading-relaxed line-clamp-2 mb-4">
                      {featured.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--dn-text-muted)] mt-auto">
                    <span className="flex items-center gap-1">
                      <Clock size={12} weight="light" />
                      {featured.readingTime} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} weight="light" />
                      {formatViews(featured.views!)} views
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>

          {/* Stacked secondary cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {secondary.map((article, i) => (
              <motion.div
                key={article.id}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={reduceMotion ? {} : { y: -3 }}
                whileTap={reduceMotion ? {} : { scale: 0.99 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
              >
                <Link href={`/${article.slug}`} className="group block">
                  <article
                    className="flex gap-4 p-4 rounded-xl border border-white/[0.05]
                             bg-[var(--dn-bg-card)] hover:border-white/[0.1] hover:bg-white/[0.02]
                             transition-all duration-300 ease-[var(--dn-ease-out)]"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 md:w-32 md:h-24 flex-shrink-0 rounded-lg overflow-hidden border border-white/[0.04]">
                      <Image
                        src={article.featuredImage!}
                        alt={article.title!}
                        fill
                        className="object-cover transition-transform duration-700 ease-[var(--dn-ease)]
                                 group-hover:scale-[1.03]"
                        sizes="130px"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between py-0.5 min-w-0 flex-1">
                      <div>
                        <span
                          className="inline-block text-[9px] font-bold uppercase tracking-wider mb-2"
                          style={{ color: article.category!.color }}
                        >
                          {article.category!.name}
                        </span>
                        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-[var(--dn-accent)] transition-colors duration-300">
                          {article.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--dn-text-muted)] mt-2">
                        <span className="flex items-center gap-1">
                          <Clock size={11} weight="light" />
                          {article.readingTime} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} weight="light" />
                          {formatViews(article.views!)}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
