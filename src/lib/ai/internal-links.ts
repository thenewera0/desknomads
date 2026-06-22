/**
 * Internal Linking Engine — inserts 3-8 contextual links to existing
 * DeskNomads articles, prioritizing the same category and keyword cluster.
 */
import { chatJSON } from "./openrouter";
import type { InternalLink } from "@/types";

export interface LinkableArticle {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  tags: string[];
}

export interface LinkingResult {
  html: string;
  links: InternalLink[];
}

/**
 * Given article HTML and a pool of existing articles, choose anchor phrases
 * already present in the body and wrap them in links to the best matches.
 */
export async function insertInternalLinks(
  html: string,
  candidates: LinkableArticle[],
  opts: { categoryId?: string; tags?: string[]; min?: number; max?: number } = {}
): Promise<LinkingResult> {
  const min = opts.min ?? 3;
  const max = opts.max ?? 8;
  if (candidates.length === 0) return { html, links: [] };

  // Prioritize same-category + tag-overlap candidates.
  const ranked = [...candidates]
    .map((c) => {
      let score = 0;
      if (opts.categoryId && c.categoryId === opts.categoryId) score += 3;
      const overlap = (opts.tags || []).filter((t) => c.tags?.includes(t)).length;
      score += overlap;
      return { c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 25)
    .map((x) => x.c);

  const plainText = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 9000);

  const parsed = await chatJSON<{
    links: { anchorText: string; articleId: string }[];
  }>([
    {
      role: "system",
      content:
        "You place internal links for SEO. You only choose anchor phrases that appear verbatim in the article body and link them to the single most relevant target article. Never invent anchor text.",
    },
    {
      role: "user",
      content: `Article body (text):
${plainText}

Candidate target articles:
${ranked.map((c) => `- id:${c.id} | "${c.title}"`).join("\n")}

Pick ${min}-${max} natural anchor phrases that exist in the body and map each to the most relevant target id. Each anchor phrase must be unique and 2-6 words. Return ONLY JSON: {"links":[{"anchorText":"...","articleId":"..."}]}`,
    },
  ]);

  const byId = new Map(ranked.map((c) => [c.id, c]));
  const links: InternalLink[] = [];
  let result = html;
  const usedAnchors = new Set<string>();

  for (const l of parsed.links || []) {
    const target = byId.get(l.articleId);
    if (!target || !l.anchorText) continue;
    const anchor = l.anchorText.trim();
    if (usedAnchors.has(anchor.toLowerCase())) continue;
    const url = `/${target.slug}`;

    // Replace first occurrence that is NOT already inside an anchor tag.
    const re = new RegExp(`(?<!<a[^>]*>[^<]*)\\b(${escapeRe(anchor)})\\b(?![^<]*<\\/a>)`, "i");
    if (re.test(result)) {
      result = result.replace(re, `<a href="${url}" class="dn-internal-link">$1</a>`);
      links.push({ text: anchor, url, articleId: target.id });
      usedAnchors.add(anchor.toLowerCase());
    }
    if (links.length >= max) break;
  }

  return { html: result, links };
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
