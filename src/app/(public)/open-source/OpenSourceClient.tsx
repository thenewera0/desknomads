"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowUpRight, 
  GithubLogo, 
  Crown, 
  RocketLaunch,
  Cpu, 
  CodeBlock, 
  Network, 
  PaintBrush, 
  Database, 
  MagicWand, 
  ImageSquare, 
  ChatTeardropText, 
  BookOpenText
} from "@phosphor-icons/react";

import { resourceCategories } from "@/data/openSourceResources";

const categoryIcons = [
  Cpu,
  CodeBlock,
  Network,
  PaintBrush,
  Database,
  MagicWand,
  ImageSquare,
  ChatTeardropText,
  BookOpenText
];

export default function OpenSourceClient() {
  return (
    <div className="min-h-screen w-full relative pt-32 md:pt-48 pb-32" style={{ backgroundColor: "var(--dn-bg)" }}>
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-16 md:mb-24 z-10 pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--dn-bg-card)] border border-[var(--dn-glass-border)] text-white text-xs font-semibold mb-6 shadow-[var(--dn-shadow-inset)]">
            <Crown weight="fill" className="text-[var(--dn-accent)]" />
            <span className="tracking-widest uppercase text-[10px]">Hidden Gems & Resources</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-none">
            Ultimate Resources <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--dn-accent)] to-[var(--dn-primary)] italic font-serif font-normal">Hub</span>
          </h1>
          <p className="text-sm md:text-base text-[var(--dn-text-secondary)] mb-8 max-w-[50ch] mx-auto">
            The best 100% free, open-source AI tools, frameworks, guides, databases, and UI assets curated for developers and creators. No paywalls, just pure value.
          </p>
        </motion.div>
      </section>

      {/* Grid Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 flex flex-col gap-20">
        {resourceCategories.map((category, catIndex) => (
          <div key={category.title} className="flex flex-col gap-8">
            {/* Category Header */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5 }}
              className="border-l-4 border-[var(--dn-accent)] pl-4 flex items-start gap-4"
            >
              <div className="hidden sm:flex shrink-0 p-3 bg-white/[0.03] rounded-xl border border-white/[0.05] mt-1 shadow-[var(--dn-shadow-inset)]">
                {(() => {
                  const Icon = categoryIcons[catIndex] || Crown;
                  return <Icon size={24} weight="duotone" className="text-[var(--dn-accent)]" />;
                })()}
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{category.title}</h2>
                <p className="text-[var(--dn-text-secondary)] text-sm md:text-base max-w-2xl">{category.description}</p>
              </div>
            </motion.div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {category.items.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: (i % 6) * 0.1 }}
                  className="h-full"
                >
                  <div className="glass-card h-full flex flex-col group hover:bg-white/[0.04] transition-colors duration-[var(--dn-duration)]">
                    <div className="glass-core relative p-6 h-full flex flex-col items-start justify-between">
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                           style={{ background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 70%)' }} />

                      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-all duration-[var(--dn-duration)] -translate-y-4 group-hover:translate-y-0 translate-x-4 group-hover:translate-x-0 z-0">
                        <RocketLaunch size={80} weight="duotone" className="text-[var(--dn-accent)]" />
                      </div>
                      
                      <div className="flex-grow z-10 w-full mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.05] flex items-center justify-center mb-4 shadow-[var(--dn-shadow-inset)] group-hover:border-[var(--dn-accent)]/30 transition-colors duration-[var(--dn-duration-fast)]">
                           {(() => {
                             const Icon = categoryIcons[catIndex] || Crown;
                             return <Icon size={24} weight="duotone" className="text-[var(--dn-accent)]" />;
                           })()}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--dn-accent)] transition-colors duration-[var(--dn-duration-fast)]">
                          {tool.name}
                        </h3>
                        <p className="text-[13px] text-[var(--dn-text-secondary)] leading-relaxed">
                          {tool.description}
                        </p>
                      </div>

                      <div className="z-10 w-full mt-auto">
                        <div className="flex flex-wrap gap-2 mb-6">
                          {tool.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] uppercase tracking-widest font-bold text-[var(--dn-text-muted)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-3 pt-5 border-t border-[var(--dn-glass-border)]">
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--dn-bg-card)] border border-[var(--dn-glass-border)] text-white rounded-xl text-xs font-semibold hover:bg-white/[0.08] transition-colors group/btn shadow-[var(--dn-shadow-inset)]"
                          >
                            Visit Website
                            <ArrowUpRight weight="bold" className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </a>
                          <a
                            href={tool.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 text-[var(--dn-text-muted)] bg-[var(--dn-bg-card)] hover:bg-white/[0.08] hover:text-white border border-[var(--dn-glass-border)] rounded-xl transition-colors shadow-[var(--dn-shadow-inset)]"
                            aria-label="GitHub Repository"
                          >
                            <GithubLogo size={18} weight="fill" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
