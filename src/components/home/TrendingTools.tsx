"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  MagnifyingGlass,
  ArrowUpRight,
  Star,
  Crown,
  CheckCircle,
} from "@phosphor-icons/react";
import type { Tool } from "@/types";
import AdSlot from "../shared/AdSlot";

// Demo data — replace with Firestore query
const demoTools: Partial<Tool>[] = [
  {
    id: "1",
    name: "ChatGPT",
    slug: "chatgpt",
    description: "Advanced AI chatbot for writing, coding, analysis, and more",
    logoUrl: "https://picsum.photos/seed/chatgpt-logo/80/80",
    category: "AI Writing",
    pricing: "freemium",
    rating: 4.8,
    isFeatured: true,
    isVerified: true,
    tags: ["Writing", "Coding", "Research"],
  },
  {
    id: "2",
    name: "Midjourney",
    slug: "midjourney",
    description: "AI-powered image generation from text descriptions",
    logoUrl: "https://picsum.photos/seed/midjourney-logo/80/80",
    category: "AI Image",
    pricing: "paid",
    rating: 4.7,
    isFeatured: true,
    isVerified: true,
    tags: ["Image", "Design", "Art"],
  },
  {
    id: "3",
    name: "Notion AI",
    slug: "notion-ai",
    description: "AI assistant built into your workspace for notes and docs",
    logoUrl: "https://picsum.photos/seed/notion-logo/80/80",
    category: "Productivity",
    pricing: "freemium",
    rating: 4.5,
    isFeatured: false,
    isVerified: true,
    tags: ["Productivity", "Notes", "Writing"],
  },
  {
    id: "4",
    name: "Jasper",
    slug: "jasper",
    description: "AI content platform for marketing teams and creators",
    logoUrl: "https://picsum.photos/seed/jasper-logo/80/80",
    category: "AI Writing",
    pricing: "paid",
    rating: 4.4,
    isFeatured: false,
    isVerified: true,
    tags: ["Marketing", "Content", "Copy"],
  },
  {
    id: "5",
    name: "Descript",
    slug: "descript",
    description: "AI-powered video and podcast editing made simple",
    logoUrl: "https://picsum.photos/seed/descript-logo/80/80",
    category: "AI Video",
    pricing: "freemium",
    rating: 4.6,
    isFeatured: true,
    isVerified: true,
    tags: ["Video", "Audio", "Editing"],
  },
];

const filterTabs = ["All", "AI Writing", "AI Image", "AI Video", "Productivity"];

function PricingBadge({ pricing }: { pricing: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    free: { bg: "rgba(16,185,129,0.1)", text: "var(--dn-success)" },
    freemium: { bg: "rgba(96,165,250,0.1)", text: "var(--dn-accent)" },
    paid: { bg: "rgba(245,158,11,0.1)", text: "var(--dn-warning)" },
  };
  const s = styles[pricing] || styles.freemium;
  return (
    <span
      className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border"
      style={{ background: s.bg, color: s.text, borderColor: `${s.text}30` }}
    >
      {pricing}
    </span>
  );
}

interface ToolCardProps {
  tool: typeof demoTools[number];
  index: number;
  reduceMotion: boolean;
}

function ToolCard({ tool, index, reduceMotion }: ToolCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 32, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.9,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full"
    >
      <a href={tool.url || "#"} target="_blank" rel="noopener noreferrer" className="group flex flex-col w-full h-full">
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="glass-card h-full flex flex-col group-hover:bg-white/[0.04] transition-colors duration-[var(--dn-duration)]"
        >
          <div className="glass-core relative p-5 h-full flex flex-col justify-between">
            {/* Spotlight cursor glow */}
            {!reduceMotion && isHovered && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-[var(--dn-duration-fast)]"
                style={{
                  background: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
                }}
              />
            )}

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start gap-4 mb-4">
                {/* Logo */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--dn-bg-elevated)] flex-shrink-0 border border-white/[0.08] shadow-lg group-hover:scale-105 transition-transform duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-spring)]">
                  <Image
                    src={tool.logoUrl!}
                    alt={tool.name!}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <h3 className="text-base font-bold text-white group-hover:text-[var(--dn-accent)] transition-colors duration-[var(--dn-duration-fast)] truncate">
                      {tool.name}
                    </h3>
                    {tool.isVerified && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest text-[var(--dn-accent)] bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] flex-shrink-0">
                        <CheckCircle size={10} weight="duotone" />
                        VERIFIED
                      </span>
                    )}
                    {tool.isFeatured && (
                      <Crown
                        size={14}
                        weight="duotone"
                        className="text-[var(--dn-warning)] flex-shrink-0"
                      />
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-[12px] text-[var(--dn-text-secondary)] line-clamp-2 leading-relaxed mb-6">
                {tool.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.06] relative z-10">
                <div className="flex items-center gap-3">
                  <PricingBadge pricing={tool.pricing!} />
                  <span className="text-[10px] font-mono text-[var(--dn-text-muted)] group-hover:text-white/60 transition-colors">
                    {tool.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.03] px-2 py-1 rounded border border-white/[0.04]">
                  <Star size={12} weight="fill" className="text-[var(--dn-warning)]" />
                  <span className="text-[11px] text-white font-semibold">
                    {tool.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default function TrendingTools({ tools }: { tools?: Partial<Tool>[] }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const reduceMotion = useReducedMotion();

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

  // Server-provided tools (SSR); fall back to the seed set if Firestore is empty.
  const data = tools && tools.length ? tools : demoTools;

  const filtered = data.filter((tool) => {
    const matchesSearch =
      !search ||
      tool.name!.toLowerCase().includes(search.toLowerCase()) ||
      tool.description!.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" || tool.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="relative w-full z-20" style={{ backgroundColor: "var(--dn-bg)" }}>
      <div className="dn-container">
        
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 mb-4">
               <span className="w-1.5 h-1.5 rounded-full bg-[var(--dn-accent)] shadow-[0_0_8px_var(--dn-accent)]" />
               <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--dn-text-muted)]">
                 The Stack
               </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2 drop-shadow-lg">
              AI Tool <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[var(--dn-accent)] to-[var(--dn-primary)]">Directory</span>
            </h2>
            <p className="text-sm md:text-base text-[var(--dn-text-secondary)] max-w-[45ch]">
              Curated collection of the best tools to automate your workflows.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div {...fadeUp(0.1)} className="flex flex-col sm:flex-row items-center gap-4 lg:pb-2">
            <div className="relative w-full sm:w-auto">
              <MagnifyingGlass
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--dn-text-muted)]"
              />
              <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 h-12 pl-11 pr-4 rounded-xl bg-[var(--dn-bg-card)] border border-[var(--dn-glass-border)]
                         text-sm text-white placeholder-[var(--dn-text-muted)]
                         focus:outline-none focus:border-[var(--dn-primary)] focus:ring-1 focus:ring-[var(--dn-primary)]
                         transition-all duration-[var(--dn-duration-fast)] shadow-[var(--dn-shadow-inset)]"
              />
            </div>

            <Link
              href="/tools"
              className="group hidden md:flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white/[0.03] text-xs font-semibold text-white border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-[var(--dn-duration-fast)]"
            >
              Browse All
              <ArrowUpRight size={14} className="group-hover:translate-x-[2px] group-hover:-translate-y-[2px] transition-transform text-[var(--dn-accent)]" />
            </Link>
          </motion.div>
        </div>
        
        {/* Filter Pills */}
        <motion.div {...fadeUp(0.15)} className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap
                        transition-all duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-out)] active:scale-[0.98] ${
                          activeFilter === tab
                            ? "bg-white text-black shadow-lg shadow-white/10"
                            : "bg-[var(--dn-bg-card)] border border-[var(--dn-glass-border)] text-[var(--dn-text-secondary)] hover:bg-white/[0.08] hover:text-white"
                        }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Tools Grid + Integrated Ad */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filtered.slice(0, 5).map((tool, i) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={i}
              reduceMotion={!!reduceMotion}
            />
          ))}

          {/* Integrated AdSlot filling the 6th spot */}
          <motion.div {...fadeUp(0.3)} className="h-full min-h-[160px]">
             <div className="glass-card h-full flex items-center justify-center relative overflow-hidden bg-[var(--dn-bg-section-elevated)] group">
               <div className="glass-core flex items-center justify-center relative">
                 <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />
                 <AdSlot id="home-tools-integrated" className="!my-0 !w-full !px-0" />
               </div>
             </div>
          </motion.div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                     border border-[var(--dn-glass-border)] bg-[var(--dn-bg-card)] text-xs font-semibold text-white
                     hover:bg-white/[0.08] transition-all duration-[var(--dn-duration-fast)]"
          >
            Browse all tools
            <ArrowUpRight size={14} className="text-[var(--dn-accent)]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
