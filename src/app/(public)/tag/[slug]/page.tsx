import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AnimatedCategoryHeader, AnimatedArticleGrid } from "@/components/shared/AnimatedGrid";

// Demo articles
const demoTagArticles = [
  {
    id: "1",
    title: "ChatGPT vs Claude vs Gemini: The Ultimate AI Comparison for 2025",
    slug: "chatgpt-vs-claude-vs-gemini-comparison",
    excerpt: "We tested all three AI assistants across 50 real-world tasks.",
    featuredImage: "https://picsum.photos/seed/ai-comparison/600/400",
    readingTime: 8,
    views: 12400,
    publishedAt: "2025-06-15T10:00:00Z",
  },
  {
    id: "2",
    title: "10 AI Writing Tools That Will Transform Your Content Strategy",
    slug: "ai-writing-tools-content-strategy",
    excerpt: "From blog posts to social media, these AI writing tools save hours.",
    featuredImage: "https://picsum.photos/seed/ai-writing/600/400",
    readingTime: 7,
    views: 6800,
    publishedAt: "2025-06-13T10:00:00Z",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tagName = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return {
    title: `Articles tagged with #${tagName} — DeskNomads`,
    description: `Discover articles, reviews, and tutorials matching the tag #${tagName} on DeskNomads.`,
    alternates: { canonical: `/tag/${slug}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const tagName = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const articles = demoTagArticles;

  return (
    <div className="min-h-[calc(100vh-var(--dn-nav-height))] pt-28 md:pt-36 pb-24">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[5%] left-[15%] w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="dn-container relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--dn-text-muted)] mb-10">
          <Link href="/" className="hover:text-white transition-colors duration-300">Home</Link>
          <span className="opacity-40">/</span>
          <span>Tags</span>
          <span className="opacity-40">/</span>
          <span className="text-[var(--dn-accent)]">#{tagName}</span>
        </nav>

        {/* Animated Header */}
        <AnimatedCategoryHeader
          name={`#${tagName}`}
          icon="🏷️"
          description={`Explore all articles, tutorials, and guides matching the tag #${tagName}.`}
          color="#3B82F6"
          count={articles.length}
        />

        {/* Animated Grid */}
        <AnimatedArticleGrid articles={articles} />
      </div>
    </div>
  );
}
