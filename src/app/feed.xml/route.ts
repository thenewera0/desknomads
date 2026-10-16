// RSS Feed route — /feed.xml (published articles from Firestore)
import { getPublishedArticles } from "@/lib/firebase/server-data";
import { getSiteUrl } from "@/lib/utils";

export const revalidate = 3600;

export async function GET() {
  const siteUrl = getSiteUrl();

  let articles: {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    publishedAt: string;
    author: string;
  }[] = [];
  try {
    const published = await getPublishedArticles(50);
    articles = published.map((a) => ({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      category: a.category?.name || "Articles",
      publishedAt: a.publishedAt || a.createdAt,
      author: a.author?.name || "DeskNomads Team",
    }));
  } catch (err) {
    console.error("RSS feed fetch failed:", err);
  }

  const itemsXml = articles
    .map(
      (article) => `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${article.slug}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <category>${article.category}</category>
      <author>${article.author}</author>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>DeskNomads — AI Tools, Remote Jobs &amp; Passive Income</title>
    <link>${siteUrl}</link>
    <description>Discover the best AI tools, remote work opportunities, automation systems, and online income strategies.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>DeskNomads</title>
      <link>${siteUrl}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
