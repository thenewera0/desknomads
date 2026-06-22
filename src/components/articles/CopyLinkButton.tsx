"use client";

import { useState } from "react";
import { LinkSimple, Check } from "@phosphor-icons/react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      onClick={copy}
      className="w-9 h-9 rounded-full flex items-center justify-center
                 bg-white/[0.04] text-[var(--dn-text-muted)]
                 hover:bg-white/[0.08] hover:text-white
                 border border-white/[0.04]
                 transition-all duration-300"
      aria-label="Copy link"
    >
      {copied ? <Check size={16} weight="bold" /> : <LinkSimple size={16} weight="light" />}
    </button>
  );
}
