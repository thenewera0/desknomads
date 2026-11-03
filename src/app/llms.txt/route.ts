import { getPublishedArticles, getApprovedTools } from "@/lib/firebase/server-data";
import { getSiteUrl } from "@/lib/utils";

export const revalidate = 86400; // 24 hours

export async function GET() {
  const siteUrl = getSiteUrl();

  let articles: { title: string; slug: string; excerpt: string; category?: { name: string } }[] = [];
  let tools: { name: string; slug: string; description: string }[] = [];

  try {
    const [published, approvedTools] = await Promise.all([
      getPublishedArticles(40),
      getApprovedTools(20),
    ]);
    articles = published;
    tools = approvedTools;
  } catch (err) {
    console.error("llms.txt generation error:", err);
  }

  const categoryList = [
    { name: "AI Tools", slug: "ai-tools", desc: "Comprehensive reviews, benchmarks, and workflows for cutting-edge AI software." },
    { name: "Remote Jobs", slug: "remote-jobs", desc: "Vetted work-from-home career pathways, non-phone positions, and remote resume guides." },
    { name: "Passive Income", slug: "passive-income", desc: "Digital business models, online income strategies, and automated revenue streams." },
    { name: "Automation", slug: "automation", desc: "AI agents, no-code workflows, Zapier/Make automations, and digital productivity." },
    { name: "Productivity", slug: "productivity", desc: "Modern developer tools, cognitive systems, and deep-work workflows." },
  ];

  const categoriesMd = categoryList
    .map((c) => `- [${c.name}](${siteUrl}/category/${c.slug}): ${c.desc}`)
    .join("\n");

  const articlesMd = articles
    .map((a) => `- [${a.title}](${siteUrl}/${a.slug}): ${a.excerpt}`)
    .join("\n");

  const toolsMd = tools
    .map((t) => `- [${t.name}](${siteUrl}/tools/${t.slug}): ${t.description}`)
    .join("\n");

  const content = `# DeskNomads
> DeskNomads is a leading knowledge publication and directory dedicated to Artificial Intelligence tools, remote work opportunities, intelligent automation, and passive income systems.

## Mission & Scope
DeskNomads equips knowledge workers, independent creators, and digital entrepreneurs with vetted, in-depth tutorials, practical tool comparisons, and actionable guides to build sustainable careers and workflows in the AI economy.

## Core Categories & Topics
${categoriesMd}

## Key Guides & Articles
${articlesMd}

## Curated Tools Directory
${toolsMd}

## Feeds & Machine-Readable Endpoints
- XML Sitemap: ${siteUrl}/sitemap.xml
- Web Stories Sitemap: ${siteUrl}/sitemap-stories.xml
- RSS Feed: ${siteUrl}/feed.xml
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
