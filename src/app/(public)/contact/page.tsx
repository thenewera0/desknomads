"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  EnvelopeSimple,
  PaperPlaneTilt,
  CheckCircle,
  SpinnerGap,
  Clock,
} from "@phosphor-icons/react";

const ease = [0.32, 0.72, 0, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, delay, ease },
});

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-var(--dn-nav-height))] pt-32 md:pt-40 pb-12 md:pb-16">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="dn-container max-w-3xl relative z-10">
        {/* Breadcrumb */}
        <motion.nav
          {...fadeUp(0)}
          className="flex items-center gap-2 text-xs text-[var(--dn-text-muted)] mb-10"
        >
          <Link href="/" className="hover:text-white transition-colors duration-300">Home</Link>
          <span className="opacity-40">/</span>
          <span className="text-[var(--dn-text-secondary)]">Contact</span>
        </motion.nav>

        <motion.div {...fadeUp(0.05)}>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            Get in Touch
          </h1>
          <p className="text-base text-[var(--dn-text-secondary)] mb-12 max-w-[50ch]">
            Have a question, partnership proposal, or just want to say hello?
            We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
          {/* Contact Form */}
          <motion.div
            {...fadeUp(0.1)}
            className="rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-6 md:p-8
                     hover:border-white/[0.1] transition-all duration-500"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--dn-success)]/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} weight="fill" className="text-[var(--dn-success)]" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Message Sent! ✉️</h2>
                <p className="text-sm text-[var(--dn-text-muted)]">
                  We&apos;ll get back to you within 24-48 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-[var(--dn-text-muted)] uppercase tracking-wider block mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08]
                               text-sm text-white placeholder-white/[0.2]
                               focus:outline-none focus:border-[var(--dn-primary)] focus:ring-1 focus:ring-[var(--dn-primary)]/30
                               transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[var(--dn-text-muted)] uppercase tracking-wider block mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08]
                               text-sm text-white placeholder-white/[0.2]
                               focus:outline-none focus:border-[var(--dn-primary)] focus:ring-1 focus:ring-[var(--dn-primary)]/30
                               transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[var(--dn-text-muted)] uppercase tracking-wider block mb-1.5">
                    Subject
                  </label>
                  <select
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08]
                             text-sm text-white appearance-none cursor-pointer
                             focus:outline-none focus:border-[var(--dn-primary)] transition-all duration-300"
                  >
                    <option value="">Select a topic</option>
                    <option value="partnership">Partnership / Sponsorship</option>
                    <option value="guest-post">Guest Post</option>
                    <option value="tool-submission">Submit a Tool</option>
                    <option value="feedback">Feedback</option>
                    <option value="bug">Report a Bug</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[var(--dn-text-muted)] uppercase tracking-wider block mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]
                             text-sm text-white placeholder-white/[0.2] resize-none
                             focus:outline-none focus:border-[var(--dn-primary)] focus:ring-1 focus:ring-[var(--dn-primary)]/30
                             transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full h-11 rounded-xl bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                           text-white text-sm font-medium flex items-center justify-center gap-2
                           transition-all duration-500 active:scale-[0.98]
                           disabled:opacity-60 disabled:cursor-not-allowed
                           shadow-[0_0_24px_rgba(59,130,246,0.15)]
                           hover:shadow-[0_0_32px_rgba(59,130,246,0.25)]"
                >
                  {sending ? (
                    <>
                      <SpinnerGap size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperPlaneTilt size={16} weight="bold" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-4">
            <motion.div
              {...fadeUp(0.15)}
              className="rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-6
                       hover:border-white/[0.1] transition-all duration-500"
            >
              <h3 className="text-sm font-semibold text-white mb-5">Direct Contact</h3>
              <div className="space-y-4">
                <a
                  href="mailto:vikasthakur6566@gmail.com"
                  className="group flex items-center gap-3 text-[13px] text-[var(--dn-text-secondary)]
                           hover:text-[var(--dn-accent)] transition-colors duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--dn-accent)]/10 flex items-center justify-center
                               group-hover:scale-110 transition-transform duration-300">
                    <EnvelopeSimple size={15} className="text-[var(--dn-accent)]" />
                  </div>
                  vikasthakur6566@gmail.com
                </a>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp(0.2)}
              className="rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-6
                       hover:border-white/[0.1] transition-all duration-500"
            >
              <div className="flex items-center gap-2 mb-4">
                <Globe size={15} className="text-[var(--dn-accent)]" />
                <h3 className="text-sm font-semibold text-white">Our Other Projects</h3>
              </div>
              <div className="space-y-4">
                <a
                  href="https://saathiai.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1 text-[13px] text-[var(--dn-text-secondary)]
                           hover:text-white transition-colors duration-300"
                >
                  <span className="font-semibold text-[var(--dn-accent)] group-hover:text-[var(--dn-primary)] transition-colors">Saathi AI</span>
                  Your AI companion for smart work.
                </a>
                <a
                  href="https://nivasetu.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1 text-[13px] text-[var(--dn-text-secondary)]
                           hover:text-white transition-colors duration-300"
                >
                  <span className="font-semibold text-[var(--dn-accent)] group-hover:text-[var(--dn-primary)] transition-colors">Niva Setu</span>
                  Connecting you to better opportunities.
                </a>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp(0.25)}
              className="rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-6
                       hover:border-white/[0.1] transition-all duration-500"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock size={15} className="text-[var(--dn-accent)]" />
                <h3 className="text-sm font-semibold text-white">Response Time</h3>
              </div>
              <p className="text-[12px] text-[var(--dn-text-muted)] leading-relaxed">
                We typically respond within 24-48 hours during business days.
                For urgent matters, please use the contact form.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
