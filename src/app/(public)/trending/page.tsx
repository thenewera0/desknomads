import Link from "next/link";
import { Sparkle, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { AnimatedArticleGrid } from "@/components/shared/AnimatedGrid";

export const metadata = {
  title: "Trending Articles — DeskNomads",
  description: "Explore the most-read articles and reviews this week on DeskNomads.",
};

const trendingArticles = [
  {
    id: "1",
    title: "ChatGPT vs Claude vs Gemini: The Ultimate AI Comparison for 2025",
    slug: "chatgpt-vs-claude-vs-gemini-comparison",
    excerpt: "We tested all three AI assistants across 50 real-world tasks. Here's which one actually delivers and when to use each.",
    featuredImage: "https://picsum.photos/seed/ai-comparison/600/400",
    readingTime: 8,
    views: 12400,
    publishedAt: "2025-06-15T10:00:00Z",
  },
  {
    id: "2",
    title: "15 Remote Jobs Paying $100K+ That Don't Require a Degree",
    slug: "remote-jobs-100k-no-degree",
    excerpt: "High-paying remote careers you can start with skills alone. From UX to DevOps, here's your roadmap.",
    featuredImage: "https://picsum.photos/seed/remote-work/600/400",
    readingTime: 6,
    views: 8900,
    publishedAt: "2025-06-12T10:00:00Z",
  },
  {
    id: "3",
    title: "How I Built 7 Passive Income Streams Using Only AI Tools",
    slug: "passive-income-streams-ai-tools",
    excerpt: "From AI-generated content to automated digital products. A step-by-step breakdown of each income stream.",
    featuredImage: "https://picsum.photos/seed/passive-income/600/400",
    readingTime: 10,
    views: 15200,
    publishedAt: "2025-06-10T10:00:00Z",
  },
  {
    id: "4",
    title: "The Complete Guide to AI-Powered SEO in 2025",
    slug: "ai-powered-seo-guide-2025",
    excerpt: "Learn how artificial intelligence is transforming search engine optimization and how you can leverage AI tools to rank higher.",
    featuredImage: "https://picsum.photos/seed/seo-ai/600/400",
    readingTime: 12,
    views: 5200,
    publishedAt: "2025-06-14T10:00:00Z",
  },
  {
    id: "5",
    title: "Building a Digital Product Empire: From Idea to $10K/Month",
    slug: "digital-product-empire-guide",
    excerpt: "A complete blueprint for creating, launching, and scaling digital products that generate recurring revenue.",
    featuredImage: "https://picsum.photos/seed/digital-products/600/400",
    readingTime: 15,
    views: 9400,
    publishedAt: "2025-06-11T10:00:00Z",
  },
];

export default function TrendingPage() {
  return (
    <div className="min-h-[calc(100vh-var(--dn-nav-height))] py-12 md:py-16">
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

      <div className="dn-container relative z-10">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--dn-text-muted)] hover:text-white transition-colors duration-300 mb-8"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[var(--dn-accent)] bg-[var(--dn-primary)]/10 border border-[var(--dn-primary)]/20 mb-4 animate-pulse">
            <Sparkle size={12} weight="fill" />
            Most Popular
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Trending Articles
          </h1>
          <p className="text-base text-[var(--dn-text-secondary)] leading-relaxed">
            The most popular resources, reviews, and tutorials read by remote professionals and digital builders this week.
          </p>
        </div>

        {/* Article Grid */}
        <AnimatedArticleGrid articles={trendingArticles} />
      </div>
    </div>
  );
}
