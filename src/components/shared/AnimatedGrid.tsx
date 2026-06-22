"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, ArrowRight } from "@phosphor-icons/react";

const ease = [0.32, 0.72, 0, 1] as const;

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  readingTime: number;
  views: number;
  publishedAt: string;
}

interface CategoryHeaderProps {
  name: string;
  icon: string;
  description: string;
  color: string;
  count: number;
}

function formatViews(views: number): string {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

export function AnimatedCategoryHeader({ name, icon, description, color, count }: CategoryHeaderProps) {
  return (
    <div className="mb-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-4"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                   border border-white/[0.06]"
          style={{ background: `${color}12` }}
        >
          {icon}
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            {name}
          </h1>
          <p className="text-sm text-[var(--dn-text-muted)] mt-0.5">{count} articles</p>
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
        className="text-base text-[var(--dn-text-secondary)] max-w-[60ch] leading-relaxed"
      >
        {description}
      </motion.p>
    </div>
  );
}

export function AnimatedArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {articles.map((article, i) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease }}
        >
          <Link href={`/${article.slug}`} className="group block h-full">
            <article className="flex flex-col h-full rounded-2xl overflow-hidden border border-white/[0.06]
                              bg-[var(--dn-bg-card)] hover:border-white/[0.12] hover:bg-[var(--dn-bg-card-hover)]
                              transition-all duration-500 ease-[var(--dn-ease)]
                              hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-[var(--dn-ease)]
                           group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex flex-col flex-1 p-5">
                <h2 className="text-[15px] font-semibold text-white leading-snug mb-2 line-clamp-2
                             group-hover:text-[var(--dn-accent)] transition-colors duration-300">
                  {article.title}
                </h2>
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
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <ArrowRight
                    size={11}
                    className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1
                             transition-all duration-300 text-[var(--dn-accent)]"
                  />
                </div>
              </div>
            </article>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
