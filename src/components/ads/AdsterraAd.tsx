"use client";

import { useEffect, useState } from "react";

export type AdFormat = "728x90" | "300x250" | "responsive";

interface AdsterraAdProps {
  format?: AdFormat;
  className?: string;
  label?: string;
}

const AD_SPECS = {
  "728x90": {
    key: "93988bc6f9138843a7e775421d2670b1",
    width: 728,
    height: 90,
    url: "https://www.highrevenueformat.com/93988bc6f9138843a7e775421d2670b1/invoke.js",
  },
  "300x250": {
    key: "dbcc3a6fb3a4821d9ec0e70c4555b908",
    width: 300,
    height: 250,
    url: "https://www.highrevenueformat.com/dbcc3a6fb3a4821d9ec0e70c4555b908/invoke.js",
  },
};

function buildIframeHtml(key: string, width: number, height: number, url: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: transparent;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${key}',
      'format' : 'iframe',
      'height' : ${height},
      'width' : ${width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="${url}"></script>
</body>
</html>`;
}

export default function AdsterraAd({
  format = "300x250",
  className = "",
  label = "Advertisement",
}: AdsterraAdProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR / Hydration placeholder with reserved dimensions to prevent CLS (Cumulative Layout Shift)
    const minHeight = format === "728x90" ? "90px" : "250px";
    return (
      <div
        className={`w-full flex items-center justify-center my-6 opacity-0 pointer-events-none ${className}`}
        style={{ minHeight }}
      />
    );
  }

  // Handle responsive format: 728x90 on desktop (>=768px), 300x250 on mobile (<768px)
  if (format === "responsive") {
    const dSpec = AD_SPECS["728x90"];
    const mSpec = AD_SPECS["300x250"];

    return (
      <div className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
        {/* Desktop Container (728x90) */}
        <div className="hidden md:flex flex-col items-center max-w-full">
          <div className="w-full flex items-center justify-between px-2 mb-1.5 max-w-[728px]">
            <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-[var(--dn-text-muted)] opacity-60">
              {label}
            </span>
            <span className="text-[9px] font-mono tracking-wider text-[var(--dn-text-muted)] opacity-40">
              Sponsored
            </span>
          </div>
          <div className="w-[744px] max-w-full rounded-2xl border border-white/[0.06] bg-white/[0.015] p-2 flex items-center justify-center shadow-sm">
            <iframe
              title="Desktop Advertisement"
              srcDoc={buildIframeHtml(dSpec.key, dSpec.width, dSpec.height, dSpec.url)}
              width={dSpec.width}
              height={dSpec.height}
              className="border-0 overflow-hidden block"
              scrolling="no"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>

        {/* Mobile Container (300x250) */}
        <div className="flex md:hidden flex-col items-center max-w-full">
          <div className="w-full flex items-center justify-between px-2 mb-1.5 max-w-[300px]">
            <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-[var(--dn-text-muted)] opacity-60">
              {label}
            </span>
            <span className="text-[9px] font-mono tracking-wider text-[var(--dn-text-muted)] opacity-40">
              Sponsored
            </span>
          </div>
          <div className="w-[316px] max-w-full rounded-2xl border border-white/[0.06] bg-white/[0.015] p-2 flex items-center justify-center shadow-sm">
            <iframe
              title="Mobile Advertisement"
              srcDoc={buildIframeHtml(mSpec.key, mSpec.width, mSpec.height, mSpec.url)}
              width={mSpec.width}
              height={mSpec.height}
              className="border-0 overflow-hidden block"
              scrolling="no"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      </div>
    );
  }

  // Fixed format (728x90 or 300x250)
  const spec = AD_SPECS[format];
  const maxBoxWidth = format === "728x90" ? 744 : 316;

  return (
    <div className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
      <div
        className="flex flex-col items-center max-w-full"
        style={{ width: `${maxBoxWidth}px` }}
      >
        <div className="w-full flex items-center justify-between px-2 mb-1.5">
          <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-[var(--dn-text-muted)] opacity-60">
            {label}
          </span>
          <span className="text-[9px] font-mono tracking-wider text-[var(--dn-text-muted)] opacity-40">
            Sponsored
          </span>
        </div>
        <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.015] p-2 flex items-center justify-center shadow-sm overflow-hidden">
          <iframe
            title={`${format} Advertisement`}
            srcDoc={buildIframeHtml(spec.key, spec.width, spec.height, spec.url)}
            width={spec.width}
            height={spec.height}
            className="border-0 overflow-hidden block"
            scrolling="no"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
}

