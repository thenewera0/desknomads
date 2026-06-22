"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnvelopeSimple,
  CheckCircle,
  SpinnerGap,
  Lightning,
  Robot,
  Briefcase,
  CurrencyDollar,
  Star,
  ShieldCheck,
} from "@phosphor-icons/react";

const ease = [0.32, 0.72, 0, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

const benefits = [
  { icon: Robot, text: "Weekly AI tool picks & reviews", color: "#3B82F6" },
  { icon: CurrencyDollar, text: "Passive income strategies that work", color: "#F59E0B" },
  { icon: Briefcase, text: "Curated remote job opportunities", color: "#22C55E" },
  { icon: Lightning, text: "Automation tips to save 10+ hrs/week", color: "#A855F7" },
];

const testimonials = [
  { name: "Ravi K.", role: "Freelancer", text: "DeskNomads helped me discover tools that tripled my output." },
  { name: "Sarah M.", role: "Remote Worker", text: "The newsletter is my Thursday morning ritual. Always actionable." },
  { name: "Alex T.", role: "Creator", text: "Found my first $5K/month passive income stream through their guides." },
];

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] py-16 md:py-24">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)", filter: "blur(90px)" }}
        />
      </div>

      <div className="dn-container max-w-5xl relative z-10">
        {/* Breadcrumb */}
        <motion.nav
          {...fadeUp(0)}
          className="flex items-center gap-2 text-xs text-[var(--dn-text-muted)] mb-12"
        >
          <Link href="/" className="hover:text-white transition-colors duration-300">Home</Link>
          <span className="opacity-40">/</span>
          <span className="text-[var(--dn-text-secondary)]">Newsletter</span>
        </motion.nav>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          
          {/* Left Column: Headline and Benefits */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div
              {...fadeUp(0.05)}
              className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.05]
                       flex items-center justify-center mb-6"
            >
              <EnvelopeSimple size={22} weight="light" className="text-[var(--dn-accent)]" />
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
            >
              Join the DeskNomads
              <br />
              <span className="font-serif italic font-normal text-[var(--dn-accent)]">
                Inner Circle
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.15)}
              className="text-sm md:text-base text-[var(--dn-text-secondary)] leading-relaxed mb-8 max-w-[42ch]"
            >
              Get weekly insights on the best AI tools, remote job listings,
              automation strategies, and passive income guides delivered directly to your inbox every Thursday.
            </motion.p>

            {/* Benefits Checklist */}
            <motion.div {...fadeUp(0.2)} className="space-y-4">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.text} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-[var(--dn-accent)] animate-glow-pulse">
                      <Icon size={14} weight="light" style={{ color: b.color }} />
                    </span>
                    <span className="text-xs md:text-sm text-[var(--dn-text-secondary)]">
                      {b.text}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-7">
            <motion.div
              {...fadeUp(0.25)}
              className="rounded-2xl border border-white/[0.05] bg-[var(--dn-bg-card)] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease }}
                    className="text-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-[var(--dn-success)]/10 flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle size={32} weight="light" className="text-[var(--dn-success)]" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-white mb-2">You&apos;re In! 🎉</h2>
                    <p className="text-xs md:text-sm text-[var(--dn-text-muted)] max-w-xs mx-auto leading-relaxed">
                      Check your email for a confirmation. Welcome to the DeskNomads community!
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold text-[var(--dn-text-muted)] uppercase tracking-wider block mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="w-full h-11 px-4 rounded-lg bg-white/[0.03] border border-white/[0.06]
                                   text-sm text-white placeholder-white/[0.15]
                                   focus:outline-none focus:border-[var(--dn-primary)] focus:ring-1 focus:ring-[var(--dn-primary)]/20
                                   transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-[var(--dn-text-muted)] uppercase tracking-wider block mb-2">
                          Email Address <span className="text-[var(--dn-accent)]">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="you@example.com"
                          className="w-full h-11 px-4 rounded-lg bg-white/[0.03] border border-white/[0.06]
                                   text-sm text-white placeholder-white/[0.15]
                                   focus:outline-none focus:border-[var(--dn-primary)] focus:ring-1 focus:ring-[var(--dn-primary)]/20
                                   transition-all duration-300"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full h-11 rounded-lg bg-white text-black hover:bg-neutral-200
                               text-xs font-semibold flex items-center justify-center gap-2
                               transition-all duration-200 active:scale-[0.98] cursor-pointer
                               disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <>
                          <SpinnerGap size={14} weight="light" className="animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        "Subscribe — It's Free"
                      )}
                    </button>

                    <AnimatePresence>
                      {status === "error" && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-center text-[11px] text-[var(--dn-danger)]"
                        >
                          Something went wrong. Please try again.
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-center gap-4 text-[10px] text-[var(--dn-text-muted)] pt-2 border-t border-white/[0.04]">
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={12} weight="light" className="text-[var(--dn-success)]" />
                        No spam
                      </span>
                      <span>•</span>
                      <span>Unsubscribe anytime</span>
                      <span>•</span>
                      <span>3,800+ readers</span>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="border-t border-white/[0.04] pt-16"
        >
          <p className="text-center text-xs font-mono uppercase tracking-wider text-[var(--dn-text-muted)] mb-8">What readers say</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease }}
                className="group flex flex-col h-full"
              >
                <div className="p-6 rounded-xl border border-white/[0.05] bg-[var(--dn-bg-card)] hover:border-white/[0.1] transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={11} weight="light" className="text-[var(--dn-warning)]" />
                      ))}
                    </div>
                    <p className="text-[12px] text-[var(--dn-text-secondary)] leading-relaxed mb-4">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-white">{t.name}</p>
                    <p className="text-[9px] text-[var(--dn-text-muted)] uppercase tracking-wider mt-0.5">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
