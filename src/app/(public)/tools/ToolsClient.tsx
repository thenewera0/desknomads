"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  MagnifyingGlass,
  ArrowUpRight,
  Star,
  Crown,
  CheckCircle,
  Sparkle,
  Tag,
  RocketLaunch,
} from "@phosphor-icons/react";
import type { Tool } from "@/types";

// Demo data for directory
const allTools: Partial<Tool>[] = [
  {
    id: "1",
    name: "ChatGPT",
    slug: "chatgpt",
    description: "Advanced AI chatbot for writing, coding, analysis, and general productivity.",
    logoUrl: "https://picsum.photos/seed/chatgpt-logo/80/80",
    category: "AI Writing",
    pricing: "freemium",
    rating: 4.8,
    isFeatured: true,
    isVerified: true,
    tags: ["Writing", "Coding", "Research"],
    url: "https://chatgpt.com",
  },
  {
    id: "2",
    name: "Midjourney",
    slug: "midjourney",
    description: "State-of-the-art AI-powered image generation from natural language descriptions.",
    logoUrl: "https://picsum.photos/seed/midjourney-logo/80/80",
    category: "AI Image",
    pricing: "paid",
    rating: 4.7,
    isFeatured: true,
    isVerified: true,
    tags: ["Image", "Design", "Art"],
    url: "https://midjourney.com",
  },
  {
    id: "3",
    name: "Notion AI",
    slug: "notion-ai",
    description: "Intelligent assistant built directly into Notion for note-taking, docs, and project management.",
    logoUrl: "https://picsum.photos/seed/notion-logo/80/80",
    category: "Productivity",
    pricing: "freemium",
    rating: 4.5,
    isFeatured: false,
    isVerified: true,
    tags: ["Productivity", "Notes", "Writing"],
    url: "https://notion.so",
  },
  {
    id: "4",
    name: "Jasper",
    slug: "jasper",
    description: "Enterprise-grade AI content creation platform for marketing teams and copywriters.",
    logoUrl: "https://picsum.photos/seed/jasper-logo/80/80",
    category: "AI Writing",
    pricing: "paid",
    rating: 4.4,
    isFeatured: false,
    isVerified: true,
    tags: ["Marketing", "Content", "Copy"],
    url: "https://jasper.ai",
  },
  {
    id: "5",
    name: "Descript",
    slug: "descript",
    description: "AI-first video and podcast editing platform with transcript-based editing, voice cloning, and audio cleanup.",
    logoUrl: "https://picsum.photos/seed/descript-logo/80/80",
    category: "AI Video",
    pricing: "freemium",
    rating: 4.6,
    isFeatured: true,
    isVerified: true,
    tags: ["Video", "Audio", "Editing"],
    url: "https://descript.com",
  },
  {
    id: "6",
    name: "Copy.ai",
    slug: "copy-ai",
    description: "Generate high-converting marketing copy, sales emails, and social media posts with AI workflows.",
    logoUrl: "https://picsum.photos/seed/copyai-logo/80/80",
    category: "AI Writing",
    pricing: "freemium",
    rating: 4.3,
    isFeatured: false,
    isVerified: true,
    tags: ["Copywriting", "Marketing", "Email"],
    url: "https://copy.ai",
  },
  {
    id: "7",
    name: "v0 by Vercel",
    slug: "v0-vercel",
    description: "Generative UI system by Vercel that creates production-ready React/Tailwind code from text prompts.",
    logoUrl: "https://picsum.photos/seed/v0-logo/80/80",
    category: "Development",
    pricing: "freemium",
    rating: 4.9,
    isFeatured: true,
    isVerified: true,
    tags: ["Coding", "Frontend", "React"],
    url: "https://v0.dev",
  },
  {
    id: "8",
    name: "ElevenLabs",
    slug: "elevenlabs",
    description: "Hyper-realistic AI voice generator and text-to-speech engine with multilingual capabilities.",
    logoUrl: "https://picsum.photos/seed/eleven-logo/80/80",
    category: "AI Voice",
    pricing: "freemium",
    rating: 4.8,
    isFeatured: true,
    isVerified: true,
    tags: ["Voice", "Audio", "AI Cloning"],
    url: "https://elevenlabs.io",
  },
  {
    id: "9",
    name: "Sunsama",
    slug: "sunsama",
    description: "Daily planner that helps you pull tasks from all tools and organize your day mindfully.",
    logoUrl: "https://picsum.photos/seed/sunsama-logo/80/80",
    category: "Productivity",
    pricing: "paid",
    rating: 4.6,
    isFeatured: false,
    isVerified: false,
    tags: ["Productivity", "Planner", "Calendar"],
    url: "https://sunsama.com",
  },
];

const categories = ["All", "AI Writing", "AI Image", "AI Video", "AI Voice", "Productivity", "Development"];
const pricingModels = ["All", "Free", "Freemium", "Paid"];
const ease = [0.32, 0.72, 0, 1] as const;

function PricingBadge({ pricing }: { pricing: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    free: { bg: "rgba(34,197,94,0.08)", text: "var(--dn-success)" },
    freemium: { bg: "rgba(59,130,246,0.08)", text: "var(--dn-accent)" },
    paid: { bg: "rgba(245,158,11,0.08)", text: "var(--dn-warning)" },
  };
  const s = styles[pricing] || styles.freemium;
  return (
    <span
      className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border"
      style={{ background: s.bg, color: s.text, borderColor: s.text + "20" }}
    >
      {pricing}
    </span>
  );
}

export default function ToolsDirectoryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePricing, setActivePricing] = useState("All");
  const [tools, setTools] = useState<Partial<Tool>[]>(allTools);
  const reduceMotion = useReducedMotion();

  // Load the real approved directory; keep the seed set if Firestore is empty.
  useEffect(() => {
    fetch("/api/tools?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (d.tools?.length) setTools(d.tools);
      })
      .catch(() => {});
  }, []);

  const filtered = tools.filter((tool) => {
    const matchesSearch =
      !search ||
      tool.name!.toLowerCase().includes(search.toLowerCase()) ||
      tool.description!.toLowerCase().includes(search.toLowerCase()) ||
      (tool.tags || []).some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    const matchesPricing = activePricing === "All" || tool.pricing === activePricing.toLowerCase();

    return matchesSearch && matchesCategory && matchesPricing;
  });

  return (
    <div className="min-h-[calc(100vh-var(--dn-nav-height))] py-12 md:py-16">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="dn-container relative z-10">
        {/* Header section */}
        <div className="max-w-3xl mb-12">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[var(--dn-accent)] bg-[var(--dn-primary)]/10 border border-[var(--dn-primary)]/20 mb-5 animate-pulse">
            <Sparkle size={12} weight="light" />
            Curated Directory
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Find the Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--dn-primary)] to-[var(--dn-accent)]">AI Tools</span> for Your Workflow
          </h1>
          <p className="text-base text-[var(--dn-text-secondary)] leading-relaxed">
            Boost your productivity, automate tasks, and construct your passive income stack with India&apos;s leading curated directory of top-tier AI software.
          </p>
        </div>

        {/* Directory Controls (Search & Filters) */}
        <div className="glass-card rounded-2xl p-6 mb-10 border border-white/[0.06] flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative group">
              <MagnifyingGlass
                size={18}
                weight="light"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dn-text-muted)] group-focus-within:text-[var(--dn-accent)] transition-colors duration-300"
              />
              <input
                type="text"
                placeholder="Search by tool name, capability, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.06]
                         text-sm text-white placeholder-[var(--dn-text-muted)]
                         focus:outline-none focus:border-[var(--dn-primary)] focus:ring-1 focus:ring-[var(--dn-primary)]
                         transition-all duration-300"
              />
            </div>

            {/* Pricing Model Filter */}
            <div className="md:col-span-6 flex justify-end gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs text-[var(--dn-text-muted)] font-medium self-center mr-2 hidden sm:inline">Pricing:</span>
              {pricingModels.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setActivePricing(opt)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap
                           transition-all duration-300 ${
                             activePricing === opt
                               ? "bg-[var(--dn-primary)] text-white"
                               : "bg-white/[0.04] text-[var(--dn-text-secondary)] hover:bg-white/[0.08] hover:text-white"
                           }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="border-t border-white/[0.04] pt-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap
                           transition-all duration-300 border ${
                             activeCategory === cat
                               ? "bg-[var(--dn-primary)]/10 text-[var(--dn-accent)] border-[var(--dn-primary)]/30"
                               : "bg-transparent text-[var(--dn-text-secondary)] border-transparent hover:text-white hover:bg-white/[0.04]"
                           }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          <AnimatePresence mode="popLayout">
            {filtered.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.04,
                  ease,
                }}
                className="group relative"
              >
                {/* Whole-card click target → opens the tool's site. Keeps the
                    "Visit site" cue below as a visual affordance. */}
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${tool.name}`}
                  className="absolute inset-0 z-20 rounded-[1.5rem]"
                />
                {/* Outer Shell */}
                <div className="p-1.5 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] transition-all duration-200 ease-[var(--dn-ease-out)] group-hover:border-white/[0.12] group-hover:bg-white/[0.04] h-full flex flex-col">
                  {/* Inner Core */}
                  <div
                    className="flex-1 p-5 rounded-[calc(1.5rem-0.375rem)] border border-white/[0.04]
                             bg-[var(--dn-bg-card)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]
                             flex flex-col justify-between"
                  >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      {/* Logo */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/[0.04] flex-shrink-0 border border-white/[0.08] relative">
                        <Image
                          src={tool.logoUrl!}
                          alt={tool.name!}
                          fill
                          className="object-cover"
                          sizes="56px"
                          unoptimized
                        />
                      </div>

                      {/* Title & Category */}
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3 className="text-base font-bold text-white group-hover:text-[var(--dn-accent)] transition-colors duration-300 truncate">
                            {tool.name}
                          </h3>
                          {tool.isVerified && (
                            <CheckCircle
                              size={15}
                              weight="light"
                              className="text-[var(--dn-accent)] flex-shrink-0"
                            />
                          )}
                          {tool.isFeatured && (
                            <Crown
                              size={14}
                              weight="light"
                              className="text-[var(--dn-warning)] flex-shrink-0"
                            />
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.02]">
                          {tool.category}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[13px] text-[var(--dn-text-secondary)] leading-relaxed mb-4 line-clamp-3">
                      {tool.description}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(tool.tags || []).map((tag) => (
                         <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] bg-white/[0.03] text-[var(--dn-text-muted)] flex items-center gap-1 border border-white/[0.02]"
                        >
                          <Tag size={8} weight="light" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <PricingBadge pricing={tool.pricing!} />
                        <div className="flex items-center gap-1">
                          <Star size={12} weight="light" className="text-[var(--dn-warning)]" />
                          <span className="text-xs font-semibold text-white">
                            {tool.rating}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-xs font-semibold text-[var(--dn-accent)] group-hover:text-white flex items-center gap-1 transition-colors duration-300"
                      >
                        Visit site
                        <ArrowUpRight size={12} weight="light" />
                      </span>
                    </div>
                  </div>
                </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Submit a Tool Section */}
        {/* Outer Shell Banner */}
        <div className="p-1.5 rounded-[1.75rem] bg-white/[0.02] border border-white/[0.06] mt-8">
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[calc(1.75rem-0.375rem)] border border-white/[0.04] bg-[var(--dn-bg-card)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
          >
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[var(--dn-primary)]/5 to-[var(--dn-accent)]/5" />
            <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--dn-accent)]/10 border border-[var(--dn-accent)]/20 flex items-center justify-center flex-shrink-0 text-[var(--dn-accent)] mt-0.5">
                  <RocketLaunch size={24} weight="light" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Are you building an AI product?
                  </h3>
                  <p className="text-sm text-[var(--dn-text-secondary)] max-w-xl">
                    Get your tool featured in front of 50K+ developers, content creators, and remote professionals looking to optimize their workflow.
                  </p>
                </div>
              </div>
              <Link
                href="/submit-tool"
                className="h-11 px-6 rounded-full bg-[var(--dn-accent)] hover:bg-[var(--dn-accent)]/90 text-[var(--dn-bg)] text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all duration-300"
              >
                Submit Your Tool
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
