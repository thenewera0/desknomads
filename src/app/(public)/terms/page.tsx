import Link from "next/link";
import { FileText, CalendarBlank } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Terms of Service — DeskNomads",
  description: "Terms and conditions governing your use of the DeskNomads platform.",
};

export default function TermsPage() {
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
            <FileText size={12} weight="fill" />
            Legal Agreement
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Terms of Service
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-[var(--dn-text-muted)]">
            <CalendarBlank size={14} />
            Last Updated: June 21, 2026
          </div>
        </header>

        {/* Content */}
        <div className="article-content max-w-none text-white/90">
          <p>
            Welcome to DeskNomads. By accessing our website, subscribing to our services, or interacting with our tool directory, you agree to comply with and be bound by the following Terms of Service.
          </p>

          <h2>1. Acceptable Use</h2>
          <p>
            You agree to use our site solely for lawful, personal, and informational purposes. You are prohibited from attempting to scrape content systematically, launching denial of service attacks, or introducing malicious code into our systems.
          </p>

          <h2>2. Tool Submissions</h2>
          <p>
            Developers and creators can submit their software tools to our directory. By submitting a tool, you guarantee that you own or represent the product and that the description provided is accurate and non-misleading. We reserve the right to edit, decline, or remove any submission at our sole discretion.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            All original content on this website—including articles, guides, visual assets, layouts, graphics, and codebase design—is the property of DeskNomads and is protected by copyright laws. You may not reproduce or republish our content without explicit written consent.
          </p>

          <h2>4. Disclaimer of Liability</h2>
          <p>
            DeskNomads provides informational content and lists third-party tools for convenience. We do not endorse or guarantee the performance, security, or accuracy of any listed tool. Your interactions with third-party sites are at your own risk.
          </p>

          <h2>5. Contact Information</h2>
          <p>
            If you have any questions or feedback regarding these terms, please contact our support team at <a href="mailto:hello@desknomads.shop">hello@desknomads.shop</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
