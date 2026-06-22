import Link from "next/link";
import { Megaphone, ChartBar, Envelope, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Advertise With Us — DeskNomads",
  description: "Promote your brand, product, or remote company to over 50,000+ professionals.",
};

const stats = [
  { value: "50,000+", label: "Monthly Readers" },
  { value: "10,000+", label: "Newsletter Subscribers" },
  { value: "4.8%", label: "Average CTR on Featured Placements" },
  { value: "85%", label: "Audience based in US, UK, and India" },
];

const formats = [
  {
    title: "Sponsored Product Reviews",
    desc: "A comprehensive, SEO-optimized review of your AI tool or remote platform written by our expert editorial team.",
  },
  {
    title: "Newsletter Sponsorship",
    desc: "Feature your product in our weekly digest sent directly to 10K+ founders, developers, and digital creators.",
  },
  {
    title: "Featured Tool Placement",
    desc: "Boost your visibility by pinning your product to the top of our AI Tool Directory and category archives.",
  },
  {
    title: "Custom Banner Campaigns",
    desc: "Display banner ads in high-traffic sections of the homepage and popular article page sidebars.",
  },
];

export default function AdvertisePage() {
  return (
    <div className="min-h-[calc(100vh-var(--dn-nav-height))] pt-28 md:pt-36 pb-24">
      {/* Background subtle glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="dn-container max-w-4xl relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[var(--dn-accent)] bg-[var(--dn-primary)]/10 border border-[var(--dn-primary)]/20 mb-4 animate-pulse">
            <Megaphone size={12} weight="fill" />
            Sponsorship Opportunities
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Advertise on DeskNomads
          </h1>
          <p className="text-base text-[var(--dn-text-secondary)] leading-relaxed">
            Position your brand in front of thousands of tech-savvy professionals, remote workers, developers, and entrepreneurs looking for software, career growth, and digital business systems.
          </p>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] text-center flex flex-col justify-center"
            >
              <div className="text-2xl md:text-3xl font-extrabold text-white mb-1.5 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--dn-text-muted)] font-medium leading-normal">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Formats */}
        <section className="mb-16">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <ChartBar size={20} className="text-[var(--dn-accent)]" />
            Our Ad Formats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {formats.map((fmt, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)] hover:border-white/[0.1] transition-all duration-300"
              >
                <h3 className="text-base font-bold text-white mb-2">{fmt.title}</h3>
                <p className="text-xs text-[var(--dn-text-secondary)] leading-relaxed">{fmt.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] p-8 md:p-10 text-center">
          <div className="absolute inset-0 bg-[var(--dn-bg-card)] z-0" />
          <div className="relative z-10 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-[var(--dn-primary)]/10 text-[var(--dn-accent)] flex items-center justify-center mx-auto mb-4 border border-[var(--dn-primary)]/20">
              <Envelope size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Interested in working with us?</h3>
            <p className="text-xs text-[var(--dn-text-secondary)] leading-relaxed mb-6">
              Get in touch to receive our media kit, pricing, and availability. We customize every campaign to fit your budget and marketing goals.
            </p>
            <Link
              href="/contact"
              className="h-11 px-7 rounded-full bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all duration-300 active:scale-[0.97]"
            >
              Get in Touch
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
