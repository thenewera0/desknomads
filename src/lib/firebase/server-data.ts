/**
 * Server-side published-content reads via the Firebase Admin SDK.
 * Used by public Server Components (article page, sitemap, RSS feed).
 */
import { adminDb } from "./admin";
import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import type { Article, Author, Category, Tool } from "@/types";

function tsToIso(v: unknown): string | null {
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (typeof v === "string") return v;
  return null;
}

function docToArticle(id: string, d: DocumentData): Article {
  return {
    id,
    title: d.title || "",
    slug: d.slug || "",
    excerpt: d.excerpt || "",
    content: d.content || "",
    contentJson: d.contentJson || {},
    featuredImage: d.featuredImage || "",
    authorId: d.authorId || "",
    categoryId: d.categoryId || "",
    status: d.status || "draft",
    publishedAt: tsToIso(d.publishedAt),
    scheduledAt: tsToIso(d.scheduledAt),
    readingTime: d.readingTime || 0,
    wordCount: d.wordCount || 0,
    seoTitle: d.seoTitle || "",
    seoDescription: d.seoDescription || "",
    canonicalUrl: d.canonicalUrl || "",
    ogImage: d.ogImage || "",
    tags: d.tags || [],
    faqs: d.faqs || [],
    toc: d.toc || [],
    internalLinks: d.internalLinks || [],
    seoScore: d.seoScore || 0,
    readabilityScore: d.readabilityScore || 0,
    views: d.views || 0,
    isFeatured: d.isFeatured || false,
    isTrending: d.isTrending || false,
    bloggerOriginalUrl: d.bloggerOriginalUrl || "",
    createdAt: tsToIso(d.createdAt) || new Date().toISOString(),
    updatedAt: tsToIso(d.updatedAt) || new Date().toISOString(),
  };
}

async function hydrate(article: Article): Promise<Article> {
  const [authorSnap, categorySnap] = await Promise.all([
    article.authorId ? adminDb.collection("authors").doc(article.authorId).get() : Promise.resolve(null),
    article.categoryId ? adminDb.collection("categories").doc(article.categoryId).get() : Promise.resolve(null),
  ]);
  if (authorSnap?.exists) article.author = { id: authorSnap.id, ...authorSnap.data() } as Author;
  if (categorySnap?.exists) article.category = { id: categorySnap.id, ...categorySnap.data() } as Category;
  return article;
}

export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  // Single-field equality (auto-indexed); status enforced in memory to avoid
  // requiring a composite index.
  const snap = await adminDb.collection("articles").where("slug", "==", slug).limit(2).get();
  const match = snap.docs.find((d) => d.data().status === "published");
  if (!match) return null;
  return hydrate(docToArticle(match.id, match.data()));
}

export async function getPublishedArticles(limitCount = 1000): Promise<Article[]> {
  const snap = await adminDb.collection("articles").where("status", "==", "published").get();
  return snap.docs
    .map((d) => docToArticle(d.id, d.data()))
    .sort((a, b) => (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt))
    .slice(0, limitCount);
}

/** Published articles with their category attached (for listing widgets). */
export async function getPublishedArticlesWithCategory(
  opts: { limit?: number; categorySlug?: string; trendingOnly?: boolean } = {}
): Promise<Article[]> {
  const [articles, catSnap] = await Promise.all([
    getPublishedArticles(500),
    adminDb.collection("categories").get(),
  ]);
  // Sanitize to plain objects (Firestore Timestamps can't cross to Client Components).
  const toCat = (d: { id: string; data: () => DocumentData }): Category => {
    const x = d.data();
    return { id: d.id, ...x, createdAt: tsToIso(x.createdAt) || "" } as Category;
  };
  const catById = new Map(catSnap.docs.map((d) => [d.id, toCat(d)]));
  const catBySlug = new Map(catSnap.docs.map((d) => [(d.data().slug as string) || "", toCat(d)]));

  let result = articles.map((a) => {
    a.category = catById.get(a.categoryId);
    return a;
  });

  if (opts.categorySlug) {
    const cat = catBySlug.get(opts.categorySlug);
    result = result.filter((a) => a.categoryId === cat?.id);
  }
  if (opts.trendingOnly) {
    const trending = result.filter((a) => a.isTrending);
    if (trending.length >= 3) result = trending;
    else result = [...result].sort((a, b) => b.views - a.views);
  }
  return opts.limit ? result.slice(0, opts.limit) : result;
}

/** Lightweight article "cards" for listing widgets (heavy HTML stripped). */
export async function getArticleCards(
  opts: { limit?: number; categorySlug?: string; trendingOnly?: boolean } = {}
): Promise<Article[]> {
  const articles = await getPublishedArticlesWithCategory(opts);
  return articles.map((a) => ({ ...a, content: "", contentJson: {} }));
}

/** Approved directory tools, featured first. */
export async function getApprovedTools(limit = 50): Promise<Tool[]> {
  const snap = await adminDb.collection("tools").where("status", "==", "approved").get();
  // Map to plain objects (no Firestore Timestamps) for Client Components.
  const tools = snap.docs.map((d) => {
    const t = d.data();
    return {
      id: d.id,
      name: t.name || "",
      slug: t.slug || "",
      description: t.description || "",
      longDescription: t.longDescription || "",
      url: t.url || "",
      logoUrl: t.logoUrl || "",
      screenshotUrl: t.screenshotUrl || "",
      category: t.category || "AI Tools",
      pricing: t.pricing || "freemium",
      tags: t.tags || [],
      rating: t.rating || 0,
      isFeatured: !!t.isFeatured,
      isVerified: !!t.isVerified,
      status: t.status || "approved",
      createdAt: tsToIso(t.createdAt) || "",
    } as Tool;
  });
  tools.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || (b.rating || 0) - (a.rating || 0));
  return tools.slice(0, limit);
}

export async function getAuthorBySlugServer(slug: string): Promise<Author | null> {
  const snap = await adminDb.collection("authors").where("slug", "==", slug).limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();
  return { id: d.id, ...data, createdAt: tsToIso(data.createdAt) || "" } as Author;
}

export async function getArticleCardsByAuthor(authorId: string, limit = 24): Promise<Article[]> {
  const all = await getArticleCards({ limit: 500 });
  return all.filter((a) => a.authorId === authorId).slice(0, limit);
}

// Must match the tag-link transform used on the article page (lowercase, spaces→hyphens).
const tagSlugify = (t: string) => t.toLowerCase().trim().replace(/\s+/g, "-");

export async function getArticleCardsByTag(tagSlug: string, limit = 30): Promise<Article[]> {
  const all = await getArticleCards({ limit: 500 });
  return all.filter((a) => (a.tags || []).some((t) => tagSlugify(t) === tagSlug)).slice(0, limit);
}

export async function getPublishedSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const snap = await adminDb.collection("articles").where("status", "==", "published").get();
  return snap.docs.map((d) => {
    const data = d.data();
    return { slug: data.slug || "", updatedAt: tsToIso(data.updatedAt) || new Date().toISOString() };
  });
}
