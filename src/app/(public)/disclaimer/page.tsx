import Link from "next/link";
import { Warning, CalendarBlank } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Disclaimer — DeskNomads",
  description: "Affiliate disclosure and financial/career advice disclaimers at DeskNomads.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-[calc(100vh-var(--dn-nav-height))] pt-28 md:pt-36 pb-24">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="dn-container max-w-4xl relative z-10">
        {/* Header */}
        <header className="border-b border-white/[0.08] pb-8 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[var(--dn-accent)] bg-[var(--dn-primary)]/10 border border-[var(--dn-primary)]/20 mb-4">
            <Warning size={12} weight="fill" />
            Disclosure
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Disclaimer
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-[var(--dn-text-muted)]">
            <CalendarBlank size={14} />
            Last Updated: June 21, 2026
          </div>
        </header>

        {/* Content */}
        <div className="article-content max-w-none text-white/90">
          <h2>1. General Information</h2>
          <p>
            The content provided on DeskNomads is for general informational and educational purposes only. While we make every effort to provide accurate, up-to-date information, we make no representations or warranties of any kind regarding the completeness, suitability, or reliability of the information, tools, or services discussed.
          </p>

          <h2>2. Affiliate Disclosure</h2>
          <p>
            Some of the links on DeskNomads may be affiliate links. This means that if you click on the link and purchase the item or subscribe to the service, we may receive an affiliate commission at no extra cost to you. We only recommend products or services that we believe add value to our readers.
          </p>

          <h2>3. Financial and Career Advice</h2>
          <p>
            DeskNomads publishes articles and reports about remote jobs, side hustles, and online business models. This content does not constitute professional financial, investment, legal, or career planning advice. Before making any decisions or investments based on our content, you should consult with a qualified professional.
          </p>

          <h2>4. Third-Party Links</h2>
          <p>
            Our website lists and reviews third-party software, applications, and job boards. We have no control over the nature, content, pricing, security, or availability of those external sites. The inclusion of any link does not imply a recommendation or endorsement of the views expressed within them.
          </p>
        </div>
      </div>
    </div>
  );
}
