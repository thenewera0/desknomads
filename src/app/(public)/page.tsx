import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import TrendingArticles from "@/components/home/TrendingArticles";
import Categories from "@/components/home/Categories";
import TrendingTools from "@/components/home/TrendingTools";
import NewsletterCTA from "@/components/home/NewsletterCTA";
import LatestArticles from "@/components/home/LatestArticles";
import AdSlot from "@/components/shared/AdSlot";
import { getArticleCards, getApprovedTools } from "@/lib/firebase/server-data";

// Revalidate the homepage hourly so fresh articles appear while maximizing Edge CDN caching.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "DeskNomads — AI Tools, Remote Jobs & Passive Income",
  description:
    "Discover the best AI tools, work-from-home opportunities, automation systems, and online income strategies. Your guide to the future of work.",
  alternates: {
    canonical: "/",
  },
};

// JSON-LD structured data
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DeskNomads",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.desknomads.store",
  description:
    "Discover the best AI tools, remote work opportunities, automation systems, and online income strategies.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.desknomads.store"}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DeskNomads",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.desknomads.store",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.desknomads.store"}/logo.png`,
  sameAs: [
    "https://twitter.com/desknomads",
    "https://linkedin.com/company/desknomads",
    "https://youtube.com/@desknomads",
  ],
  description:
    "Smart Tools. Remote Freedom. Future Income. India's leading publication on AI tools, remote jobs, and passive income.",
};

export default async function HomePage() {
  // Server-fetch real content so it's in the initial HTML (SEO + no demo flash).
  const [latest, trending, tools] = await Promise.all([
    getArticleCards({ limit: 100 }).catch(() => []),
    getArticleCards({ limit: 3, trendingOnly: true }).catch(() => []),
    getApprovedTools(24).catch(() => []),
  ]);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Page Sections */}
      <Hero />
      <div className="flex flex-col gap-32 md:gap-48 pb-32">
        <TrendingArticles articles={trending} />
        <Categories />
        <TrendingTools tools={tools} />
        <NewsletterCTA />
        <LatestArticles articles={latest} />
      </div>
    </>
  );
}
