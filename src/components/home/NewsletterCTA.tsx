"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PaperPlaneTilt, FileArrowDown, CheckCircle, SpinnerGap } from "@phosphor-icons/react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const reduceMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    // TODO: Connect to Firebase / Resend
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section 
      className="py-24 md:py-32 border-t border-b border-white/[0.04]"
      style={{
        backgroundColor: "#070E1A",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div className="dn-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-xl border border-white/[0.05] bg-[var(--dn-bg-card)]"
          style={{
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)"
          }}
        >
          {/* Glass background */}
          <div className="absolute inset-0 bg-[var(--dn-bg-card)]" />

          {/* Gradient orbs */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full opacity-25"
              style={{
                background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />
            <div
              className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, rgba(96,165,250,0.3) 0%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 py-14 md:px-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left */}
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-4">
                  Stay Ahead of the <span className="font-serif italic font-normal text-[var(--dn-accent)]">Curve</span>
                </h2>
                <p className="text-[var(--dn-text-secondary)] text-sm leading-relaxed max-w-[45ch] mb-6">
                  Get weekly insights on the latest AI tools, remote job
                  opportunities, and passive income strategies delivered to your
                  inbox. Join 10,000+ readers.
                </p>

                {/* Lead Magnet */}
                <div
                  className="inline-flex items-center gap-3 px-4 py-3 rounded-xl
                           bg-white/[0.04] border border-white/[0.06]"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--dn-primary)] to-[var(--dn-accent)] flex items-center justify-center flex-shrink-0">
                     <FileArrowDown size={18} weight="light" className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Free Bonus</p>
                    <p className="text-[11px] text-[var(--dn-text-muted)]">
                      100 AI Tools PDF Guide on signup
                    </p>
                  </div>
                </div>
              </div>

              {/* Right — Form */}
              <div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  <div className="flex flex-col sm:flex-row gap-3.5">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === "loading"}
                      className="flex-1 h-14 px-5 rounded-xl bg-white/[0.06] border border-white/[0.08]
                               text-white text-sm placeholder-[var(--dn-text-muted)]
                               focus:outline-none focus:border-[var(--dn-primary)]
                               focus:ring-1 focus:ring-[var(--dn-primary)]
                               transition-all duration-200 ease-[var(--dn-ease-out)] disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading" || status === "success"}
                      className="h-14 px-8 rounded-xl bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                               text-white text-sm font-medium inline-flex items-center justify-center gap-2
                               transition-all duration-200 ease-[var(--dn-ease-out)]
                               active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed
                               shadow-[0_0_24px_rgba(59,130,246,0.2)]
                               hover:shadow-[0_0_32px_rgba(59,130,246,0.3)]
                               whitespace-nowrap"
                    >
                      {status === "loading" ? (
                        <>
                          <SpinnerGap size={16} weight="light" className="animate-spin" />
                          Subscribing...
                        </>
                      ) : status === "success" ? (
                        <>
                          <CheckCircle size={16} weight="light" />
                          Subscribed!
                        </>
                      ) : (
                        <>
                          <PaperPlaneTilt size={16} weight="light" />
                          Subscribe
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-[var(--dn-text-muted)]">
                    Free forever. Unsubscribe anytime. No spam.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
