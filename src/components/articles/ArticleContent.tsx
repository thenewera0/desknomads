"use client";

import { useEffect, useRef } from "react";

export default function ArticleContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Lazy-activate in-article AdSense units when they scroll near the viewport,
  // preserving Core Web Vitals (no ads requested above-the-fold on load).
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ads = Array.from(
      root.querySelectorAll<HTMLElement>('ins.adsbygoogle[data-dn-lazy="true"]')
    );
    if (ads.length === 0) return;

    const activate = (el: HTMLElement) => {
      if (el.getAttribute("data-dn-loaded")) return;
      el.setAttribute("data-dn-loaded", "true");
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch {
        /* AdSense script not present (e.g. local dev) */
      }
    };

    if (!("IntersectionObserver" in window)) {
      ads.forEach(activate);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            activate(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "400px 0px" }
    );
    ads.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [html]);

  return (
    <div
      ref={ref}
      className="article-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
