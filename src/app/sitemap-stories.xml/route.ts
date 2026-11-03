import { getPublishedSlugs } from "@/lib/firebase/server-data";
import { getSiteUrl } from "@/lib/utils";

export const revalidate = 86400; // 24 hours

export async function GET() {
  const siteUrl = getSiteUrl();

  let storiesXml = "";
  try {
    const articles = await getPublishedSlugs();
    storiesXml = articles
      .filter((a) => a.slug)
      .map((a) => `  <url>
    <loc>${siteUrl}/stories/${a.slug}</loc>
    <lastmod>${new Date(a.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`)
      .join("\n");
  } catch (err) {
    console.error("Stories sitemap error:", err);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${storiesXml}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}
