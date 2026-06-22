import Link from "next/link";
import { ShieldCheck, CalendarBlank } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Privacy Policy — DeskNomads",
  description: "Our commitment to protecting your privacy and personal data at DeskNomads.",
};

export default function PrivacyPage() {
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
            <ShieldCheck size={12} weight="fill" />
            Security & Trust
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-[var(--dn-text-muted)]">
            <CalendarBlank size={14} />
            Last Updated: June 21, 2026
          </div>
        </header>

        {/* Content */}
        <div className="article-content max-w-none text-white/90">
          <p>
            At DeskNomads, we take your privacy seriously. This Privacy Policy describes how we collect, use, and process your personal information when you visit our website, subscribe to our newsletter, or use our digital services.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you subscribe to our newsletter, contact us with inquiries, or submit tools to our directory. This may include your name, email address, website URL, and social media handles.
          </p>
          <p>
            We also automatically collect technical data when you navigate our site, such as your IP address, browser type, device information, and search behavior. This is done through standard cookies and tracking pixels to analyze traffic trends and optimize site performance.
          </p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To deliver weekly newsletter updates, guides, and customized search results.</li>
            <li>To moderate and display comments and submissions inside our platform.</li>
            <li>To detect and prevent fraudulent activities or spam.</li>
            <li>To serve relevant advertisements through networks like Google AdSense.</li>
          </ul>

          <h2>3. Data Storage & Security</h2>
          <p>
            We store our records securely utilizing Google Firebase Cloud Services. All database read/write actions are guarded by strict security rules, and user communications are encrypted in transit using SSL certificates.
          </p>

          <h2>4. Third-Party Integrations</h2>
          <p>
            DeskNomads integrates third-party services like Google Analytics (to monitor site usage), Google AdSense (to display advertising), and Firebase Auth/Firestore (for core platform databases). These partners follow their own policies regarding cookie usage and tracking data.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You can request access to or deletion of your email address from our subscriber records at any time. Simply click the &ldquo;Unsubscribe&rdquo; link found in the footer of any newsletter email, or send an email to <a href="mailto:hello@desknomads.com">hello@desknomads.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
