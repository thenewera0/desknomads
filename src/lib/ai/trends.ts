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
  threshold = 0.6
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
  const signalDigest = signals
    .slice(0, 80)
    .map((s, i) => `${i + 1}. [${s.source}] ${s.title}${s.engagement ? ` (eng:${s.engagement})` : ""}`)
    .join("\n");

  const existingBlock = existingTitles.length
    ? `\n\nWe have ALREADY published these articles — do NOT propose anything that overlaps or is a near-duplicate of them (different angle/topic only):\n${existingTitles
        .slice(0, 80)
        .map((t) => `- ${t}`)
        .join("\n")}`
    : "";

  const system = `You are the editor-in-chief of DeskNomads, an authority site about AI tools, remote work, and online income. Your SEO strategy is to win LONG-TAIL, LOW-COMPETITION searches — specific, practical, "how-to" and "best free X" content that ranks fast because big sites ignore the niche. You turn trending signals into these specific article opportunities. You only propose ideas that genuinely fit these categories: ${CATEGORIES.join(", ")}.`;

  const user = `Here are trending signals gathered today from Hacker News, Reddit, Google Trends, and news sources:

${signalDigest}${existingBlock}

Propose the ${count} strongest article opportunities for DeskNomads. STRATEGY — be specific and beat low-competition long-tail queries instead of fighting big publishers on broad head terms.

Use a MIX of these high-click-through title formats (vary them across the batch — do NOT make them all the same shape):
- Listicle: "Top 10 AI Tools for <specific job>", "7 Free <X> for <audience> (2026)".
- How-to / step-by-step: "How to <do X> — Step-by-Step (2026)", "How to Use <tool> for <specific task>".
- Best-of: "Best Free <tool category> for <specific audience> in 2026".
- Question / decision: "What to Do When <specific problem>", "When Should You <action>?", "Is <tool> Worth It for <use-case>?".
- Curiosity / insider: "5 <things> Nobody Tells You About <topic>", "Secret <tool> Tricks <audience> Use", "5 <X> Mistakes That Cost You <outcome>".
- Comparisons of NICHE tools, and "<tool> for <specific job>" guides.

Aim for a balanced spread across the ${count} ideas — e.g. a few "Top N…", a few "How to…", a couple "Best…", one or two "What to do when…/When to…", and one or two curiosity/insider angles.

RULES:
- REAL SEARCH DEMAND IS REQUIRED. Every topic must be something a meaningful number of people actually search for. AVOID brand-new, no-name, or obscure tools almost nobody has heard of yet (they have ~zero search volume even if competition is low). Prefer well-known tools (ChatGPT, Claude, Gemini, Midjourney, Notion, Excel, Canva, etc.) and common tasks/problems (resume, invoices, data entry, video editing, job search, budgeting, automation) paired with a specific angle.
- The sweet spot = a topic with proven demand + a specific enough angle/use-case to rank without fighting huge publishers. NOT zero-competition obscurity nobody searches.
- Titles must be SPECIFIC and curiosity-driven so they earn the click, but honest (no clickbait the article can't deliver).
- Favor specific long-tail keywords (well-known tool + a use-case + "free"/"2026"/"step by step") over ultra-broad terms like "best AI tools" or "make money online".
- Tie ideas to the trending signals where possible (freshness).
- Most ideas should be searchIntent "informational" (how-to / guide / list). Include the year (2026) where natural.
- Each of the ${count} ideas must be about a DISTINCT topic — no two ideas covering the same tool/task/angle, and nothing overlapping the already-published list above.

Return ONLY JSON of the shape:
{"opportunities":[{"title":"specific, high-CTR title — vary the format (Top N.../How to.../Best.../What to do when.../curiosity)","topic":"1-sentence description","category":"one of the allowed categories","primaryKeyword":"the specific long-tail search keyword","secondaryKeywords":["related long-tail variants"],"searchIntent":"informational|commercial|transactional|navigational","angle":"the specific niche/use-case that makes this low-competition","sourceUrls":["url1","url2"]}]}`;

  const parsed = await chatJSON<{ opportunities: CandidateOpportunity[] }>([
    { role: "system", content: system },
    { role: "user", content: user },
  ]);

  const urlByTitle = new Map(signals.map((s) => [s.title, s.url]));
  const normalized = (parsed.opportunities || []).map((o) => ({
    ...o,
    category: CATEGORIES.includes(o.category as never) ? o.category : CATEGORIES[0],
    secondaryKeywords: o.secondaryKeywords || [],
    sourceUrls: (o.sourceUrls && o.sourceUrls.length ? o.sourceUrls : [...urlByTitle.values()].slice(0, 2)).filter(
      Boolean
    ),
  }));

  // Final safety net: strip near-duplicates the prompt let slip through
  // (against published articles and within this batch).
  return dedupeCandidates(normalized, existingTitles);
}
