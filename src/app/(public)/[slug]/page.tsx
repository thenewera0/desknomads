import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Eye,
  CalendarBlank,
  ShareNetwork,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import ArticleContent from "@/components/articles/ArticleContent";
import TableOfContents from "@/components/articles/TableOfContents";
import RelatedArticles, { type RelatedArticle } from "@/components/articles/RelatedArticles";
import NewsletterInline from "@/components/articles/NewsletterInline";
import CopyLinkButton from "@/components/articles/CopyLinkButton";
import ReadingProgress from "@/components/articles/ReadingProgress";
import ViewTracker from "@/components/articles/ViewTracker";
import type { Article, FAQ, TOCItem } from "@/types";
import { getPublishedArticleBySlug, getArticleCards, isIndexable } from "@/lib/firebase/server-data";

// Revalidate article pages periodically so freshly published content appears.
export const revalidate = 300;

// Demo article — replace with Firestore fetch
const demoArticle: Article = {
  id: "1",
  title: "ChatGPT vs Claude vs Gemini: The Ultimate AI Comparison for 2025",
  slug: "chatgpt-vs-claude-vs-gemini-comparison",
  excerpt:
    "We tested all three AI assistants across 50 real-world tasks. Here's which one actually delivers and when to use each.",
  content: `
    <p>The AI landscape has never been more competitive. With OpenAI's ChatGPT, Anthropic's Claude, and Google's Gemini all vying for dominance, choosing the right AI assistant can feel overwhelming. We spent weeks testing all three across 50 real-world tasks to give you a definitive answer.</p>

    <h2 id="overview">Overview of Each AI Assistant</h2>
    <p>Before diving into the comparison, let's understand what makes each AI assistant unique. Each platform has been designed with different philosophies and target audiences in mind.</p>
    <p>ChatGPT, launched by OpenAI in November 2022, was the pioneer that brought large language models to the mainstream. Claude, developed by Anthropic, focuses on safety and helpfulness. Gemini, Google's offering, leverages the company's vast data and infrastructure.</p>

    <h2 id="writing-quality">Writing Quality Comparison</h2>
    <p>When it comes to writing quality, each AI has distinct strengths. ChatGPT excels at creative writing and adapting to different tones. Claude produces more nuanced and thoughtful content. Gemini leverages real-time information for factual accuracy.</p>
    <p>In our testing, we found that Claude consistently produced the most human-sounding text, while ChatGPT was better at following specific formatting instructions. Gemini excelled when the task required current information.</p>

    <h2 id="coding-capabilities">Coding Capabilities</h2>
    <p>For developers, coding assistance is a crucial factor. ChatGPT with GPT-4 has been the industry standard for code generation. However, Claude has made significant strides with its extended context window, allowing it to work with entire codebases.</p>
    <p>Gemini's integration with Google's development tools gives it an edge in certain workflows, particularly for those already embedded in the Google ecosystem.</p>

    <h2 id="pricing-comparison">Pricing Comparison</h2>
    <p>All three platforms offer free tiers with limitations. ChatGPT Plus costs $20/month, Claude Pro is $20/month, and Gemini Advanced is $19.99/month as part of Google One AI Premium.</p>
    <p>The value proposition differs based on your primary use case. For heavy API usage, pricing models vary significantly and should be evaluated based on your specific token consumption patterns.</p>

    <h2 id="best-use-cases">Best Use Cases for Each</h2>
    <p>Based on our extensive testing, here are the recommended use cases for each platform:</p>
    <ul>
      <li><strong>ChatGPT:</strong> Creative writing, content generation, marketing copy, image generation (DALL-E), plugin ecosystem</li>
      <li><strong>Claude:</strong> Long-form analysis, code review, research synthesis, document processing, safety-conscious applications</li>
      <li><strong>Gemini:</strong> Real-time information, Google Workspace integration, multimodal tasks, travel planning</li>
    </ul>

    <h2 id="final-verdict">Final Verdict</h2>
    <p>There's no single "best" AI assistant. The right choice depends on your specific needs, workflow, and budget. For most users, we recommend trying all three free tiers before committing to a paid subscription.</p>
    <p>The AI landscape is evolving rapidly, and today's rankings may shift with the next major model update. Stay flexible and be willing to switch tools as the technology progresses.</p>
  `,
  contentJson: {},
  featuredImage: "https://picsum.photos/seed/ai-comparison-hero/1200/630",
  authorId: "author-1",
  author: {
    id: "author-1",
    name: "DeskNomads Team",
    slug: "desknomads-team",
    bio: "The DeskNomads editorial team covers AI tools, remote work, and digital income strategies.",
    avatarUrl: "https://picsum.photos/seed/avatar-dn/100/100",
    socialLinks: {
      twitter: "https://twitter.com/desknomads",
      linkedin: "https://linkedin.com/company/desknomads",
    },
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  categoryId: "cat-1",
  category: {
    id: "cat-1",
    name: "AI Tools",
    slug: "ai-tools",
    description: "Best AI-powered software and platforms",
    icon: "Robot",
    color: "#3B82F6",
    sortOrder: 1,
    seoTitle: "AI Tools - DeskNomads",
    seoDescription: "Discover the best AI tools",
    createdAt: "2024-01-01T00:00:00Z",
  },
  status: "published",
  publishedAt: "2025-06-15T10:00:00Z",
  scheduledAt: null,
  readingTime: 8,
  wordCount: 2400,
  seoTitle: "ChatGPT vs Claude vs Gemini: The Ultimate AI Comparison [2025]",
  seoDescription:
    "We tested ChatGPT, Claude, and Gemini across 50 real-world tasks. Discover which AI assistant is best for writing, coding, research, and more.",
  canonicalUrl: "",
  ogImage: "https://picsum.photos/seed/ai-comparison-og/1200/630",
  tags: ["AI", "ChatGPT", "Claude", "Gemini", "Comparison"],
  faqs: [
    {
      question: "Which AI assistant is best for coding?",
      answer:
        "ChatGPT and Claude are both excellent for coding. ChatGPT excels at code generation while Claude is better at understanding large codebases and providing detailed code reviews.",
    },
    {
      question: "Is ChatGPT free to use?",
      answer:
        "Yes, ChatGPT offers a free tier with access to GPT-3.5. ChatGPT Plus ($20/month) gives access to GPT-4, plugins, and advanced features.",
    },
    {
      question: "Can Gemini access real-time information?",
      answer:
        "Yes, Gemini has the advantage of accessing real-time information through Google Search, making it ideal for tasks requiring current data.",
    },
  ],
  toc: [
    { id: "overview", text: "Overview of Each AI Assistant", level: 2 },
    { id: "writing-quality", text: "Writing Quality Comparison", level: 2 },
    { id: "coding-capabilities", text: "Coding Capabilities", level: 2 },
    { id: "pricing-comparison", text: "Pricing Comparison", level: 2 },
    { id: "best-use-cases", text: "Best Use Cases for Each", level: 2 },
    { id: "final-verdict", text: "Final Verdict", level: 2 },
  ],
  internalLinks: [],
  seoScore: 92,
  readabilityScore: 85,
  views: 12400,
  isFeatured: true,
  isTrending: true,
  createdAt: "2025-06-15T10:00:00Z",
  updatedAt: "2025-06-15T10:00:00Z",
};

// Fetch a published article from Firestore; fall back to the seed demo article.
async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const article = await getPublishedArticleBySlug(slug);
    if (article) return article;
  } catch (err) {
    console.error("Article fetch failed:", err);
  }
  if (slug === demoArticle.slug) return demoArticle;
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://desknomads.com";

  // Thin stubs stay live (redirect targets still resolve) but are not indexed,
  // so they don't count against the site's overall quality signal.
  const thin = !isIndexable(article);

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    ...(thin ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: article.canonicalUrl || `${siteUrl}/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      url: `${siteUrl}/${article.slug}`,
      images: [
        {
          url: article.ogImage || article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt,
      authors: article.author ? [article.author.name] : undefined,
      section: article.category?.name,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      images: [article.ogImage || article.featuredImage],
    },
  };
}

function generateArticleSchema(article: Article) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://desknomads.com";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    image: article.featuredImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author?.name || "DeskNomads",
      url: article.author
        ? `${siteUrl}/author/${article.author.slug}`
        : siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "DeskNomads",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${article.slug}`,
    },
    wordCount: article.wordCount,
    articleSection: article.category?.name,
    keywords: article.tags.join(", "),
  };
}

function generateFAQSchema(faqs: FAQ[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function generateBreadcrumbSchema(article: Article) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://desknomads.com";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: article.category?.name || "Articles",
        item: `${siteUrl}/category/${article.category?.slug || "all"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${siteUrl}/${article.slug}`,
      },
    ],
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Real related articles from the same category (exclude current); none → section hidden.
  let related: RelatedArticle[] = [];
  try {
    const cards = await getArticleCards({ categorySlug: article.category?.slug, limit: 7 });
    related = cards
      .filter((a) => a.id !== article.id)
      .slice(0, 3)
      .map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        featuredImage: a.featuredImage,
        readingTime: a.readingTime,
        category: a.category ? { name: a.category.name, color: a.category.color } : undefined,
      }));
  } catch (err) {
    console.error("Related articles fetch failed:", err);
  }

  const articleSchema = generateArticleSchema(article);
  const faqSchema = generateFAQSchema(article.faqs);
  const breadcrumbSchema = generateBreadcrumbSchema(article);

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://desknomads.com";
  const articleUrl = `${siteUrl}/${article.slug}`;

  return (
    <>
      <ReadingProgress />
      <ViewTracker articleId={article.id} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="dn-container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[var(--dn-text-muted)] mb-8">
            <Link href="/" className="hover:text-white transition-colors duration-300">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/category/${article.category?.slug}`}
              className="hover:text-white transition-colors duration-300"
              style={{ color: article.category?.color }}
            >
              {article.category?.name}
            </Link>
            <span>/</span>
            <span className="text-[var(--dn-text-secondary)] truncate max-w-[200px]">
              {article.title}
            </span>
          </nav>

          {/* Article Header */}
          <header className="max-w-3xl mb-10">
            {/* Category badge */}
            <span
              className="inline-block px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-5"
              style={{
                background: `${article.category?.color}15`,
                color: article.category?.color,
                border: `1px solid ${article.category?.color}25`,
              }}
            >
              {article.category?.name}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.025em] leading-[1.12] text-white mb-5">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-[var(--dn-text-secondary)] leading-relaxed mb-6">
              {article.excerpt}
            </p>

            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[var(--dn-text-muted)]">
              {/* Author */}
              <div className="flex items-center gap-2.5">
                <Image
                  src={article.author?.avatarUrl || ""}
                  alt={article.author?.name || "Author"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <Link
                  href={`/author/${article.author?.slug}`}
                  className="text-white font-medium hover:text-[var(--dn-accent)] transition-colors duration-300"
                >
                  {article.author?.name}
                </Link>
              </div>

              <span className="w-px h-4 bg-white/[0.1]" />

              <span className="flex items-center gap-1.5">
                <CalendarBlank size={14} weight="light" />
                {publishedDate}
              </span>

              <span className="flex items-center gap-1.5">
                <Clock size={14} weight="light" />
                {article.readingTime} min read
              </span>

              <span className="flex items-center gap-1.5">
                <Eye size={14} weight="light" />
                {article.views.toLocaleString()} views
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[2/1] md:aspect-[2.2/1] rounded-2xl overflow-hidden mb-12 border border-white/[0.06]">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1320px) 100vw, 1320px"
            />
          </div>

          {/* Content Grid: TOC sidebar + Article body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Sticky TOC (desktop sidebar) */}
            <aside className="hidden lg:block lg:col-span-3">
              <TableOfContents items={article.toc} />
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-6">
              {/* Adsense: Top of article */}
              <div className="mb-8 p-4 rounded-xl bg-[var(--dn-bg-card)] border border-white/[0.04] text-center text-[11px] text-[var(--dn-text-muted)]">
                Advertisement
              </div>

              <ArticleContent html={article.content} />

              {/* FAQ Section */}
              {article.faqs.length > 0 && (
                <section className="mt-12 pt-8 border-t border-white/[0.06]">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="flex flex-col gap-4">
                    {article.faqs.map((faq, i) => (
                      <div key={i} className="p-1 rounded-[1.25rem] bg-white/[0.02] border border-white/[0.06] transition-all duration-300 hover:border-white/[0.1]">
                        <details
                          className="group rounded-[calc(1.25rem-0.25rem)] border border-white/[0.04] bg-[var(--dn-bg-card)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
                        >
                          <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-medium text-white list-none">
                            {faq.question}
                            <span className="ml-2 text-[var(--dn-text-muted)] group-open:rotate-45 transition-transform duration-300">
                              +
                            </span>
                          </summary>
                          <div className="px-5 pb-4 text-sm text-[var(--dn-text-secondary)] leading-relaxed">
                            {faq.answer}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                      className="px-3 py-1.5 rounded-full text-[11px] font-medium
                               bg-white/[0.04] text-[var(--dn-text-secondary)]
                               hover:bg-white/[0.08] hover:text-white
                               border border-white/[0.04] hover:border-white/[0.08]
                               transition-all duration-300"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Social Share */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <p className="text-xs text-[var(--dn-text-muted)] mb-3 flex items-center gap-1.5">
                  <ShareNetwork size={14} weight="light" />
                  Share this article
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent("Check out this article: " + articleUrl)}`}
                    className="w-9 h-9 rounded-full flex items-center justify-center
                             bg-white/[0.04] text-[var(--dn-text-muted)]
                             hover:bg-[var(--dn-accent)]/10 hover:text-[var(--dn-accent)]
                             border border-white/[0.04]
                             transition-all duration-300"
                    aria-label="Share via Email"
                  >
                    <EnvelopeSimple size={16} weight="light" />
                  </a>
                  <CopyLinkButton url={articleUrl} />
                </div>
              </div>

              {/* Inline Newsletter */}
              <NewsletterInline />
            </div>

            {/* Right Sidebar (ads, related) */}
            <aside className="lg:col-span-3">
              {/* Adsense: Sidebar */}
              <div className="mb-6 p-4 rounded-xl bg-[var(--dn-bg-card)] border border-white/[0.04] text-center text-[11px] text-[var(--dn-text-muted)] sticky top-24">
                <div className="w-full aspect-[300/250] flex items-center justify-center">
                  Sidebar Ad — 300x250
                </div>
              </div>
            </aside>
          </div>

          {/* Related Articles */}
          <RelatedArticles articles={related} />
        </div>
      </article>
    </>
  );
}
