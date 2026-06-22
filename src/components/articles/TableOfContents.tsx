"use client";

import { useState, useEffect } from "react";
import type { TOCItem } from "@/types";

export default function TableOfContents({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -70% 0px",
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="sticky top-28">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--dn-text-muted)] mb-4">
        On this page
      </p>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`text-[13px] leading-snug py-1.5 border-l-2 transition-all duration-300 ${
              item.level === 3 ? "pl-6" : "pl-4"
            } ${
              activeId === item.id
                ? "border-[var(--dn-primary)] text-white font-medium"
                : "border-transparent text-[var(--dn-text-muted)] hover:text-[var(--dn-text-secondary)] hover:border-white/[0.1]"
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
