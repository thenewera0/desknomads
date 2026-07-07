import Link from "next/link";
import {
  Cube,
  TwitterLogo,
  LinkedinLogo,
  YoutubeLogo,
  PinterestLogo,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";

const footerLinks = {
  explore: [
    { label: "AI Tools", href: "/category/ai-tools" },
    { label: "Remote Jobs", href: "/category/remote-jobs" },
    { label: "Passive Income", href: "/category/passive-income" },
    { label: "Automation", href: "/category/automation" },
    { label: "Productivity", href: "/category/productivity" },
    { label: "Side Hustles", href: "/category/side-hustles" },
  ],
  resources: [
    { label: "Tool Directory", href: "/tools" },
    { label: "Newsletter", href: "/newsletter" },
    { label: "Web Stories", href: "/stories" },
    { label: "Submit a Tool", href: "/submit-tool" },
    { label: "Advertise", href: "/advertise" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

const socialLinks = [
  { icon: TwitterLogo, href: "https://twitter.com/desknomads", label: "Twitter" },
  { icon: LinkedinLogo, href: "https://linkedin.com/company/desknomads", label: "LinkedIn" },
  { icon: YoutubeLogo, href: "https://youtube.com/@desknomads", label: "YouTube" },
  { icon: PinterestLogo, href: "https://pinterest.com/desknomads", label: "Pinterest" },
];

export default function Footer() {
  return (
    <footer 
      style={{
        marginTop: "128px", // Massive top margin to separate it from the content!
        backgroundColor: "#071120",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Main Footer */}
      <div className="dn-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--dn-primary)] to-[var(--dn-accent)] flex items-center justify-center">
                <Cube size={18} weight="light" className="text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                Desk<span className="text-[var(--dn-accent)]">Nomads</span>
              </span>
            </Link>
            <p className="text-[var(--dn-text-secondary)] text-sm leading-relaxed max-w-[32ch] mb-6">
              Smart Tools. Remote Freedom. Future Income. Your guide to AI tools,
              remote work, and building income online.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center
                             text-[var(--dn-text-muted)] hover:text-white
                             hover:bg-white/[0.06] transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.97]"
                    aria-label={social.label}
                  >
                    <Icon size={18} weight="light" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--dn-text-muted)] mb-4">
              Explore
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--dn-text-secondary)] hover:text-white
                             transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.97] inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--dn-text-muted)] mb-4">
              Resources
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--dn-text-secondary)] hover:text-white
                             transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.97] inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--dn-text-muted)] mb-4">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--dn-text-secondary)] hover:text-white
                             transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.97] inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.04]">
        <div className="dn-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--dn-text-muted)]">
            &copy; {new Date().getFullYear()} DeskNomads. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-[var(--dn-text-muted)]">
            <EnvelopeSimple size={14} weight="light" />
            <a
              href="mailto:vikasthakur6566@gmail.com"
              className="hover:text-white transition-all duration-200 ease-[var(--dn-ease-out)] active:scale-[0.97] inline-block"
            >
              vikasthakur6566@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
