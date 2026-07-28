"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, ArrowUpRight } from "@phosphor-icons/react";
import type { Article } from "@/types";
import AdSlot from "../shared/AdSlot";

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
    category: { name: "Remote Jobs", slug: "remote-jobs", color: "#10B981" } as Article["category"],
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
  const secondary = data[1];
  const tertiary = data[2];

  const ease = [0.16, 1, 0.3, 1] as const;

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 32, filter: "blur(8px)" } as const,
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
          viewport: { once: true, amount: 0.1 },
          transition: { duration: 0.9, delay, ease },
        };

  return (
    <section className="relative w-full z-20" style={{ backgroundColor: "var(--dn-bg)" }}>
      <div className="dn-container">
        
        {/* Section header */}
        <motion.div {...fadeUp(0)} className="flex items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
               <span className="w-1.5 h-1.5 rounded-full bg-[var(--dn-accent)] shadow-[0_0_8px_var(--dn-accent)]" />
               <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--dn-text-muted)]">
                 The Algorithm&apos;s Pick
               </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-none drop-shadow-lg">
              Trending <span className="font-serif italic font-normal text-[var(--dn-accent)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--dn-accent)] to-[var(--dn-primary)]">Now</span>
            </h2>
          </div>
          <Link
            href="/trending"
            className="group hidden md:flex items-center gap-2 text-xs font-semibold text-[var(--dn-text-secondary)]
                     hover:text-white transition-colors duration-[var(--dn-duration-fast)] uppercase tracking-widest"
          >
            View all
            <ArrowUpRight size={14} className="group-hover:translate-x-[2px] group-hover:-translate-y-[2px] transition-transform" />
          </Link>
        </motion.div>

        {/* The Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Feature: Col span 2, Row span 2 on large screens */}
          <motion.div
            {...fadeUp(0.1)}
            className="lg:col-span-2 lg:row-span-2"
          >
            <Link href={`/${featured.slug}`} className="group block w-full h-full">
              <article className="glass-card h-full min-h-[400px] flex flex-col group-hover:bg-white/[0.04] transition-colors duration-[var(--dn-duration)]">
                <div className="glass-core relative flex flex-col justify-end p-8 lg:p-12 overflow-hidden">
                  {/* Background Image inside core */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={featured.featuredImage!}
                      alt={featured.title!}
                      fill
                      className="object-cover opacity-70 group-hover:scale-105 group-hover:opacity-80 transition-all duration-[1200ms] ease-[var(--dn-ease)]"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--dn-bg-section-elevated)] via-[rgba(8,8,8,0.7)] to-transparent" />
                  </div>

                  {/* Content over image */}
                  <div className="relative z-10 w-full lg:w-4/5 mt-32">
                    <span
                      className="inline-block px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-4
                                backdrop-blur-md bg-white/[0.04] border border-white/[0.1] shadow-xl"
                      style={{ color: featured.category!.color }}
                    >
                      {featured.category!.name}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-[1.15] mb-4 group-hover:text-[var(--dn-accent)] transition-colors duration-[var(--dn-duration-fast)]">
                      {featured.title}
                    </h3>
                    <p className="text-sm md:text-base text-[var(--dn-text-secondary)] leading-relaxed line-clamp-2 mb-6 max-w-[60ch]">
                      {featured.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-6 text-xs font-mono text-white/60">
                      <span className="flex items-center gap-2">
                        <Clock size={14} />
                        {featured.readingTime} min read
                      </span>
                      <span className="flex items-center gap-2">
                        <Eye size={14} />
                        {formatViews(featured.views!)} views
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>

          {/* Secondary Article */}
          <motion.div {...fadeUp(0.2)}>
            <Link href={`/${secondary.slug}`} className="group block w-full h-full">
              <article className="glass-card h-full flex flex-col group-hover:bg-white/[0.04] transition-colors duration-[var(--dn-duration)]">
                <div className="glass-core relative flex flex-col p-6">
                  <div className="relative w-full aspect-video rounded-[calc(2rem-1rem)] overflow-hidden mb-6">
                    <Image
                      src={secondary.featuredImage!}
                      alt={secondary.title!}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-[var(--dn-ease)]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <span
                    className="inline-block text-[9px] font-bold uppercase tracking-widest mb-3"
                    style={{ color: secondary.category!.color }}
                  >
                    {secondary.category!.name}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug mb-3 group-hover:text-[var(--dn-accent)] transition-colors">
                    {secondary.title}
                  </h3>
                  <div className="mt-auto flex items-center gap-4 text-[10px] font-mono text-[var(--dn-text-muted)]">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {secondary.readingTime}m</span>
                    <span className="flex items-center gap-1.5"><Eye size={12} /> {formatViews(secondary.views!)}</span>
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>

          {/* Integrated AdSlot (instead of a 3rd article on desktop) */}
          <motion.div {...fadeUp(0.3)} className="hidden md:block">
            <div className="glass-card h-full flex items-center justify-center relative overflow-hidden bg-[var(--dn-bg-section-elevated)] group">
               {/* Decorative glass glow inside Ad container */}
               <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
               <AdSlot id="home-trending-integrated" className="!my-0 !w-full !px-0" />
            </div>
          </motion.div>

          {/* Tertiary Article (Mobile only or if Ad is disabled, placed below for mobile) */}
          <motion.div {...fadeUp(0.4)} className="md:hidden">
            <Link href={`/${tertiary.slug}`} className="group block w-full h-full">
              <article className="glass-card h-full flex flex-col group-hover:bg-white/[0.04] transition-colors duration-[var(--dn-duration)]">
                <div className="glass-core relative flex flex-col p-6">
                  <div className="relative w-full aspect-video rounded-[calc(2rem-1rem)] overflow-hidden mb-6">
                    <Image
                      src={tertiary.featuredImage!}
                      alt={tertiary.title!}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-[var(--dn-ease)]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <span
                    className="inline-block text-[9px] font-bold uppercase tracking-widest mb-3"
                    style={{ color: tertiary.category!.color }}
                  >
                    {tertiary.category!.name}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug mb-3 group-hover:text-[var(--dn-accent)] transition-colors">
                    {tertiary.title}
                  </h3>
                  <div className="mt-auto flex items-center gap-4 text-[10px] font-mono text-[var(--dn-text-muted)]">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {tertiary.readingTime}m</span>
                    <span className="flex items-center gap-1.5"><Eye size={12} /> {formatViews(tertiary.views!)}</span>
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
