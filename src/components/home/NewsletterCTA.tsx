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
    <section className="relative w-full z-20 py-24 md:py-32" style={{ backgroundColor: "var(--dn-bg)" }}>
      <div className="dn-container relative">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 32, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-1.5 md:p-2 mx-auto max-w-5xl"
        >
          <div className="glass-core relative overflow-hidden px-6 py-14 md:px-16 md:py-24">
            
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(96,165,250,0.1),transparent_50%)]" />
              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: "url('/noise.png')" }} />
            </div>

            {/* Content */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column */}
              <div>
                <div className="inline-flex items-center gap-2 mb-6">
                   <span className="w-1.5 h-1.5 rounded-full bg-[var(--dn-accent)] shadow-[0_0_8px_var(--dn-accent)]" />
                   <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--dn-text-muted)]">
                     Newsletter
                   </span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg">
                  Stay Ahead of the <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[var(--dn-accent)] to-[var(--dn-primary)]">Curve</span>
                </h2>
                
                <p className="text-[var(--dn-text-secondary)] text-sm md:text-base leading-relaxed max-w-[45ch] mb-10">
                  Get weekly insights on the latest AI tools, remote job
                  opportunities, and passive income strategies delivered to your
                  inbox. Join 10,000+ digital nomads.
                </p>

                {/* Lead Magnet */}
                <div className="inline-flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--dn-primary)] to-[var(--dn-accent)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                     <FileArrowDown size={20} weight="duotone" className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">Free Bonus Included</p>
                    <p className="text-xs text-[var(--dn-text-muted)]">
                      The 100 Best AI Tools PDF Guide
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column — Form */}
              <div className="bg-[var(--dn-bg-card)] rounded-2xl p-6 md:p-8 border border-white/[0.04] shadow-2xl relative overflow-hidden">
                {/* Form Background Accent */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[var(--dn-primary)]/10 blur-[50px] rounded-full pointer-events-none" />
                
                <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-semibold text-[var(--dn-text-secondary)] ml-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="nomad@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === "loading"}
                      className="w-full h-14 px-5 rounded-xl bg-[var(--dn-bg)] border border-[var(--dn-glass-border)]
                               text-white text-sm placeholder-[var(--dn-text-muted)]
                               focus:outline-none focus:border-[var(--dn-primary)]
                               focus:ring-1 focus:ring-[var(--dn-primary)]
                               transition-all duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-out)] disabled:opacity-50
                               shadow-inner"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="w-full h-14 rounded-xl bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                             text-white text-sm font-bold inline-flex items-center justify-center gap-2
                             transition-all duration-[var(--dn-duration-fast)] ease-[var(--dn-ease-out)]
                             active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
                             shadow-[0_0_20px_rgba(59,130,246,0.3)]
                             hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] mt-2"
                  >
                    {status === "loading" ? (
                      <>
                        <SpinnerGap size={18} weight="bold" className="animate-spin" />
                        Subscribing...
                      </>
                    ) : status === "success" ? (
                      <>
                        <CheckCircle size={18} weight="fill" />
                        Welcome Aboard!
                      </>
                    ) : (
                      <>
                        <PaperPlaneTilt size={18} weight="fill" />
                        Subscribe Now
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-[var(--dn-text-muted)] text-center mt-2">
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
