"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RocketLaunch,
  PaperPlaneTilt,
  CheckCircle,
  SpinnerGap,
  ArrowLeft,
  Question,
} from "@phosphor-icons/react";
import Link from "next/link";

const ease = [0.32, 0.72, 0, 1] as const;

export default function SubmitToolPage() {
  const [formData, setFormData] = useState({
    name: "",
    websiteUrl: "",
    description: "",
    logoUrl: "",
    category: "AI Writing",
    pricing: "freemium",
    tags: "",
    contactEmail: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.websiteUrl || !formData.description) return;

    setStatus("loading");

    try {
      // In a real implementation we would import the Firestore submitTool function
      // and call it here. For demo/preview, we simulate the network request.
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus("success");
      setFormData({
        name: "",
        websiteUrl: "",
        description: "",
        logoUrl: "",
        category: "AI Writing",
        pricing: "freemium",
        tags: "",
        contactEmail: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-var(--dn-nav-height))] pt-28 md:pt-36 pb-24">
      {/* Background subtle glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="dn-container max-w-3xl relative z-10">
        {/* Navigation */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--dn-text-muted)] hover:text-white transition-colors duration-300 mb-8"
        >
          <ArrowLeft size={14} />
          Back to Directory
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[var(--dn-accent)] bg-[var(--dn-primary)]/10 border border-[var(--dn-primary)]/20 mb-4">
            <RocketLaunch size={12} weight="fill" />
            Launch With Us
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Submit Your AI Tool
          </h1>
          <p className="text-sm text-[var(--dn-text-secondary)] leading-relaxed">
            Submit your product to the DeskNomads AI Tool Directory. Submissions are reviewed manually within 48 hours to maintain a high-quality index for our readers.
          </p>
        </div>

        {/* Content */}
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/[0.06]">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--dn-success)]/10 text-[var(--dn-success)] flex items-center justify-center mx-auto mb-6 border border-[var(--dn-success)]/20 animate-bounce">
                  <CheckCircle size={32} weight="bold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Submission Received!</h3>
                <p className="text-sm text-[var(--dn-text-secondary)] max-w-sm mx-auto leading-relaxed mb-6">
                  Thank you for submitting your tool. Our editors will review it shortly. We will contact you via email once approved.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-2.5 rounded-full border border-white/[0.1] hover:border-white/[0.2] text-xs font-semibold text-white transition-all duration-300"
                >
                  Submit Another Tool
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tool Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white uppercase tracking-wider">
                      Tool Name <span className="text-[var(--dn-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ChatGPT"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-[var(--dn-text-muted)] focus:outline-none focus:border-[var(--dn-primary)] transition-all duration-300"
                    />
                  </div>

                  {/* Website URL */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white uppercase tracking-wider">
                      Website URL <span className="text-[var(--dn-danger)]">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      required
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      className="h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-[var(--dn-text-muted)] focus:outline-none focus:border-[var(--dn-primary)] transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Short Description <span className="text-[var(--dn-danger)]">*</span>
                  </label>
                  <textarea
                    placeholder="Briefly describe what your tool does and its main utility (max 160 characters)"
                    required
                    maxLength={160}
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-[var(--dn-text-muted)] focus:outline-none focus:border-[var(--dn-primary)] transition-all duration-300 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white focus:outline-none focus:border-[var(--dn-primary)] transition-all duration-300 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                        backgroundSize: "1em",
                      }}
                    >
                      <option className="bg-[var(--dn-bg-card)]">AI Writing</option>
                      <option className="bg-[var(--dn-bg-card)]">AI Image</option>
                      <option className="bg-[var(--dn-bg-card)]">AI Video</option>
                      <option className="bg-[var(--dn-bg-card)]">AI Voice</option>
                      <option className="bg-[var(--dn-bg-card)]">Productivity</option>
                      <option className="bg-[var(--dn-bg-card)]">Development</option>
                    </select>
                  </div>

                  {/* Pricing Model */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white uppercase tracking-wider">
                      Pricing Model
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Free", "Freemium", "Paid"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData({ ...formData, pricing: opt.toLowerCase() })}
                          className={`h-11 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                            formData.pricing === opt.toLowerCase()
                              ? "bg-[var(--dn-primary)] border-[var(--dn-primary)] text-white shadow-[0_0_16px_rgba(59,130,246,0.15)]"
                              : "bg-white/[0.02] border-white/[0.06] text-[var(--dn-text-secondary)] hover:bg-white/[0.04] hover:text-white"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo URL */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                      Logo URL
                      <span
                        title="Provide a link to your tool's square logo image"
                        className="text-[var(--dn-text-muted)] cursor-help"
                      >
                        <Question size={12} />
                      </span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      className="h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-[var(--dn-text-muted)] focus:outline-none focus:border-[var(--dn-primary)] transition-all duration-300"
                    />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white uppercase tracking-wider">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Writing, Marketing, SEO"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-[var(--dn-text-muted)] focus:outline-none focus:border-[var(--dn-primary)] transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Contact Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Contact Email <span className="text-[var(--dn-danger)]">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-[var(--dn-text-muted)] focus:outline-none focus:border-[var(--dn-primary)] transition-all duration-300"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-12 w-full mt-2 rounded-xl bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                           text-white text-sm font-bold inline-flex items-center justify-center gap-2
                           transition-all duration-500 ease-[var(--dn-ease)]
                           active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed
                           shadow-[0_0_24px_rgba(59,130,246,0.15)]
                           hover:shadow-[0_0_32px_rgba(59,130,246,0.25)]"
                >
                  {status === "loading" ? (
                    <>
                      <SpinnerGap size={18} className="animate-spin" />
                      Submitting Tool...
                    </>
                  ) : (
                    <>
                      <PaperPlaneTilt size={18} weight="bold" />
                      Submit For Review
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
