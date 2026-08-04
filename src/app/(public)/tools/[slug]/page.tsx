import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  ArrowLeft,
  Star,
  CheckCircle,
  Crown,
  Tag,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { getToolBySlug, getApprovedTools } from "@/lib/firebase/server-data";
import type { Tool } from "@/types";

export const revalidate = 3600;

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "https://www.desknomads.shop";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found | DeskNomads" };
  const title = `${tool.name} Review — Features, Pricing & Alternatives | DeskNomads`;
  const description =
    tool.longDescription?.slice(0, 155) ||
    `${tool.name}: ${tool.description} See what it does, pricing, and whether it's worth it.`;
  return {
    title,
    description,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${siteUrl()}/tools/${tool.slug}`,
      images: tool.screenshotUrl || tool.logoUrl ? [{ url: tool.screenshotUrl || tool.logoUrl }] : undefined,
    },
  };
}

function toolSchema(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category,
    operatingSystem: "Web",
    url: tool.url,
    image: tool.logoUrl,
    offers: {
      "@type": "Offer",
      price: tool.pricing === "free" ? "0" : undefined,
      priceCurrency: "USD",
      category: tool.pricing,
    },
    ...(tool.rating
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: tool.rating, bestRating: 5, ratingCount: 1 } }
      : {}),
  };
}

function breadcrumbSchema(tool: Tool) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Tool Directory", item: `${base}/tools` },
      { "@type": "ListItem", position: 3, name: tool.name, item: `${base}/tools/${tool.slug}` },
    ],
  };
}

const pricingStyle: Record<string, { bg: string; text: string }> = {
  free: { bg: "rgba(34,197,94,0.08)", text: "var(--dn-success)" },
  freemium: { bg: "rgba(59,130,246,0.08)", text: "var(--dn-accent)" },
  paid: { bg: "rgba(245,158,11,0.08)", text: "var(--dn-warning)" },
};

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const related = (await getApprovedTools(100))
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 3);

  const ps = pricingStyle[tool.pricing] || pricingStyle.freemium;

  return (
    <div className="py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema(tool)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(tool)) }} />

      <div className="dn-container max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--dn-text-muted)] mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Tool Directory</Link>
          <span className="opacity-40">/</span>
          <span className="text-[var(--dn-text-secondary)]">{tool.name}</span>
        </nav>

        {/* Header card */}
        <div className="rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.08] flex-shrink-0 relative">
              {tool.logoUrl && (
                <Image src={tool.logoUrl} alt={`${tool.name} logo`} fill className="object-cover" sizes="64px" unoptimized />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{tool.name}</h1>
                {tool.isVerified && <CheckCircle size={18} weight="fill" className="text-[var(--dn-accent)]" />}
                {tool.isFeatured && <Crown size={17} weight="fill" className="text-[var(--dn-warning)]" />}
              </div>
              <div className="flex items-center gap-3 flex-wrap text-sm">
                <span className="text-[11px] font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                  {tool.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border" style={{ background: ps.bg, color: ps.text, borderColor: ps.text + "20" }}>
                  {tool.pricing}
                </span>
                {tool.rating > 0 && (
                  <span className="flex items-center gap-1 text-white font-semibold">
                    <Star size={14} weight="fill" className="text-[var(--dn-warning)]" /> {tool.rating}
                  </span>
                )}
              </div>
            </div>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 h-11 px-6 rounded-full bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)] text-white text-sm font-medium transition-all active:scale-[0.97] shadow-[0_0_30px_rgba(59,130,246,0.2)] flex-shrink-0"
            >
              Visit {tool.name}
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        {/* Screenshot */}
        {tool.screenshotUrl && (
          <div className="rounded-2xl overflow-hidden border border-white/[0.06] mb-8 relative aspect-video bg-[var(--dn-bg-card)]">
            <Image src={tool.screenshotUrl} alt={`${tool.name} screenshot`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" unoptimized />
          </div>
        )}

        {/* Overview */}
        <div className="prose-dn mb-8">
          <h2 className="text-xl font-bold text-white mb-3">What is {tool.name}?</h2>
          <p className="text-[15px] text-[var(--dn-text-secondary)] leading-[1.85]">
            {tool.longDescription || tool.description}
          </p>
        </div>

        {/* Tags */}
        {tool.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--dn-text-muted)] mb-3">Best for</h2>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full text-xs bg-white/[0.03] text-[var(--dn-text-secondary)] flex items-center gap-1.5 border border-white/[0.06]">
                  <Tag size={11} weight="light" /> {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)] p-6 text-center mb-12">
          <p className="text-sm text-[var(--dn-text-secondary)] mb-4">
            Ready to try {tool.name}? Head to the official site to get started.
          </p>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-11 px-7 rounded-full bg-[var(--dn-primary)] hover:bg-[var(--dn-primary-hover)] text-white text-sm font-medium transition-all active:scale-[0.97]"
          >
            Visit {tool.name} <ArrowUpRight size={15} />
          </a>
        </div>

        {/* Related tools */}
        {related.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkle size={18} className="text-[var(--dn-accent)]" /> Similar tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/tools/${r.slug}`}
                  className="group p-4 rounded-xl border border-white/[0.06] bg-[var(--dn-bg-card)] hover:border-white/[0.12] transition-all"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/[0.04] border border-white/[0.08] flex-shrink-0 relative">
                      {r.logoUrl && <Image src={r.logoUrl} alt={r.name} fill className="object-cover" sizes="36px" unoptimized />}
                    </div>
                    <span className="text-sm font-semibold text-white group-hover:text-[var(--dn-accent)] transition-colors truncate">{r.name}</span>
                  </div>
                  <p className="text-xs text-[var(--dn-text-muted)] line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm text-[var(--dn-text-secondary)] hover:text-white transition-colors">
          <ArrowLeft size={15} /> Back to Tool Directory
        </Link>
      </div>
    </div>
  );
}
