/**
 * SEO Engine — TOC extraction, heading-id normalization, keyword density,
 * SEO/readability scoring, and structured-data (schema) generation.
 */
import { SITE } from "./config";
import type { Article, TOCItem, FAQ } from "@/types";

function kebab(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

/** Ensure every <h2>/<h3> has a unique kebab-case id; return updated html. */
export function ensureHeadingIds(html: string): string {
  const used = new Set<string>();
  return html.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (full, tag, attrs, inner) => {
    const id = (attrs.match(/id=["']([^"']+)["']/i)?.[1] || kebab(inner) || "section").trim();
    let unique = id;
    let n = 2;
    while (used.has(unique)) unique = `${id}-${n++}`;
    used.add(unique);
    const cleanedAttrs = attrs.replace(/\s*id=["'][^"']*["']/i, "");
    return `<${tag}${cleanedAttrs} id="${unique}">${inner}</${tag}>`;
  });
}

/** Build a Table of Contents from H2/H3 headings. */
export function extractToc(html: string): TOCItem[] {
  const toc: TOCItem[] = [];
  const re = /<(h2|h3)[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    toc.push({
      id: m[2],
      text: m[3].replace(/<[^>]+>/g, "").trim(),
      level: m[1].toLowerCase() === "h2" ? 2 : 3,
    });
  }
  return toc;
}

/** Keyword density as a percentage of total words. */
export function keywordDensity(html: string, keyword: string): number {
  const text = html.replace(/<[^>]+>/g, " ").toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length || !keyword) return 0;
  const kw = keyword.toLowerCase();
  const matches = (text.match(new RegExp(`\\b${escapeRe(kw)}\\b`, "g")) || []).length;
  return +((matches / words.length) * 100).toFixed(2);
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Heuristic SEO score (0-100). */
export function computeSeoScore(input: {
  html: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  wordCount: number;
  faqCount: number;
  internalLinkCount: number;
  hasImage: boolean;
}): number {
  let score = 0;
  const titleLen = input.seoTitle.length;
  if (titleLen >= 40 && titleLen <= 60) score += 15;
  else if (titleLen > 0 && titleLen <= 70) score += 9;
  if (input.seoTitle.toLowerCase().includes(input.primaryKeyword.toLowerCase())) score += 10;

  const descLen = input.metaDescription.length;
  if (descLen >= 140 && descLen <= 160) score += 12;
  else if (descLen >= 100) score += 7;

  if (input.wordCount >= 2500) score += 18;
  else if (input.wordCount >= 1500) score += 10;

  const density = keywordDensity(input.html, input.primaryKeyword);
  if (density >= 0.5 && density <= 2.5) score += 12;
  else if (density > 0) score += 5;

  const h2s = (input.html.match(/<h2/gi) || []).length;
  if (h2s >= 6) score += 10;
  else if (h2s >= 3) score += 5;

  if (input.faqCount >= 3) score += 8;
  if (input.internalLinkCount >= 3) score += 8;
  if (input.hasImage) score += 5;

  return Math.min(100, score);
}

/** Simple Flesch-style readability proxy (0-100, higher = easier). */
export function computeReadabilityScore(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;
  const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0);
  const flesch = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount);
  return Math.max(0, Math.min(100, Math.round(flesch)));
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  const groups = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").match(/[aeiouy]{1,2}/g);
  return groups ? groups.length : 1;
}

// ─── Structured data (JSON-LD) ──────────────────────────────────

export function articleSchema(article: Article) {
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
      name: article.author?.name || SITE.name,
      url: article.author ? `${SITE.url}/author/${article.author.slug}` : SITE.url,
    },
    publisher: organizationSchema(),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/${article.slug}` },
    wordCount: article.wordCount,
    articleSection: article.category?.name,
    keywords: article.tags.join(", "),
  };
}

export function faqSchema(faqs: FAQ[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: article.category?.name || "Articles",
        item: `${SITE.url}/category/${article.category?.slug || "all"}`,
      },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE.url}/${article.slug}` },
    ],
  };
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: { "@type": "ImageObject", url: `${SITE.url}/logo.png` },
    sameAs: [
      "https://twitter.com/desknomads",
      "https://linkedin.com/company/desknomads",
      "https://youtube.com/@desknomads",
    ],
  };
}

export function canonicalFor(slug: string): string {
  return `${SITE.url}/${slug}`;
}
