"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Newspaper } from "@phosphor-icons/react";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const ease = [0.16, 1, 0.3, 1] as const; // Premium cubic bezier

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 } as const,
          animate: { opacity: 1, y: 0 } as const,
          transition: {
            duration: 0.8,
            delay,
            ease,
          },
        };

  return (
    <section className="relative min-h-[75dvh] flex items-center justify-center overflow-hidden py-24 md:py-36">
      {/* Subtle radial ambient background light */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="dn-container relative z-10 text-center max-w-4xl">
        {/* Eyebrow */}
        <motion.div {...fadeUp(0.1)} className="mb-6">
          <span
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px]
                     font-semibold uppercase tracking-[0.2em] text-[var(--dn-accent)]
                     bg-white/[0.02] border border-white/[0.05]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--dn-accent)]" />
            Smart Tools. Remote Freedom. Future Income.
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.2)}
          className="text-4xl md:text-5xl lg:text-[4.25rem] font-extrabold tracking-[-0.03em] leading-[1.08] text-white mb-6"
        >
          AI Tools, Remote Jobs
          <br />
          <span className="font-serif italic font-normal text-[var(--dn-accent)]">
            &amp; Passive Income
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.3)}
          className="text-base md:text-lg text-[var(--dn-text-secondary)] leading-relaxed max-w-[56ch] mx-auto mb-10"
        >
          Discover the best AI tools, work-from-home opportunities,
          automation systems, and online income strategies. India&apos;s leading publication for creators.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/category/ai-tools"
            className="group h-11 px-6 rounded-lg bg-white text-black hover:bg-neutral-200
                     text-xs font-semibold inline-flex items-center gap-2.5
                     transition-all duration-200 active:scale-[0.98]"
          >
            Explore Articles
            <ArrowRight size={13} weight="light" className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
          <Link
            href="/newsletter"
            className="group h-11 px-6 rounded-lg border border-white/[0.08] hover:border-white/[0.15]
                     text-white text-xs font-semibold inline-flex items-center gap-2.5
                     hover:bg-white/[0.02] transition-all duration-200 active:scale-[0.98]"
          >
            <Newspaper size={14} weight="light" />
            Join Newsletter
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp(0.5)}
          className="flex items-center justify-center gap-12 md:gap-16 border-t border-white/[0.05] pt-10 max-w-xl mx-auto"
        >
          {[
            { value: "500+", label: "Articles" },
            { value: "200+", label: "AI Tools" },
            { value: "50K+", label: "Readers" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--dn-text-muted)] mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
