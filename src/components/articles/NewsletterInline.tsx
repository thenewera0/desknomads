"use client";

import { useState } from "react";
import { PaperPlaneTilt, CheckCircle, SpinnerGap } from "@phosphor-icons/react";

export default function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

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
    <div className="mt-12 p-1.5 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06]">
      <div className="p-6 md:p-8 rounded-[calc(1.5rem-0.375rem)] border border-white/[0.04] bg-[var(--dn-bg-card)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
        <h3 className="text-lg font-bold text-white mb-2">
          Enjoyed this article?
        </h3>
        <p className="text-sm text-[var(--dn-text-secondary)] mb-5">
          Get more insights on AI tools, remote work, and passive income
          delivered to your inbox every week.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            className="flex-1 h-10 px-4 rounded-lg bg-white/[0.04] border border-white/[0.06]
                     text-sm text-white placeholder-[var(--dn-text-muted)]
                     focus:outline-none focus:border-[var(--dn-primary)]
                     transition-all duration-300 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="h-10 px-5 rounded-lg bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                     text-white text-sm font-medium inline-flex items-center gap-2
                     transition-all duration-300 active:scale-[0.97]
                     disabled:opacity-70 whitespace-nowrap"
          >
            {status === "loading" ? (
              <SpinnerGap size={14} weight="light" className="animate-spin" />
            ) : status === "success" ? (
              <>
                <CheckCircle size={14} weight="light" />
                Done
              </>
            ) : (
              <>
                <PaperPlaneTilt size={14} weight="light" />
                Subscribe
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
