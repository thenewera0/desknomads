"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lightning,
  Globe,
  Lightbulb,
  Users,
  Rocket,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react";

const ease = [0.32, 0.72, 0, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease },
});

const values = [
  {
    icon: Lightbulb,
    title: "Practical & Researched",
    description: "Every guide is researched and written to be genuinely useful — clear steps you can act on today.",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "#F59E0B",
  },
  {
    icon: Lightning,
    title: "Actionable Content",
    description: "No fluff. Every article includes clear next steps you can implement today.",
    gradient: "from-purple-500/10 to-violet-500/10",
    iconColor: "#A855F7",
  },
  {
    icon: Globe,
    title: "Location Independent",
    description: "We help you build income streams that work from anywhere in the world.",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "#10B981",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We're building a community of ambitious nomads, creators, and builders.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "#3B82F6",
  },
];

const stats = [
  { value: "60+", label: "In-Depth Guides", color: "var(--dn-primary)" },
  { value: "Daily", label: "Fresh Content", color: "var(--dn-success)" },
  { value: "Free", label: "Always Free to Read", color: "var(--dn-accent)" },
  { value: "AI + Remote", label: "Our Focus", color: "var(--dn-warning)" },
];

const topics = [
  "AI Tools & Software Reviews",
  "Remote Job Opportunities",
  "Passive Income Strategies",
  "Automation & Workflows",
  "Digital Product Creation",
  "Productivity Systems",
  "Freelancing & Side Hustles",
  "Future of Work & Careers",
];

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-var(--dn-nav-height))] py-12 md:py-16">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, rgba(96,165,250,0.3) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="dn-container max-w-4xl relative z-10">
        {/* Breadcrumb */}
        <motion.nav
          {...fadeUp(0)}
          className="flex items-center gap-2 text-xs text-[var(--dn-text-muted)] mb-10"
        >
          <Link href="/" className="hover:text-white transition-colors duration-300">Home</Link>
          <span className="opacity-40">/</span>
          <span className="text-[var(--dn-text-secondary)]">About</span>
        </motion.nav>

        {/* Hero */}
        <div className="text-center mb-20">
          <motion.div {...fadeUp(0.05)} className="mb-5">
            <span
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px]
                       font-medium uppercase tracking-[0.18em] text-[var(--dn-accent)]
                       bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.15)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--dn-accent)] animate-pulse" />
              About DeskNomads
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5 leading-[1.1]"
          >
            Smart Tools. Remote Freedom.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--dn-primary)] to-[var(--dn-accent)]">
              Future Income.
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.15)}
            className="text-base md:text-lg text-[var(--dn-text-secondary)] max-w-[55ch] mx-auto leading-relaxed"
          >
            DeskNomads is a publishing platform helping ambitious professionals discover
            the best AI tools, remote work opportunities, and online income strategies.
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...fadeUp(0.1 + i * 0.06)}
              className="group p-6 rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)]
                       text-center hover:border-white/[0.1] hover:bg-[var(--dn-bg-card-hover)]
                       transition-all duration-500 ease-[var(--dn-ease)]"
            >
              <div
                className="text-3xl font-bold tracking-tight mb-1 transition-colors duration-500"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-[12px] text-[var(--dn-text-muted)]">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <motion.div
          {...fadeUp(0)}
          className="rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-8 md:p-10 mb-20
                   hover:border-white/[0.1] transition-all duration-500"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--dn-primary)]/20 to-[var(--dn-accent)]/10 flex items-center justify-center">
              <Rocket size={22} className="text-[var(--dn-accent)]" />
            </div>
            <h2 className="text-xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-[15px] text-[var(--dn-text-secondary)] leading-[1.85] mb-5">
            The future of work is here. AI is reshaping every industry, remote work is the new default,
            and side hustles are becoming primary income streams. But with so much noise,
            it&apos;s hard to know what actually works.
          </p>
          <p className="text-[15px] text-[var(--dn-text-secondary)] leading-[1.85]">
            DeskNomads cuts through the hype. We research tools, break down platforms, and share practical
            strategies that help you earn more, work less, and build a location-independent lifestyle.
            Every article is written with one question in mind: <strong className="text-white">
            &quot;Is this actually useful?&quot;</strong>
          </p>
        </motion.div>

        {/* Values */}
        <motion.h2 {...fadeUp(0)} className="text-xl font-bold text-white mb-6">
          What We Stand For
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                {...fadeUp(0.05 + i * 0.06)}
                className="group flex gap-4 p-6 rounded-2xl border border-white/[0.06]
                         bg-[var(--dn-bg-card)] hover:border-white/[0.1] hover:bg-[var(--dn-bg-card-hover)]
                         transition-all duration-500 ease-[var(--dn-ease)]"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                           transition-transform duration-500 group-hover:scale-110"
                  style={{ background: `${value.iconColor}15` }}
                >
                  <Icon size={22} style={{ color: value.iconColor }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{value.title}</h3>
                  <p className="text-[13px] text-[var(--dn-text-muted)] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* What We Cover */}
        <motion.h2 {...fadeUp(0)} className="text-xl font-bold text-white mb-6">
          What We Cover
        </motion.h2>
        <motion.div
          {...fadeUp(0.05)}
          className="rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-7 mb-20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {topics.map((topic, i) => (
              <motion.div
                key={topic}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04, ease }}
                className="flex items-center gap-2.5 text-[13px] text-[var(--dn-text-secondary)]
                         hover:text-white transition-colors duration-300 cursor-default"
              >
                <CheckCircle size={16} weight="fill" className="text-[var(--dn-success)] flex-shrink-0" />
                {topic}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          {...fadeUp(0)}
          className="text-center rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-10
                   hover:border-white/[0.1] transition-all duration-500"
        >
          <h2 className="text-xl font-bold text-white mb-3">Stay in the Loop</h2>
          <p className="text-sm text-[var(--dn-text-muted)] mb-6 max-w-sm mx-auto">
            Get our latest AI tool picks, income ideas, and remote work tips — straight to your inbox.
          </p>
          <Link
            href="/newsletter"
            className="group inline-flex h-11 px-7 rounded-full bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                     text-white text-sm font-medium items-center gap-2
                     transition-all duration-500 ease-[var(--dn-ease)]
                     active:scale-[0.97] shadow-[0_0_30px_rgba(59,130,246,0.2)]
                     hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
          >
            Subscribe to Newsletter
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
