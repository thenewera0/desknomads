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

/**
 * Google Autocomplete — the REAL queries people type into Google. This is the
 * strongest demand signal we have (free, no key): if Google suggests it, people
 * actually search it. Seeds are money-intent prefixes aligned to our niche; the
 * suggestions Google returns are proven, winnable long-tails. These are marked
 * as high-priority so synthesis anchors articles to genuine demand instead of
 * inventing obscure topics nobody searches.
 */
async function fromGoogleAutocomplete(): Promise<RawSignal[]> {
  const seeds = [
    "how to use chatgpt for",
    "how to use chatgpt to make money",
    "how to make money with ai",
    "how to make money online",
    "best ai tools for",
    "ai tools for",
    "free ai tools for",
    "best free ai",
    "chatgpt prompts for",
    "how to automate",
    "claude ai for",
    "google gemini for",
    "ai agents for",
    "how to use ai to",
    "how to earn money with chatgpt",
    "ai automation for",
    "remote jobs no experience",
    "work from home jobs",
    "passive income with ai",
    "side hustle with ai",
    "notion ai for",
    "best ai for",
    "how to start freelancing",
    "ai side hustle",
    "how to grow with ai",
  ];
  const out: RawSignal[] = [];
  await Promise.all(
    seeds.map(async (seed) => {
      try {
        const res = await fetch(
          `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=${encodeURIComponent(seed)}`,
          { headers: { "User-Agent": "Mozilla/5.0 DeskNomads-ContentEngine/1.0" } }
        );
        if (!res.ok) return;
        const data = await res.json(); // shape: ["seed", ["suggestion1", ...]]
        const suggestions: string[] = Array.isArray(data?.[1]) ? data[1] : [];
        for (const s of suggestions) {
          if (!s || s.length < 8) continue;
          out.push({
            title: s,
            url: `https://www.google.com/search?q=${encodeURIComponent(s)}`,
            source: "Google Autocomplete",
            engagement: 1000, // flag as proven-demand so it sorts to the top
          });
        }
      } catch {
        /* non-fatal */
      }
    })
  );
  return out;
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
    fromGoogleAutocomplete(),
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

// Words that carry no topical signal — stripped before comparing titles so we
// match on the DISTINCTIVE terms (tool names, tasks) not the format scaffolding.
const DEDUP_STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "for", "with", "your", "you", "how", "to", "of",
  "in", "on", "is", "are", "when", "what", "why", "best", "top", "free", "guide",
  "tutorial", "step", "steps", "tips", "ways", "using", "use", "vs", "2025", "2026",
  "ai", "tool", "tools", "app", "apps", "software", "online", "new", "should",
  "do", "does", "can", "that", "this", "from", "into", "get", "make",
]);

function topicTokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !DEDUP_STOPWORDS.has(w))
  );
}

/** Overlap coefficient of distinctive tokens: 1.0 = same core topic. */
function topicOverlap(a: string, b: string): number {
  const A = topicTokens(a);
  const B = topicTokens(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / Math.min(A.size, B.size);
}

/**
 * Drop candidates that substantially overlap an already-published article OR an
 * earlier candidate in the same batch. Compares the distinctive tokens of the
 * title + primary keyword, so two "Superset IDE" or "automate your job" ideas
 * collapse to one even when the surrounding wording differs.
 */
function dedupeCandidates(
  candidates: CandidateOpportunity[],
  existingTitles: string[],
  threshold = 0.5
): CandidateOpportunity[] {
  const kept: string[] = [...existingTitles];
  const out: CandidateOpportunity[] = [];
  for (const c of candidates) {
    const fingerprint = `${c.title} ${c.primaryKeyword || ""}`;
    const dup = kept.some((prev) => topicOverlap(fingerprint, prev) >= threshold);
    if (dup) continue;
    out.push(c);
    kept.push(fingerprint);
  }
  return out;
}

/**
 * Ask the LLM to convert raw signals into concrete, SEO-shaped article ideas
 * that fit DeskNomads' categories.
 */
export async function synthesizeOpportunities(
  signals: RawSignal[],
  count = 12,
  existingTitles: string[] = []
): Promise<CandidateOpportunity[]> {
  // Split proven-demand real Google searches from novelty trend signals so the
  // prompt can anchor articles to what people actually search.
  const realQueries = signals.filter((s) => s.source === "Google Autocomplete");
  const trendSignals = signals.filter((s) => s.source !== "Google Autocomplete");

  const realQueryDigest = realQueries
    .slice(0, 70)
    .map((s, i) => `${i + 1}. ${s.title}`)
    .join("\n");
  const trendDigest = trendSignals
    .slice(0, 35)
    .map((s) => `- [${s.source}] ${s.title}${s.engagement ? ` (eng:${s.engagement})` : ""}`)
    .join("\n");

  const existingBlock = existingTitles.length
    ? `\n\nWe have ALREADY published these articles — do NOT propose anything that overlaps or is a near-duplicate of them (different angle/topic only):\n${existingTitles
        .slice(0, 80)
        .map((t) => `- ${t}`)
        .join("\n")}`
    : "";

  const batchSize = 4;
  const numBatches = Math.ceil(count / batchSize);
  let allNormalized: CandidateOpportunity[] = [];
  const urlByTitle = new Map(signals.map((s) => [s.title, s.url]));

  for (let b = 0; b < numBatches; b++) {
    const batchCount = Math.min(batchSize, count - b * batchSize);
    const system = `You are the editor-in-chief of DeskNomads, an authority site about AI tools, remote work, and online income. Your SEO strategy: win specific, LONG-TAIL searches that REAL PEOPLE ACTUALLY MAKE — proven-demand queries that big publishers under-serve, so you rank fast. You NEVER invent clever-sounding topics nobody searches. You only propose ideas that fit these categories: ${CATEGORIES.join(", ")}.`;

    const user = `PRIMARY INPUT — REAL GOOGLE SEARCHES (these are actual autocomplete queries people are typing into Google right now; each one has proven search demand):
${realQueryDigest || "(none available — fall back to the trending signals below)"}

SECONDARY INPUT — TRENDING NOW (use only for freshness/timeliness or to pick which real query is hot; do NOT build articles on obscure items here):
${trendDigest}${existingBlock}

Propose ${batchCount} strong article opportunities for DeskNomads.

THE #1 RULE — GROUND EVERY IDEA IN REAL DEMAND:
- At least ${Math.max(1, batchCount - 1)} of the ${batchCount} ideas MUST be built DIRECTLY on a query from the REAL GOOGLE SEARCHES list above. Set that exact query (or a very close long-tail of it) as the primaryKeyword — this is how we guarantee the topic has real search volume.
- Turn the raw query into a specific, higher-CTR article title, but keep it TRUE to the search intent (someone searching that query must be fully satisfied by this article).
- REJECT any idea you cannot tie to a real query or an obvious high-volume variant. No invented niches, no obscure tools, no "concert visuals business" style topics nobody searches.
- Prefer well-known tools (ChatGPT, Claude, Gemini, Notion, Canva, Excel, etc.) and common money/work tasks. Specific enough to rank, popular enough to get traffic — that is the target.

Use a MIX of high-CTR title formats across the batch (listicle "Top 10 / 7 Free…", how-to "How to…", best-of "Best Free … for …", question "What to Do When…", curiosity "5 … Nobody Tells You"). Vary them.

THE CURRENT YEAR IS ${new Date().getUTCFullYear()}. When a year appears in a title, it MUST be ${new Date().getUTCFullYear()} — NEVER a past year like 2024 or 2025.

Each of the ${batchCount} ideas must be a DISTINCT topic. Most should be searchIntent "informational".

Return ONLY JSON of the shape:
{"opportunities":[{"title":"specific, high-CTR title","topic":"1-sentence description","category":"one of the allowed categories","primaryKeyword":"the REAL search query this targets (from the list above, or a close high-volume long-tail)","secondaryKeywords":["related real queries"],"searchIntent":"informational|commercial|transactional|navigational","angle":"why this is winnable (specific but real demand)","sourceUrls":["url1","url2"]}]}`;

    try {
      const parsed = await chatJSON<{ opportunities: CandidateOpportunity[] }>([
        { role: "system", content: system },
        { role: "user", content: user },
      ]);

      const curYear = new Date().getUTCFullYear();
      const fixYear = (s: string) => s.replace(/\b20(1\d|2[0-5])\b/g, String(curYear));
      const normalized = (parsed.opportunities || []).map((o) => ({
        ...o,
        title: fixYear(o.title || ""),
        category: CATEGORIES.includes(o.category as never) ? o.category : CATEGORIES[0],
        secondaryKeywords: o.secondaryKeywords || [],
        sourceUrls: (o.sourceUrls && o.sourceUrls.length ? o.sourceUrls : [...urlByTitle.values()].slice(0, 2)).filter(
          Boolean
        ),
      }));
      allNormalized.push(...normalized);
    } catch (err) {
      console.warn(`[engine:discovery] Batch ${b} failed to synthesize opportunities`, err);
    }
  }

  // Final safety net: strip near-duplicates the prompt let slip through
  // (against published articles and within this batch).
  return dedupeCandidates(allNormalized, existingTitles);
}
