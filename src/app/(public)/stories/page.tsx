import Link from "next/link";
import Image from "next/image";
import { BookOpen, CalendarBlank, Play, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { getPublishedArticlesWithCategory } from "@/lib/firebase/server-data";

export const revalidate = 1800; // revalidate every 30 minutes

export const metadata = {
  title: "Web Stories — DeskNomads",
  description: "Visual, fast-loading web stories and visual guides from DeskNomads. Optimized for mobile and quick reading.",
};

function formatDate(iso: string | null): string {
  if (!iso) return "Recently Updated";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recently Updated";
  }
}

export default async function StoriesPage() {
  // Fetch top published articles dynamically (limit 16 to ensure 10+ stories)
  const articles = await getPublishedArticlesWithCategory({ limit: 16 });

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

      <div className="dn-container max-w-6xl relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[var(--dn-accent)] bg-[var(--dn-primary)]/10 border border-[var(--dn-primary)]/20 mb-4 animate-pulse">
            <BookOpen size={12} weight="fill" />
            Visual Web Stories
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            DeskNomads Web Stories
          </h1>
          <p className="text-base text-[var(--dn-text-secondary)] leading-relaxed">
            Fast, visually rich slideshows optimized for quick reading and mobile devices. Tap any story below to view interactive slides.
          </p>
        </div>

        {/* Stories Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-16 bg-[var(--dn-bg-card)] rounded-2xl border border-white/10">
            <p className="text-white/70">No web stories available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {articles.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/[0.08] bg-[var(--dn-bg-card)] hover:border-[var(--dn-accent)]/50 hover:shadow-[0_8px_32px_rgba(59,130,246,0.25)] transition-all duration-500 block"
              >
                {/* Image */}
                <Image
                  src={story.featuredImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-[var(--dn-ease)] group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Category Badge */}
                {story.category?.name && (
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[var(--dn-accent)] border border-white/10">
                    {story.category.name}
                  </div>
                )}

                {/* Play / Story Badge */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:bg-[var(--dn-primary)] transition-all duration-300">
                  <Play size={15} weight="fill" className="ml-0.5" />
                </div>

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end h-3/5">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/60 mb-2 font-medium">
                    <CalendarBlank size={12} />
                    {formatDate(story.publishedAt || story.createdAt)}
                  </div>
                  <h2 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-[var(--dn-accent)] transition-colors duration-300 line-clamp-2">
                    {story.title}
                  </h2>
                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    {story.excerpt}
                  </p>
                  
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[var(--dn-accent)] group-hover:translate-x-1 transition-transform duration-300">
                    <Sparkle size={12} weight="fill" />
                    <span>Tap to view story</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
