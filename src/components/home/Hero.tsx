"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, EnvelopeSimple } from "@phosphor-icons/react";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const ease = [0.16, 1, 0.3, 1] as const;

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24, filter: "blur(8px)" } as const,
          animate: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
          transition: {
            duration: 1.2,
            delay,
            ease,
          },
        };

  return (
    <section className="relative min-h-[90dvh] flex flex-col items-center justify-center overflow-hidden pt-32 pb-24 md:pt-48 md:pb-32 bg-[var(--dn-bg)]">
      {/* Immersive mesh glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-[0.12]"
          style={{
            background: "radial-gradient(ellipse, rgba(59,130,246,0.5) 0%, rgba(96,165,250,0.15) 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="dn-container relative z-10 flex flex-col items-center text-center max-w-5xl">
        {/* Eyebrow badge (Double-bezel tiny) */}
        <motion.div {...fadeUp(0.1)} className="mb-8">
          <div className="p-[3px] rounded-full bg-white/[0.02] border border-white/[0.04] shadow-[var(--dn-shadow-inset)]">
            <span
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[11px]
                       font-semibold uppercase tracking-[0.25em] text-[var(--dn-accent)]
                       bg-white/[0.03] border border-white/[0.02]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--dn-accent)] shadow-[0_0_8px_var(--dn-accent)]" />
              Smart Tools. Remote Freedom.
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.2)}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-[-0.04em] leading-[1.05] text-white mb-8 drop-shadow-2xl"
        >
          AI Tools, Remote Jobs
          <br />
          <span className="font-serif italic font-normal text-[var(--dn-accent)]">
            &amp; Future Income
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.3)}
          className="text-lg md:text-xl text-[var(--dn-text-secondary)] leading-relaxed max-w-[50ch] mx-auto mb-14"
        >
          Discover the definitive strategies for leveraging AI tools, building automated income streams, and designing a borderless career.
        </motion.p>

        {/* CTAs (Nested Island Architecture) */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24"
        >
          <Link
            href="/category/ai-tools"
            className="group relative inline-flex items-center gap-4 pl-7 pr-2 py-2 rounded-full bg-white text-black 
                     font-semibold tracking-wide text-sm transition-all duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-out)]
                     active:scale-[0.97] shadow-xl hover:shadow-2xl hover:shadow-white/20"
          >
            Explore Articles
            <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-spring)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-110">
              <ArrowRight size={15} weight="bold" />
            </div>
          </Link>
          
          <Link
            href="/newsletter"
            className="group relative inline-flex items-center gap-4 pl-7 pr-2 py-2 rounded-full bg-white/[0.03] text-white
                     border border-white/[0.08] font-semibold tracking-wide text-sm transition-all duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-out)]
                     hover:bg-white/[0.06] hover:border-white/[0.15] active:scale-[0.97]"
          >
            Join Newsletter
            <div className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center transition-transform duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-spring)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-110">
              <EnvelopeSimple size={15} weight="bold" />
            </div>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp(0.5)}
          className="flex items-center justify-center gap-16 md:gap-24 max-w-2xl mx-auto"
        >
          {[
            { value: "500+", label: "Articles" },
            { value: "200+", label: "AI Tools" },
            { value: "50K+", label: "Readers" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2 drop-shadow-md">
                {stat.value}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-[var(--dn-text-muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
