"use client";

import { useEffect, useRef, useState } from "react";
import AdsterraAd, { type AdFormat } from "@/components/ads/AdsterraAd";

const PUBLISHER = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
// One reusable responsive ad-unit slot id created in the AdSense dashboard.
// When set and approved, AdSense is used. Otherwise, highrevenueformat display ads serve automatically.
const SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

export default function AdSlot({
  id,
  className = "",
  format = "responsive",
}: {
  id: string;
  className?: string;
  format?: AdFormat;
}) {
  const ref = useRef<HTMLModElement>(null);
  const [active] = useState<boolean>(() => !!SLOT && !!PUBLISHER);

  useEffect(() => {
    if (!active) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      /* script blocked or not yet loaded */
    }
  }, [active]);

  if (!active) {
    return <AdsterraAd format={format} className={className} />;
  }

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 md:px-8 my-8 md:my-12 ${className}`}>
      <div className="relative w-full rounded-xl border border-white/[0.04] bg-white/[0.01] p-3 md:p-4 text-center overflow-hidden">
        <span className="absolute -top-2.5 left-6 px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.15em] text-[var(--dn-text-muted)] bg-[var(--dn-bg)] border border-white/[0.04] rounded">
          Advertisement
        </span>
        <div className="flex items-center justify-center min-h-[100px] md:min-h-[120px]">
          <ins
            ref={ref}
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client={`ca-${PUBLISHER}`}
            data-ad-slot={SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
            data-dn-placement={id}
          />
        </div>
      </div>
    </div>
  );
}
