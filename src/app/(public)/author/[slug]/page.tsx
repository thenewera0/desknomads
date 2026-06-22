import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, TwitterLogo, LinkedinLogo, Globe } from "@phosphor-icons/react/dist/ssr";

// Demo author — replace with Firestore getAuthorBySlug()
const demoAuthors: Record<string, {
  name: string;
  bio: string;
  avatarUrl: string;
  role: string;
  social: { twitter?: string; linkedin?: string; website?: string };
}> = {
  "desknomads-team": {
    name: "DeskNomads Team",
    bio: "The DeskNomads editorial team covers AI tools, remote work, automation, and digital income strategies. We test every tool and strategy we recommend.",
    avatarUrl: "https://picsum.photos/seed/avatar-dn/200/200",
    role: "Editorial Team",
    social: {
      twitter: "https://twitter.com/desknomads",
      linkedin: "https://linkedin.com/company/desknomads",
      website: "https://desknomads.com",
    },
  },
};

const demoAuthorArticles = [
  {
    id: "1",
    title: "ChatGPT vs Claude vs Gemini: The Ultimate AI Comparison for 2025",
    slug: "chatgpt-vs-claude-vs-gemini-comparison",
    excerpt: "We tested all three AI assistants across 50 real-world tasks.",
    featuredImage: "https://picsum.photos/seed/ai-comparison/600/400",
    category: { name: "AI Tools", color: "#3B82F6" },
    readingTime: 8,
    views: 12400,
    publishedAt: "2025-06-15T10:00:00Z",
  },
  {
    id: "2",
    title: "15 Remote Jobs Paying $100K+ That Don't Require a Degree",
    slug: "remote-jobs-100k-no-degree",
    excerpt: "High-paying remote careers you can start with skills alone.",
    featuredImage: "https://picsum.photos/seed/remote-work/600/400",
    category: { name: "Remote Jobs", color: "#22C55E" },
    readingTime: 6,
    views: 8900,
    publishedAt: "2025-06-12T10:00:00Z",
  },
  {
    id: "3",
    title: "How I Built 7 Passive Income Streams Using Only AI Tools",
    slug: "passive-income-streams-ai-tools",
    excerpt: "From AI-generated content to automated digital products.",
    featuredImage: "https://picsum.photos/seed/passive-income/600/400",
    category: { name: "Passive Income", color: "#F59E0B" },
    readingTime: 10,
    views: 15200,
    publishedAt: "2025-06-10T10:00:00Z",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = demoAuthors[slug];
  if (!author) return { title: "Author Not Found" };

  return {
    title: `${author.name} — DeskNomads`,
    description: author.bio,
    alternates: { canonical: `/author/${slug}` },
    openGraph: {
      title: `${author.name} — DeskNomads`,
      description: author.bio,
      type: "profile",
    },
  };
}

function formatViews(views: number): string {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = demoAuthors[slug];
  if (!author) notFound();

  const articles = demoAuthorArticles;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://desknomads.com"}/author/${slug}`,
    image: author.avatarUrl,
    sameAs: Object.values(author.social).filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className="py-12 md:py-16">
        <div className="dn-container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[var(--dn-text-muted)] mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--dn-text-secondary)]">{author.name}</span>
          </nav>

          {/* Author Header */}
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-12 p-6 rounded-2xl border border-white/[0.06] bg-[var(--dn-bg-card)]">
            <Image
              src={author.avatarUrl}
              alt={author.name}
              width={96}
              height={96}
              className="rounded-2xl flex-shrink-0"
            />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                {author.name}
              </h1>
              <p className="text-xs text-[var(--dn-accent)] font-medium mb-3">
                {author.role}
              </p>
              <p className="text-sm text-[var(--dn-text-secondary)] leading-relaxed max-w-[55ch] mb-4">
                {author.bio}
              </p>
              <div className="flex items-center gap-2">
                {author.social.twitter && (
                  <a
                    href={author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                             bg-white/[0.04] text-[var(--dn-text-muted)]
                             hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]
                             transition-all duration-300"
                  >
                    <TwitterLogo size={16} />
                  </a>
                )}
                {author.social.linkedin && (
                  <a
                    href={author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                             bg-white/[0.04] text-[var(--dn-text-muted)]
                             hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]
                             transition-all duration-300"
                  >
                    <LinkedinLogo size={16} />
                  </a>
                )}
                {author.social.website && (
                  <a
                    href={author.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                             bg-white/[0.04] text-[var(--dn-text-muted)]
                             hover:bg-white/[0.08] hover:text-white
                             transition-all duration-300"
                  >
                    <Globe size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Articles */}
          <h2 className="text-lg font-bold text-white mb-6">
            Articles by {author.name}
            <span className="text-[var(--dn-text-muted)] text-sm font-normal ml-2">
              ({articles.length})
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <Link key={article.id} href={`/${article.slug}`} className="group block">
                <article className="flex flex-col h-full rounded-xl overflow-hidden border border-white/[0.06]
                                  bg-[var(--dn-bg-card)] hover:border-white/[0.1] hover:bg-[var(--dn-bg-card-hover)]
                                  transition-all duration-500 ease-[var(--dn-ease)]">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[var(--dn-ease)]
                               group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md"
                        style={{
                          background: `${article.category.color}20`,
                          color: article.category.color,
                        }}
                      >
                        {article.category.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-[15px] font-semibold text-white leading-snug mb-2 line-clamp-2
                                 group-hover:text-[var(--dn-accent)] transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="text-[13px] text-[var(--dn-text-muted)] leading-relaxed line-clamp-2 mb-auto">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-[var(--dn-text-muted)] mt-4 pt-3 border-t border-white/[0.04]">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {article.readingTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {formatViews(article.views)}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
