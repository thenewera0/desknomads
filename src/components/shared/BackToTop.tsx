"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react";

/** Floating button that appears after scrolling and returns to the top. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full
                 bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)] text-white
                 shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex items-center justify-center
                 transition-all duration-300 ease-[var(--dn-ease-out)]
                 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <ArrowUp size={18} weight="bold" />
    </button>
  );
}
