"use client";

import { useEffect, useRef } from "react";
import AdsterraAd from "@/components/ads/AdsterraAd";

export default function ArticleContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Lazy-activate in-article AdSense units if present
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
        /* AdSense script not present */
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

  // Split content between sections to seamlessly insert a native advertisement
  const h2Matches = Array.from(html.matchAll(/<h2[\s>]/gi));
  const shouldSplit = h2Matches.length >= 2;
  const splitIndex = shouldSplit ? Math.floor(h2Matches.length / 2) : -1;
  const splitPos =
    splitIndex > 0 && h2Matches[splitIndex]?.index !== undefined
      ? h2Matches[splitIndex].index
      : -1;

  const part1 = splitPos > 0 ? html.slice(0, splitPos) : html;
  const part2 = splitPos > 0 ? html.slice(splitPos) : "";

  if (shouldSplit && splitPos > 0) {
    return (
      <div ref={ref}>
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: part1 }}
        />
        {/* Native advertisement between article sections */}
        <AdsterraAd format="300x250" label="SPONSORED" className="my-8" />
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: part2 }}
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="article-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
