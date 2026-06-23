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
  {
    id: "6",
    name: "Copy.ai",
    slug: "copy-ai",
    description: "Generate marketing copy, emails, and social posts with AI",
    logoUrl: "https://picsum.photos/seed/copyai-logo/80/80",
    category: "AI Writing",
    pricing: "freemium",
    rating: 4.3,
    isFeatured: false,
    isVerified: true,
    tags: ["Copywriting", "Marketing", "Email"],
  },
];

const filterTabs = ["All", "AI Writing", "AI Image", "AI Video", "Productivity"];

function PricingBadge({ pricing }: { pricing: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    free: { bg: "rgba(34,197,94,0.06)", text: "var(--dn-success)" },
    freemium: { bg: "rgba(59,130,246,0.06)", text: "var(--dn-accent)" },
    paid: { bg: "rgba(245,158,11,0.06)", text: "var(--dn-warning)" },
  };
  const s = styles[pricing] || styles.freemium;
  return (
    <span
      className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
      style={{ background: s.bg, color: s.text }}
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
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={reduceMotion ? {} : { y: -3 }}
      whileTap={reduceMotion ? {} : { scale: 0.98 }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex"
    >
      <a href={tool.url || "#"} target="_blank" rel="noopener noreferrer" className="group flex flex-col w-full h-full">
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex-1 p-5 rounded-xl border border-white/[0.05]
                   bg-[#0E1624] hover:bg-white/[0.02] hover:border-white/[0.1]
                   transition-all duration-300 ease-[var(--dn-ease-out)]
                   flex flex-col justify-between overflow-hidden"
        >
          {/* Spotlight cursor glow */}
          {!reduceMotion && isHovered && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-200"
              style={{
                background: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, rgba(59, 130, 246, 0.08), transparent 80%)`,
              }}
            />
          )}

          <div className="relative z-10 flex items-start gap-4">
            {/* Logo */}
            <div className="w-11 h-11 rounded-lg overflow-hidden bg-white/[0.04] flex-shrink-0 border border-white/[0.06]">
              <Image
                src={tool.logoUrl!}
                alt={tool.name!}
                width={44}
                height={44}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <h3 className="text-sm font-semibold text-white group-hover:text-[var(--dn-accent)] transition-colors duration-300 truncate">
                  {tool.name}
                </h3>
                {tool.isVerified && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold tracking-wider text-[var(--dn-accent)] bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.1)] flex-shrink-0">
                    <CheckCircle size={9} weight="light" />
                    VERIFIED
                  </span>
                )}
                {tool.isFeatured && (
                  <Crown
                    size={12}
                    weight="light"
                    className="text-[var(--dn-warning)] flex-shrink-0"
                  />
                )}
              </div>
              <p className="text-[11px] text-[var(--dn-text-secondary)] line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04] relative z-10">
            <div className="flex items-center gap-2">
              <PricingBadge pricing={tool.pricing!} />
              <span className="text-[10px] font-mono text-[var(--dn-text-muted)]">
                {tool.category}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={11} weight="light" className="text-[var(--dn-warning)]" />
              <span className="text-[11px] text-[var(--dn-text-secondary)] font-medium">
                {tool.rating}
              </span>
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
    <section 
      className="py-24 md:py-32 border-t border-b border-white/[0.04]"
      style={{
        backgroundColor: "#070E1A", // Alternates background tone
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
          style={{ marginBottom: "40px" }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              AI Tool <span className="font-serif italic font-normal text-[var(--dn-accent)]">Directory</span>
            </h2>
            <p className="text-xs text-[var(--dn-text-muted)] uppercase tracking-wider">
              Curated collection of the best AI tools
            </p>
          </div>
          <Link
            href="/tools"
            className="hidden md:flex items-center gap-1 text-xs font-semibold text-[var(--dn-accent)]
                     hover:text-white transition-colors duration-300"
          >
            Browse all tools
            <ArrowUpRight size={13} weight="light" />
          </Link>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row gap-4"
          style={{ marginBottom: "40px" }}
        >
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass
              size={15}
              weight="light"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dn-text-muted)]"
            />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-[var(--dn-bg-card)] border border-white/[0.05]
                       text-sm text-white placeholder-[var(--dn-text-muted)]
                       focus:outline-none focus:border-[var(--dn-primary)] focus:ring-1 focus:ring-[var(--dn-primary)]
                       transition-all duration-300"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap
                          transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.98] ${
                            activeFilter === tab
                              ? "bg-white text-black"
                              : "bg-white/[0.04] text-[var(--dn-text-secondary)] hover:bg-white/[0.08] hover:text-white"
                          }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tool, i) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={i}
              reduceMotion={!!reduceMotion}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 px-5 py-2.5 rounded-lg
                     border border-white/[0.1] text-xs text-[var(--dn-accent)]
                     hover:bg-white/[0.02] transition-all duration-300"
          >
            Browse all tools
            <ArrowUpRight size={13} weight="light" />
          </Link>
        </div>
      </div>
    </section>
  );
}
