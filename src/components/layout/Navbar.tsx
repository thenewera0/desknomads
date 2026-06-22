"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  X,
  MagnifyingGlass,
  Lightning,
  Briefcase,
  CurrencyDollar,
  Robot,
  Cube,
  Gauge,
  UserCircle,
  PenNib,
} from "@phosphor-icons/react";

const navLinks = [
  { label: "AI Tools", href: "/category/ai-tools", icon: Robot },
  { label: "Remote Jobs", href: "/category/remote-jobs", icon: Briefcase },
  { label: "Passive Income", href: "/category/passive-income", icon: CurrencyDollar },
  { label: "Automation", href: "/category/automation", icon: Lightning },
  { label: "Productivity", href: "/category/productivity", icon: Gauge },
  { label: "Side Hustles", href: "/category/side-hustles", icon: PenNib },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      // Always show near the top or while the mobile menu is open.
      if (isOpen || y < 96) {
        setHidden(false);
      } else if (y > lastY + 6) {
        setHidden(true); // scrolling down → hide
      } else if (y < lastY - 6) {
        setHidden(false); // scrolling up → reveal
      }
      lastY = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: hidden ? "-105%" : 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
        style={{
          height: "var(--dn-nav-height)",
          backgroundColor: scrolled ? "var(--dn-bg)" : "rgba(4, 11, 23, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0.04)",
          boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.5)" : "none",
        }}
      >
        <div className="dn-container h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.97]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--dn-primary)] to-[var(--dn-accent)] flex items-center justify-center">
              <Cube size={18} weight="light" className="text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Desk<span className="text-[var(--dn-accent)]">Nomads</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.slice(0, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-[13px] font-medium text-[var(--dn-text-secondary)] 
                         hover:text-white transition-all duration-200 ease-[var(--dn-ease-out)] rounded-lg
                         hover:bg-white/[0.04] active:scale-[0.97]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/tools"
              className="px-3.5 py-2 text-[13px] font-medium text-[var(--dn-accent)]
                       hover:text-white transition-all duration-200 ease-[var(--dn-ease-out)] rounded-lg
                       hover:bg-white/[0.04] active:scale-[0.97]"
            >
              Tool Directory
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/search"
              className="w-9 h-9 rounded-full flex items-center justify-center
                       text-[var(--dn-text-secondary)] hover:text-white hover:bg-white/[0.06]
                       transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.97]"
              aria-label="Search"
            >
              <MagnifyingGlass size={18} weight="light" />
            </Link>
            <Link
              href="/newsletter"
              className="h-9 px-4 rounded-full bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                       text-white text-[13px] font-medium flex items-center gap-1.5
                       transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.97]"
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center
                      text-white hover:bg-white/[0.06] transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.97]"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={22} weight="light" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <List size={22} weight="light" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-[rgba(4,11,23,0.85)] backdrop-blur-3xl saturate-150 border-l border-white/[0.04] lg:hidden"
            style={{ paddingTop: "var(--dn-nav-height)" }}
          >
            <nav className="dn-container py-8 flex flex-col gap-2">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.06,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 px-4 py-4 rounded-xl
                               text-[var(--dn-text-secondary)] hover:text-white
                               hover:bg-white/[0.04] transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.97]"
                    >
                      <Icon size={22} weight="light" className="text-[var(--dn-accent)]" />
                      <span className="text-lg font-medium">{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: navLinks.length * 0.06,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="mt-4 pt-4 border-t border-white/[0.06]"
              >
                <Link
                  href="/newsletter"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full
                           bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)]
                           text-white font-medium transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.97]"
                >
                  Subscribe to Newsletter
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
