import { NextRequest, NextResponse } from "next/server";
import { getPublishedArticlesWithCategory } from "@/lib/firebase/server-data";

export const runtime = "nodejs";
export const revalidate = 300;

/** Public list of published articles for homepage/category widgets. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 24;
  const category = searchParams.get("category") || undefined;
  const trendingOnly = searchParams.get("trending") === "true";

  try {
    const articles = await getPublishedArticlesWithCategory({ limit, categorySlug: category, trendingOnly });
    const lean = articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      featuredImage: a.featuredImage,
      readingTime: a.readingTime,
      views: a.views,
      publishedAt: a.publishedAt,
      tags: a.tags,
      category: a.category
        ? { name: a.category.name, slug: a.category.slug, color: a.category.color }
        : { name: "Articles", slug: "all", color: "#3B82F6" },
    }));
    return NextResponse.json({ success: true, articles: lean });
  } catch (err) {
    console.error("Public articles fetch failed:", err);
    return NextResponse.json({ success: true, articles: [] });
  }
}
