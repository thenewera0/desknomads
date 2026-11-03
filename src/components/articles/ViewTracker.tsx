"use client";

import { useEffect } from "react";

/** Records one view per article per browser session via the /api/views endpoint. */
export default function ViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    if (!articleId) return;

    // Filter out bots, automated crawlers, and headless testing environments
    if (
      typeof navigator !== "undefined" &&
      (navigator.webdriver ||
        /bot|crawler|spider|googlebot|bingbot|yandex|baidu|slurp|duckduckbot|facebookexternalhit|whatsapp|preview|headless/i.test(
          navigator.userAgent
        ))
    ) {
      return;
    }

    const key = `dn_viewed_${articleId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* storage unavailable — still count once */
    }
    const t = setTimeout(() => {
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
        keepalive: true,
      }).catch(() => {});
    }, 5000); // Only count genuine reads (5s+) to avoid burning CPU on bounces
    return () => clearTimeout(t);
  }, [articleId]);

  return null;
}
