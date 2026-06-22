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
    color: "#22C55E",
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
    >
      <Link href={`/category/${cat.slug}`} className="group block">
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative p-5 md:p-6 rounded-xl border border-white/[0.05]
                   bg-[#0E1624] hover:bg-white/[0.02] hover:border-white/[0.1]
                   transition-all duration-300 ease-[var(--dn-ease-out)]
                   overflow-hidden"
        >
          {/* Glow effect on hover */}
          {!reduceMotion && isHovered && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-200"
              style={{
                background: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, ${cat.color}10, transparent 80%)`,
              }}
            />
          )}

          {/* Static subtle background glow fallback */}
          <div
            className="absolute inset-0 opacity-30 group-hover:opacity-80
                     transition-opacity duration-200 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${cat.color}05, transparent 70%)`,
            }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-4
                       transition-transform duration-200 ease-[var(--dn-ease-out)]
                       group-hover:scale-105"
              style={{
                background: `${cat.color}10`,
                border: `1px solid ${cat.color}15`,
              }}
            >
              <Icon size={18} weight="light" style={{ color: cat.color }} />
            </div>

            {/* Name */}
            <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-[var(--dn-accent)] transition-colors duration-300">
              {cat.name}
            </h3>

            {/* Count */}
            <p className="text-[10px] font-mono text-[var(--dn-text-muted)]">
              {cat.articleCount} articles
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Categories() {
  const reduceMotion = useReducedMotion();

  return (
    <section 
      className="py-24 md:py-32"
      style={{
        backgroundColor: "#040B17", // Alternates with Trending
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
          className="text-center animate-fade-in-up"
          style={{ marginBottom: "56px" }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">
            Browse by <span className="font-serif italic font-normal text-[var(--dn-accent)]">Topic</span>
          </h2>
          <p className="text-xs text-[var(--dn-text-secondary)] uppercase tracking-wider max-w-[45ch] mx-auto">
            Deep-dive into the categories that matter most
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
