"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  Robot,
  Briefcase,
  CurrencyDollar,
  Lightning,
  Package,
  Gauge,
  PenNib,
  Rocket,
} from "@phosphor-icons/react";

const categories = [
  {
    name: "AI Tools",
    slug: "ai-tools",
    description: "Best AI-powered software and platforms",
    icon: Robot,
    color: "#3B82F6",
    articleCount: 85,
  },
  {
    name: "Remote Jobs",
    slug: "remote-jobs",
    description: "Work from anywhere opportunities",
    icon: Briefcase,
    color: "#10B981",
    articleCount: 62,
  },
  {
    name: "Passive Income",
    slug: "passive-income",
    description: "Build income streams that work for you",
    icon: CurrencyDollar,
    color: "#F59E0B",
    articleCount: 48,
  },
  {
    name: "Automation",
    slug: "automation",
    description: "Automate repetitive tasks and workflows",
    icon: Lightning,
    color: "#A855F7",
    articleCount: 41,
  },
  {
    name: "Digital Products",
    slug: "digital-products",
    description: "Create and sell digital goods online",
    icon: Package,
    color: "#EC4899",
    articleCount: 35,
  },
  {
    name: "Productivity",
    slug: "productivity",
    description: "Work smarter, not harder",
    icon: Gauge,
    color: "#14B8A6",
    articleCount: 53,
  },
  {
    name: "Freelancing",
    slug: "freelancing",
    description: "Start and grow your freelance career",
    icon: PenNib,
    color: "#F97316",
    articleCount: 29,
  },
  {
    name: "Startups",
    slug: "startups",
    description: "Build and scale your startup",
    icon: Rocket,
    color: "#EF4444",
    articleCount: 22,
  },
];

interface CategoryCardProps {
  cat: typeof categories[number];
  index: number;
  reduceMotion: boolean;
}

function CategoryCard({ cat, index, reduceMotion }: CategoryCardProps) {
  const Icon = cat.icon;
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
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.9,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full"
    >
      <Link href={`/category/${cat.slug}`} className="group block h-full">
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="glass-card h-full flex flex-col group-hover:bg-white/[0.04] transition-colors duration-[var(--dn-duration)] p-1.5"
        >
          <div className="glass-core relative p-6 h-full flex flex-col items-start justify-between">
            {/* Glow effect on hover */}
            {!reduceMotion && isHovered && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-[var(--dn-duration-fast)]"
                style={{
                  background: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, ${cat.color}20, transparent 80%)`,
                }}
              />
            )}

            {/* Static subtle background glow fallback */}
            <div
              className="absolute inset-0 opacity-20 group-hover:opacity-40
                       transition-opacity duration-[var(--dn-duration)] pointer-events-none"
              style={{
                background: `radial-gradient(circle at 10% 10%, ${cat.color}15, transparent 60%)`,
              }}
            />

            <div className="relative z-10 w-full">
              {/* Header: Icon & Count */}
              <div className="flex items-center justify-between w-full mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center
                           transition-transform duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-spring)]
                           group-hover:scale-110 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${cat.color}20, ${cat.color}05)`,
                    border: `1px solid ${cat.color}30`,
                    boxShadow: `0 4px 12px ${cat.color}20, inset 0 1px 0 rgba(255,255,255,0.2)`,
                  }}
                >
                  <Icon size={20} weight="duotone" style={{ color: cat.color }} />
                </div>
                
                <span className="text-[10px] font-mono text-[var(--dn-text-muted)] group-hover:text-white/60 transition-colors">
                  {cat.articleCount}
                </span>
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--dn-accent)] transition-colors duration-[var(--dn-duration-fast)]">
                {cat.name}
              </h3>
              
              <p className="text-[11px] text-[var(--dn-text-secondary)] leading-relaxed line-clamp-2 pr-4">
                {cat.description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Categories() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 32, filter: "blur(8px)" } as const,
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
          viewport: { once: true, amount: 0.1 },
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
        };

  return (
    <section className="relative w-full z-20" style={{ backgroundColor: "var(--dn-bg)" }}>
      <div className="dn-container">
        {/* Section header */}
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 justify-center">
             <span className="w-1.5 h-1.5 rounded-full bg-[var(--dn-accent)] shadow-[0_0_8px_var(--dn-accent)]" />
             <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--dn-text-muted)]">
               Explore
             </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg">
            Browse by <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[var(--dn-accent)] to-[var(--dn-primary)]">Topic</span>
          </h2>
          <p className="text-sm md:text-base text-[var(--dn-text-secondary)] max-w-[45ch] mx-auto">
            Deep-dive into the core subjects shaping the future of digital independence.
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <CategoryCard
              key={cat.slug}
              cat={cat}
              index={i}
              reduceMotion={!!reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
