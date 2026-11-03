import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AnimatedCategoryHeader, AnimatedArticleGrid } from "@/components/shared/AnimatedGrid";
import AdsterraAd from "@/components/ads/AdsterraAd";
import { getPublishedArticlesWithCategory } from "@/lib/firebase/server-data";

export const revalidate = 3600;

// Demo categories — replace with Firestore
const demoCategories: Record<string, { name: string; color: string; description: string; icon: string }> = {
  "ai-tools": {
    name: "AI Tools",
    color: "#3B82F6",
    description: "Discover the best AI-powered software, platforms, and applications to boost your productivity and income.",
    icon: "🤖",
  },
  "remote-jobs": {
    name: "Remote Jobs",
    color: "#22C55E",
    description: "Find the best work-from-home opportunities, remote companies, and tips for building a location-independent career.",
    icon: "💼",
  },
  "passive-income": {
    name: "Passive Income",
    color: "#F59E0B",
    description: "Learn proven strategies to build income streams that work for you while you sleep.",
    icon: "💰",
  },
  "automation": {
    name: "Automation",
    color: "#A855F7",
    description: "Automate your repetitive tasks and build systems that save you hours every week.",
    icon: "⚡",
  },
  "digital-products": {
    name: "Digital Products",
    color: "#EC4899",
    description: "Create, launch, and scale digital products from ebooks to SaaS and online courses.",
    icon: "📦",
  },
  "productivity": {
    name: "Productivity",
    color: "#14B8A6",
    description: "Work smarter with tools, techniques, and systems that multiply your output.",
    icon: "🎯",
  },
  "freelancing": {
    name: "Freelancing",
    color: "#F97316",
    description: "Start and grow your freelance career with proven strategies and client acquisition tactics.",
    icon: "✍️",
  },
  "startups": {
    name: "Startups",
    color: "#EF4444",
    description: "Build and scale your startup from idea to product-market fit and beyond.",
    icon: "🚀",
  },
  "side-hustles": {
    name: "Side Hustles",
    color: "#F59E0B",
    description: "Practical side hustles you can start now to earn extra income alongside your day job.",
    icon: "🔥",
  },
  "chatgpt": {
    name: "ChatGPT",
    color: "#10A37F",
    description: "Guides, prompts, and workflows to get the most out of ChatGPT for work and income.",
    icon: "💬",
  },
  "gemini": {
    name: "Gemini",
    color: "#4285F4",
    description: "Tips, comparisons, and use-cases for Google Gemini across productivity and creativity.",
    icon: "✨",
  },
  "claude": {
    name: "Claude",
    color: "#D97757",
    description: "How to use Anthropic's Claude for writing, coding, research, and automation.",
    icon: "🧠",
  },
  "ai-agents": {
    name: "AI Agents",
    color: "#8B5CF6",
    description: "Build, deploy, and profit from autonomous AI agents and agentic workflows.",
    icon: "🤖",
  },
  "work-from-home": {
    name: "Work From Home",
    color: "#22C55E",
    description: "Everything you need to thrive working remotely — setups, habits, and opportunities.",
    icon: "🏠",
  },
  "digital-business": {
    name: "Digital Business",
    color: "#06B6D4",
    description: "Start and grow an online business with modern tools, marketing, and monetization.",
    icon: "📈",
  },
  "saas": {
    name: "SaaS",
    color: "#3B82F6",
    description: "Build, launch, and scale software-as-a-service products and micro-SaaS.",
    icon: "☁️",
  },
  "future-careers": {
    name: "Future Careers",
    color: "#EC4899",
    description: "Prepare for the careers of tomorrow in an AI-driven, remote-first economy.",
    icon: "🚀",
  },
  "online-income": {
    name: "Online Income",
    color: "#F59E0B",
    description: "Proven ways to earn money online, from freelancing to digital products and beyond.",
    icon: "💵",
  },
};

const demoCategoryArticles = [
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
  {
    id: "3",
    title: "How to Use AI for SEO: A Complete Beginner's Guide",
    slug: "ai-for-seo-beginners-guide",
    excerpt: "Leverage artificial intelligence to rank higher in Google.",
    featuredImage: "https://picsum.photos/seed/ai-seo/600/400",
    readingTime: 10,
    views: 5200,
    publishedAt: "2025-06-11T10:00:00Z",
  },
  {
    id: "4",
    title: "The Best Free AI Tools You Should Be Using in 2025",
    slug: "best-free-ai-tools-2025",
    excerpt: "You don't need to pay for premium AI tools. Here are the best free options.",
    featuredImage: "https://picsum.photos/seed/free-ai/600/400",
    readingTime: 6,
    views: 9100,
    publishedAt: "2025-06-09T10:00:00Z",
  },
  {
    id: "5",
    title: "AI Image Generators: Midjourney vs DALL-E vs Stable Diffusion",
    slug: "ai-image-generators-comparison",
    excerpt: "A side-by-side comparison of the top AI image generation tools.",
    featuredImage: "https://picsum.photos/seed/ai-image-gen/600/400",
    readingTime: 9,
    views: 7300,
    publishedAt: "2025-06-07T10:00:00Z",
  },
  {
    id: "6",
    title: "How to Build a YouTube Channel Using Only AI Tools",
    slug: "youtube-channel-ai-tools",
    excerpt: "From scripts to thumbnails, automate your entire YouTube workflow.",
    featuredImage: "https://picsum.photos/seed/ai-youtube/600/400",
    readingTime: 11,
    views: 4500,
    publishedAt: "2025-06-05T10:00:00Z",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = demoCategories[slug];
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `${cat.name} — DeskNomads`,
    description: cat.description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `${cat.name} — DeskNomads`,
      description: cat.description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = demoCategories[slug];
  if (!category) notFound();

  // Real published articles for this category; fall back to the demo set.
  let articles: typeof demoCategoryArticles = demoCategoryArticles;
  try {
    const real = await getPublishedArticlesWithCategory({ categorySlug: slug, limit: 30 });
    if (real.length) {
      articles = real.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        featuredImage: a.featuredImage,
        readingTime: a.readingTime,
        views: a.views,
        publishedAt: a.publishedAt || a.createdAt,
      }));
    }
  } catch (err) {
    console.error("Category articles fetch failed:", err);
  }

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.desknomads.store"}/category/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />

      <div className="min-h-[calc(100vh-var(--dn-nav-height))] py-12 md:py-16">
        {/* Background glow */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-[5%] left-[15%] w-[400px] h-[400px] rounded-full opacity-[0.06]"
            style={{ background: `radial-gradient(circle, ${category.color}40 0%, transparent 70%)`, filter: "blur(80px)" }}
          />
        </div>

        <div className="dn-container relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[var(--dn-text-muted)] mb-10">
            <Link href="/" className="hover:text-white transition-colors duration-300">Home</Link>
            <span className="opacity-40">/</span>
            <span style={{ color: category.color }}>{category.name}</span>
          </nav>

          {/* Animated Header */}
          <AnimatedCategoryHeader
            name={category.name}
            icon={category.icon}
            description={category.description}
            color={category.color}
            count={articles.length}
          />

          {/* Top Banner (728x90 desktop / 300x250 mobile) */}
          <div className="my-8 flex justify-center">
            <AdsterraAd format="responsive" />
          </div>

          {/* Animated Grid */}
          <AnimatedArticleGrid articles={articles} />

          {/* Bottom Banner */}
          <div className="mt-12 flex justify-center">
            <AdsterraAd format="responsive" />
          </div>
        </div>
      </div>
    </>
  );
}
