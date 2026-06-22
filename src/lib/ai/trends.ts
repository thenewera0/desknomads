/**
 * Trend Discovery Engine — the Content Opportunity Scanner.
 *
 * Pulls signals from multiple sources (free + Tavily), then asks the LLM to
 * synthesize concrete, DeskNomads-relevant article opportunities.
 */
import { CATEGORIES } from "./config";
import { chatJSON } from "./openrouter";
import { tavilySearch } from "./tavily";

export interface RawSignal {
  title: string;
  url: string;
  source: string;
  engagement?: number; // upvotes / points / comments where available
  published?: string;
}

// ─── Free sources ───────────────────────────────────────────────

/** Hacker News front-page + AI/work stories via Algolia API. */
async function fromHackerNews(): Promise<RawSignal[]> {
  const queries = ["AI", "remote work", "side hustle", "automation", "SaaS"];
  const out: RawSignal[] = [];
  await Promise.all(
    queries.map(async (q) => {
      try {
        const res = await fetch(
          `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(
            q
          )}&tags=story&numericFilters=points>50&hitsPerPage=10`
        );
        if (!res.ok) return;
        const data = await res.json();
        for (const hit of data.hits || []) {
          if (!hit.title) continue;
          out.push({
            title: hit.title,
            url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
            source: "Hacker News",
            engagement: (hit.points || 0) + (hit.num_comments || 0),
            published: hit.created_at,
          });
        }
      } catch {
        /* non-fatal */
      }
    })
  );
  return out;
}

/** Reddit hot posts from relevant subreddits via public JSON. */
async function fromReddit(): Promise<RawSignal[]> {
  const subs = [
    "artificial",
    "ChatGPT",
    "OpenAI",
    "automation",
    "WorkOnline",
    "passive_income",
    "Entrepreneur",
    "freelance",
  ];
  const out: RawSignal[] = [];
  await Promise.all(
    subs.map(async (sub) => {
      try {
        const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=8`, {
          headers: { "User-Agent": "DeskNomads-ContentEngine/1.0" },
        });
        if (!res.ok) return;
        const data = await res.json();
        for (const child of data?.data?.children || []) {
          const p = child.data;
          if (!p?.title || p.stickied) continue;
          out.push({
            title: p.title,
            url: `https://reddit.com${p.permalink}`,
            source: `Reddit r/${sub}`,
            engagement: (p.ups || 0) + (p.num_comments || 0),
            published: new Date((p.created_utc || 0) * 1000).toISOString(),
          });
        }
      } catch {
        /* non-fatal */
      }
    })
  );
  return out;
}

/** Google Trends daily trending searches (US RSS, no key required). */
async function fromGoogleTrends(): Promise<RawSignal[]> {
  try {
    const res = await fetch(
      "https://trends.google.com/trending/rss?geo=US",
      { headers: { "User-Agent": "Mozilla/5.0 DeskNomads-ContentEngine/1.0" } }
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.split("<item>").slice(1);
    return items
      .map((item) => {
        const title = (item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "")
          .replace(/<!\[CDATA\[|\]\]>/g, "")
          .trim();
        const traffic = item.match(/<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/)?.[1] || "";
        return {
          title,
          url: "https://trends.google.com/trending?geo=US",
          source: "Google Trends",
          engagement: parseInt(traffic.replace(/[^0-9]/g, ""), 10) || undefined,
        } as RawSignal;
      })
      .filter((s) => s.title);
  } catch {
    return [];
  }
}

/** Tavily news sweep across core themes (Product Hunt, AI news, industry blogs). */
async function fromTavilyNews(): Promise<RawSignal[]> {
  const themes = [
    "new AI tools launched this week",
    "trending AI agents and automation",
    "best remote jobs and side hustles trends",
    "passive income and online income trends",
  ];
  const out: RawSignal[] = [];
  await Promise.all(
    themes.map(async (q) => {
      try {
        const r = await tavilySearch(q, { topic: "news", days: 7, maxResults: 6 });
        for (const item of r.results) {
          out.push({
            title: item.title,
            url: item.url,
            source: "News/Tavily",
            engagement: Math.round((item.score || 0) * 100),
            published: item.published_date,
          });
        }
      } catch {
        /* non-fatal — discovery should survive a single source failing */
      }
    })
  );
  return out;
}

/** Gather raw signals from all sources. Resilient: never throws. */
export async function gatherSignals(): Promise<RawSignal[]> {
  const groups = await Promise.allSettled([
    fromHackerNews(),
    fromReddit(),
    fromGoogleTrends(),
    fromTavilyNews(),
  ]);
  const signals: RawSignal[] = [];
  for (const g of groups) if (g.status === "fulfilled") signals.push(...g.value);
  // De-dupe by normalized title
  const seen = new Set<string>();
  return signals.filter((s) => {
    const key = s.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Synthesis into opportunities ───────────────────────────────

export interface CandidateOpportunity {
  title: string;
  topic: string;
  category: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: "informational" | "commercial" | "transactional" | "navigational";
  angle: string;
  sourceUrls: string[];
}

/**
 * Ask the LLM to convert raw signals into concrete, SEO-shaped article ideas
 * that fit DeskNomads' categories.
 */
export async function synthesizeOpportunities(
  signals: RawSignal[],
  count = 12
): Promise<CandidateOpportunity[]> {
  const signalDigest = signals
    .slice(0, 80)
    .map((s, i) => `${i + 1}. [${s.source}] ${s.title}${s.engagement ? ` (eng:${s.engagement})` : ""}`)
    .join("\n");

  const system = `You are the editor-in-chief of DeskNomads, an authority site about AI tools, remote work, and online income. You turn trending signals into high-value, SEO-focused article opportunities. You only propose ideas that genuinely fit these categories: ${CATEGORIES.join(", ")}.`;

  const user = `Here are trending signals gathered today from Hacker News, Reddit, Google Trends, and news sources:

${signalDigest}

Propose the ${count} strongest article opportunities for DeskNomads. Favor topics with clear search demand, freshness, and monetization potential. Avoid duplicates and avoid generic evergreen ideas with no current hook.

Return ONLY JSON of the shape:
{"opportunities":[{"title":"compelling working title","topic":"1-sentence description","category":"one of the allowed categories","primaryKeyword":"main search keyword","secondaryKeywords":["...","..."],"searchIntent":"informational|commercial|transactional|navigational","angle":"the unique angle that makes this stand out","sourceUrls":["url1","url2"]}]}`;

  const parsed = await chatJSON<{ opportunities: CandidateOpportunity[] }>([
    { role: "system", content: system },
    { role: "user", content: user },
  ]);

  const urlByTitle = new Map(signals.map((s) => [s.title, s.url]));
  return (parsed.opportunities || []).map((o) => ({
    ...o,
    category: CATEGORIES.includes(o.category as never) ? o.category : CATEGORIES[0],
    secondaryKeywords: o.secondaryKeywords || [],
    sourceUrls: (o.sourceUrls && o.sourceUrls.length ? o.sourceUrls : [...urlByTitle.values()].slice(0, 2)).filter(
      Boolean
    ),
  }));
}
