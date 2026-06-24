/**
 * Central configuration for the DeskNomads Autonomous Content Engine.
 * All tunables, model ids, categories, and env accessors live here.
 */

// ─── Models (OpenRouter) ────────────────────────────────────────
export const MODELS = {
  /** Primary text model for planning + article generation. */
  text: process.env.OPENROUTER_TEXT_MODEL || "google/gemini-3-flash-preview",
  /** Lighter model for short structured tasks (scoring, seo extraction). */
  textFast: process.env.OPENROUTER_FAST_MODEL || "google/gemini-3-flash-preview",
  /** Image generation model. */
  image: process.env.OPENROUTER_IMAGE_MODEL || "google/gemini-3.1-flash-image",
} as const;

// ─── Topic scoring weights (must sum to 1.0) ────────────────────
// Tuned for a long-tail, low-competition strategy: reward easy-to-rank niche
// topics over high-volume head terms big publishers already dominate.
export const SCORE_WEIGHTS = {
  searchDemand: 0.22,
  trendVelocity: 0.18,
  lowCompetition: 0.3,
  viralPotential: 0.1,
  relevance: 0.2,
} as const;

// ─── Engine defaults (overridable via Firestore settings/engine) ─
export const ENGINE_DEFAULTS = {
  autoPublishEnabled: false, // safety: off until an admin enables it
  articlesPerDay: 2,
  minTopicScore: 75,
  minFactCheckConfidence: 85,
  minWordCount: 2500,
  publishHourIST: 9,
  discoverHourIST: 6,
} as const;

// ─── Content categories (from spec) ─────────────────────────────
export const CATEGORIES = [
  "AI Tools",
  "ChatGPT",
  "Gemini",
  "Claude",
  "AI Agents",
  "Remote Jobs",
  "Work From Home",
  "Freelancing",
  "Side Hustles",
  "Passive Income",
  "Productivity",
  "Automation",
  "Digital Business",
  "SaaS",
  "Startups",
  "Future Careers",
  "Online Income",
  "Digital Products",
] as const;

export type CategoryName = (typeof CATEGORIES)[number];

export function slugifyCategory(name: string): string {
  return name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

// ─── Site / brand ───────────────────────────────────────────────
export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "DeskNomads",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://desknomads.com",
  adsensePublisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "pub-1562600430581360",
  defaultAuthorId: "desknomads-team",
};

// ─── Env accessors ──────────────────────────────────────────────
export function getOpenRouterKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new EngineConfigError("OPENROUTER_API_KEY is not set");
  return key;
}

export function getTavilyKey(): string {
  const key = process.env.TAVILY_API_KEY;
  if (!key) throw new EngineConfigError("TAVILY_API_KEY is not set");
  return key;
}

export function getCronSecret(): string | undefined {
  return process.env.CRON_SECRET;
}

/**
 * Google Search Console property URL. Use the exact form verified in GSC:
 *  - URL-prefix property: "https://desknomads.com/"
 *  - Domain property:     "sc-domain:desknomads.com"
 */
export function getGscSiteUrl(): string {
  return process.env.GSC_SITE_URL || `${SITE.url}/`;
}

/**
 * Service-account credentials for the Search Console API. Falls back to the
 * Firebase Admin service account if dedicated GSC_* vars are not set.
 * The service account email must be added as a user on the GSC property.
 */
export function getGscCredentials(): { clientEmail: string; privateKey: string } {
  const clientEmail = process.env.GSC_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.GSC_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) {
    throw new EngineConfigError("Search Console credentials missing (set GSC_CLIENT_EMAIL/GSC_PRIVATE_KEY or Firebase admin creds)");
  }
  return { clientEmail, privateKey };
}

/** Thrown when required configuration/keys are missing. */
export class EngineConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EngineConfigError";
  }
}

/** Generic engine error used to short-circuit the pipeline cleanly. */
export class EngineError extends Error {
  stage: string;
  constructor(stage: string, message: string) {
    super(message);
    this.name = "EngineError";
    this.stage = stage;
  }
}
