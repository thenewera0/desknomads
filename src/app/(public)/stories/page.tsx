import Link from "next/link";
import Image from "next/image";
import { BookOpen, CalendarBlank, Play } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Web Stories — DeskNomads",
  description: "Visual stories and highlights from DeskNomads. Learn concepts in quick, slides-format.",
};

const stories = [
  {
    id: "s1",
    title: "5 ChatGPT Hacks for Coding 10x Faster",
    excerpt: "Boost your productivity with these advanced prompting frameworks.",
    image: "https://picsum.photos/seed/story-chatgpt/400/600",
    date: "Jun 18, 2025",
  },
  {
    id: "s2",
    title: "How to Build a Location Independent Side Hustle",
    excerpt: "Your step-by-step blueprint to remote business freedom.",
    image: "https://picsum.photos/seed/story-hustle/400/600",
    date: "Jun 15, 2025",
  },
  {
    id: "s3",
    title: "Top 7 Remote Websites to Find High-Paying US Jobs",
    excerpt: "No degree required. Apply to these platforms directly.",
    image: "https://picsum.photos/seed/story-jobs/400/600",
    date: "Jun 12, 2025",
  },
];

export default function StoriesPage() {
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

      <div className="dn-container max-w-5xl relative z-10">
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
            Fast, visually rich slideshows optimized for quick reading and mobile devices. Perfect for learning key insights on the go.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/[0.08] bg-[var(--dn-bg-card)] hover:border-white/[0.16] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 cursor-pointer"
            >
              {/* Image */}
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover transition-transform duration-700 ease-[var(--dn-ease)] group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Play Badge */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Play size={16} weight="fill" />
              </div>

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-1/2">
                <div className="flex items-center gap-1.5 text-[10px] text-white/50 mb-2 font-medium">
                  <CalendarBlank size={12} />
                  {story.date}
                </div>
                <h3 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-[var(--dn-accent)] transition-colors duration-300">
                  {story.title}
                </h3>
                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {story.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
