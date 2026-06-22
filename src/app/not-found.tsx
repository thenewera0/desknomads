"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { House, MagnifyingGlass, ArrowLeft } from "@phosphor-icons/react";

const ease = [0.32, 0.72, 0, 1] as const;

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--dn-bg)] px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative text-center max-w-md">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="text-[120px] md:text-[160px] font-black leading-none tracking-tighter
                         text-transparent bg-clip-text
                         bg-gradient-to-b from-white/20 to-white/[0.03]
                         select-none">
            404
          </span>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
          className="-mt-4"
        >
          <h1 className="text-xl md:text-2xl font-bold text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-sm text-[var(--dn-text-muted)] max-w-xs mx-auto leading-relaxed mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="group h-11 px-6 rounded-full bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                     text-white text-sm font-medium inline-flex items-center gap-2
                     transition-all duration-500 active:scale-[0.97]
                     shadow-[0_0_24px_rgba(59,130,246,0.2)]
                     hover:shadow-[0_0_32px_rgba(59,130,246,0.3)]"
          >
            <House size={16} weight="light" />
            Go Home
          </Link>
          <Link
            href="/search"
            className="h-11 px-6 rounded-full border border-white/[0.1] hover:border-white/[0.2]
                     text-white text-sm font-medium inline-flex items-center gap-2
                     hover:bg-white/[0.04] transition-all duration-500 active:scale-[0.97]"
          >
            <MagnifyingGlass size={16} weight="light" />
            Search
          </Link>
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          className="mt-10"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-[12px] text-[var(--dn-text-muted)]
                     hover:text-[var(--dn-accent)] transition-colors duration-300"
          >
            <ArrowLeft size={12} weight="light" />
            Go back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
