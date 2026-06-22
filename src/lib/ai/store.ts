/**
 * Server-side data layer for the content engine (Firebase Admin SDK).
 * Handles opportunities, generation logs, engine settings, and article
 * persistence/reads used by both the pipeline and public pages.
 */
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue, Timestamp, type DocumentData } from "firebase-admin/firestore";
import { ENGINE_DEFAULTS, SITE, slugifyCategory } from "./config";
import type {
  Article,
  ContentOpportunity,
  EngineSettings,
  GenerationLog,
  PerformanceMetrics,
} from "@/types";
import type { ScoredOpportunity } from "./scoring";
import type { LinkableArticle } from "./internal-links";

function tsToIso(v: unknown): string {
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (typeof v === "string") return v;
  return new Date().toISOString();
}

// ─── Opportunities ──────────────────────────────────────────────
export async function saveOpportunities(scored: ScoredOpportunity[]): Promise<string[]> {
  const batch = adminDb.batch();
  const ids: string[] = [];
  for (const s of scored) {
    const ref = adminDb.collection("opportunities").doc();
    ids.push(ref.id);
    batch.set(ref, {
      title: s.title,
      topic: s.topic,
      category: s.category,
      primaryKeyword: s.primaryKeyword,
      secondaryKeywords: s.secondaryKeywords,
      searchIntent: s.searchIntent,
      angle: s.angle,
      sources: s.sourceUrls.map((url) => ({ title: "", url, source: "" })),
      scores: s.scores,
      topicScore: s.topicScore,
      status: "discovered",
      discoveredAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
  return ids;
}

function docToOpportunity(id: string, d: DocumentData): ContentOpportunity {
  return {
    id,
    title: d.title || "",
    topic: d.topic || "",
    category: d.category || "",
    primaryKeyword: d.primaryKeyword || "",
    secondaryKeywords: d.secondaryKeywords || [],
    searchIntent: d.searchIntent || "informational",
    angle: d.angle || "",
    sources: d.sources || [],
    scores: d.scores || {
      searchDemand: 0,
      trendVelocity: 0,
      lowCompetition: 0,
      viralPotential: 0,
      relevance: 0,
    },
    topicScore: d.topicScore || 0,
    status: d.status || "discovered",
    generatedArticleId: d.generatedArticleId,
    discoveredAt: tsToIso(d.discoveredAt),
    updatedAt: tsToIso(d.updatedAt),
  };
}

export async function getOpportunities(opts: { status?: string; limit?: number } = {}): Promise<ContentOpportunity[]> {
  // Single-field equality filter only (auto-indexed); sort in memory to avoid
  // requiring a composite index.
  const base = adminDb.collection("opportunities");
  const snap = await (opts.status ? base.where("status", "==", opts.status) : base).get();
  const items = snap.docs
    .map((d) => docToOpportunity(d.id, d.data()))
    .sort((a, b) => b.topicScore - a.topicScore);
  return opts.limit ? items.slice(0, opts.limit) : items;
}

export async function getOpportunityById(id: string): Promise<ContentOpportunity | null> {
  const d = await adminDb.collection("opportunities").doc(id).get();
  if (!d.exists) return null;
  return docToOpportunity(d.id, d.data() as DocumentData);
}

/** Eligible topics for auto-generation: score >= min, not yet used. */
export async function getEligibleOpportunities(minScore: number, count: number): Promise<ContentOpportunity[]> {
  // `in` on a single field is auto-indexed; sort/filter in memory (no composite index).
  const snap = await adminDb
    .collection("opportunities")
    .where("status", "in", ["discovered", "queued"])
    .get();
  return snap.docs
    .map((d) => docToOpportunity(d.id, d.data()))
    .filter((o) => o.topicScore >= minScore)
    .sort((a, b) => b.topicScore - a.topicScore)
    .slice(0, count);
}

export async function updateOpportunity(id: string, data: Partial<ContentOpportunity>): Promise<void> {
  await adminDb
    .collection("opportunities")
    .doc(id)
    .update({ ...data, updatedAt: FieldValue.serverTimestamp() });
}

// ─── Generation logs ────────────────────────────────────────────
export async function logGeneration(entry: Omit<GenerationLog, "id" | "createdAt">): Promise<void> {
  await adminDb.collection("generationLogs").add({
    ...entry,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function getLogs(limit = 100): Promise<GenerationLog[]> {
  const snap = await adminDb.collection("generationLogs").orderBy("createdAt", "desc").limit(limit).get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      opportunityId: data.opportunityId,
      articleId: data.articleId,
      stage: data.stage || "",
      status: data.status || "info",
      message: data.message || "",
      model: data.model,
      durationMs: data.durationMs,
      metadata: data.metadata,
      createdAt: tsToIso(data.createdAt),
    };
  });
}

// ─── Engine settings ────────────────────────────────────────────
export async function getEngineSettings(): Promise<EngineSettings> {
  const d = await adminDb.collection("settings").doc("engine").get();
  const data = d.exists ? (d.data() as DocumentData) : {};
  return {
    autoPublishEnabled: data.autoPublishEnabled ?? ENGINE_DEFAULTS.autoPublishEnabled,
    articlesPerDay: data.articlesPerDay ?? ENGINE_DEFAULTS.articlesPerDay,
    minTopicScore: data.minTopicScore ?? ENGINE_DEFAULTS.minTopicScore,
    minFactCheckConfidence: data.minFactCheckConfidence ?? ENGINE_DEFAULTS.minFactCheckConfidence,
    minWordCount: data.minWordCount ?? ENGINE_DEFAULTS.minWordCount,
    publishHourIST: data.publishHourIST ?? ENGINE_DEFAULTS.publishHourIST,
    discoverHourIST: data.discoverHourIST ?? ENGINE_DEFAULTS.discoverHourIST,
    updatedAt: tsToIso(data.updatedAt),
  };
}

export async function updateEngineSettings(patch: Partial<EngineSettings>): Promise<void> {
  await adminDb
    .collection("settings")
    .doc("engine")
    .set({ ...patch, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

// ─── Categories & authors ───────────────────────────────────────
export async function ensureCategory(name: string): Promise<{ id: string; slug: string; name: string }> {
  const slug = slugifyCategory(name);
  const existing = await adminDb.collection("categories").where("slug", "==", slug).limit(1).get();
  if (!existing.empty) {
    const d = existing.docs[0];
    return { id: d.id, slug, name: d.data().name || name };
  }
  const ref = await adminDb.collection("categories").add({
    name,
    slug,
    description: `${name} articles, guides, and news from DeskNomads.`,
    icon: "Sparkle",
    color: "#3B82F6",
    sortOrder: 99,
    seoTitle: `${name} — DeskNomads`,
    seoDescription: `Latest ${name} articles and guides from DeskNomads.`,
    createdAt: FieldValue.serverTimestamp(),
  });
  return { id: ref.id, slug, name };
}

export async function ensureDefaultAuthor(): Promise<string> {
  const id = SITE.defaultAuthorId;
  const ref = adminDb.collection("authors").doc(id);
  const d = await ref.get();
  if (!d.exists) {
    await ref.set({
      name: "DeskNomads Editorial",
      slug: "desknomads-editorial",
      bio: "The DeskNomads editorial team covers AI tools, remote work, and digital income strategies.",
      avatarUrl: `${SITE.url}/logo.png`,
      socialLinks: { twitter: "https://twitter.com/desknomads" },
      role: "admin",
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  return id;
}

// ─── Articles ───────────────────────────────────────────────────
export async function createArticleAdmin(
  data: Omit<Article, "id" | "createdAt" | "updatedAt" | "author" | "category">
): Promise<string> {
  const ref = await adminDb.collection("articles").add({
    ...data,
    publishedAt: data.publishedAt ? Timestamp.fromDate(new Date(data.publishedAt)) : null,
    scheduledAt: data.scheduledAt ? Timestamp.fromDate(new Date(data.scheduledAt)) : null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function slugExists(slug: string): Promise<boolean> {
  const snap = await adminDb.collection("articles").where("slug", "==", slug).limit(1).get();
  return !snap.empty;
}

export async function getLinkableArticles(limit = 200): Promise<LinkableArticle[]> {
  const snap = await adminDb
    .collection("articles")
    .where("status", "==", "published")
    .limit(limit)
    .get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title || "",
      slug: data.slug || "",
      categoryId: data.categoryId || "",
      tags: data.tags || [],
    };
  });
}

/** Map of published-article slug → { id, title } for URL matching. */
export async function getSlugToArticleMap(): Promise<Map<string, { id: string; title: string }>> {
  const snap = await adminDb.collection("articles").where("status", "==", "published").get();
  const map = new Map<string, { id: string; title: string }>();
  for (const d of snap.docs) {
    const data = d.data();
    if (data.slug) map.set(data.slug, { id: d.id, title: data.title || "" });
  }
  return map;
}

// ─── Performance metrics ────────────────────────────────────────
export async function savePerformanceMetrics(metrics: PerformanceMetrics[]): Promise<void> {
  if (metrics.length === 0) return;
  // Firestore batches cap at 500 ops.
  for (let i = 0; i < metrics.length; i += 450) {
    const batch = adminDb.batch();
    for (const m of metrics.slice(i, i + 450)) {
      const ref = adminDb.collection("performance").doc(m.articleId);
      batch.set(
        ref,
        { ...m, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    }
    await batch.commit();
  }
}

export async function getPerformanceMetrics(limit = 100): Promise<PerformanceMetrics[]> {
  const snap = await adminDb.collection("performance").get();
  const items = snap.docs.map((d) => {
    const data = d.data();
    return {
      articleId: data.articleId || d.id,
      slug: data.slug || "",
      title: data.title || "",
      impressions: data.impressions || 0,
      clicks: data.clicks || 0,
      ctr: data.ctr || 0,
      avgPosition: data.avgPosition || 0,
      traffic: data.traffic || 0,
      bounceRate: data.bounceRate || 0,
      avgTimeOnPage: data.avgTimeOnPage || 0,
      period: data.period || "",
      updatedAt: tsToIso(data.updatedAt),
    } as PerformanceMetrics;
  });
  return items.sort((a, b) => b.impressions - a.impressions).slice(0, limit);
}

/** Top performers by clicks — input for the self-learning loop. */
export async function getTopPerformers(limit = 10): Promise<PerformanceMetrics[]> {
  const all = await getPerformanceMetrics(1000);
  return [...all].sort((a, b) => b.clicks - a.clicks).slice(0, limit);
}

export async function countPublishedToday(): Promise<number> {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  // Single-field range filter (auto-indexed); status checked in memory.
  const snap = await adminDb
    .collection("articles")
    .where("publishedAt", ">=", Timestamp.fromDate(start))
    .get();
  return snap.docs.filter((d) => d.data().status === "published").length;
}
