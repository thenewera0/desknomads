import Link from "next/link";
import Image from "next/image";
import { Clock } from "@phosphor-icons/react/dist/ssr";

export interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  readingTime: number;
  category?: { name: string; color: string };
}

export default function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  // Only render real, existing articles — no demo/placeholder links (avoids 404s).
  if (!articles?.length) return null;

  return (
    <section className="mt-16 pt-12 border-t border-white/[0.06]">
      <h2 className="text-xl font-bold text-white mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {articles.map((article) => (
          <Link key={article.id} href={`/${article.slug}`} className="group block">
            {/* Outer Shell */}
            <div className="p-1.5 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] transition-all duration-200 ease-[var(--dn-ease-out)] group-hover:border-white/[0.12] group-hover:bg-white/[0.04]">
              {/* Inner Core */}
              <article
                className="rounded-[calc(1.5rem-0.375rem)] overflow-hidden border border-white/[0.04]
                         bg-[var(--dn-bg-card)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.03]">
                  {article.featuredImage ? (
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[var(--dn-ease)]
                               group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--dn-primary)]/15 to-transparent text-[var(--dn-text-muted)] text-xs">
                      DeskNomads
                    </div>
                  )}
                  {article.category && (
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md"
                        style={{
                          background: `${article.category.color}20`,
                          color: article.category.color,
                        }}
                      >
                        {article.category.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-2
                               group-hover:text-[var(--dn-accent)] transition-colors duration-300">
                    {article.title}
                  </h3>
                  <span className="flex items-center gap-1 text-[11px] text-[var(--dn-text-muted)]">
                    <Clock size={11} weight="light" />
                    {article.readingTime} min read
                  </span>
                </div>
              </article>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
