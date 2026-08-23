import type { MetadataRoute } from "next";
import { getPublishedSlugs, getToolSlugs } from "@/lib/firebase/server-data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.desknomads.store";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/open-source`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/submit-tool`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/advertise`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Category pages
  const categories = [
    "ai-tools",
    "chatgpt",
    "gemini",
    "claude",
    "ai-agents",
    "remote-jobs",
    "work-from-home",
    "freelancing",
    "side-hustles",
    "passive-income",
    "productivity",
    "automation",
    "digital-business",
    "saas",
    "startups",
    "future-careers",
    "online-income",
    "digital-products",
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${siteUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Dynamic article URLs from Firestore.
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const articles = await getPublishedSlugs();
    articlePages = articles
      .filter((a) => a.slug)
      .flatMap((a) => [
        {
          url: `${siteUrl}/${a.slug}`,
          lastModified: new Date(a.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        },
        {
          url: `${siteUrl}/stories/${a.slug}`,
          lastModified: new Date(a.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        },
      ]);
  } catch (err) {
    console.error("Sitemap article fetch failed:", err);
  }

  // Dynamic tool detail URLs from Firestore.
  let toolPages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getToolSlugs();
    toolPages = slugs.map((slug) => ({
      url: `${siteUrl}/tools/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error("Sitemap tool fetch failed:", err);
  }

  return [...staticPages, ...categoryPages, ...articlePages, ...toolPages];
}
