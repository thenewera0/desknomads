"use client";

import { useEffect } from "react";

/** Records one view per article per browser session via the /api/views endpoint. */
export default function ViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    if (!articleId) return;
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
    }, 1500); // only count engaged views
    return () => clearTimeout(t);
  }, [articleId]);

  return null;
}
