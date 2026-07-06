/**
 * Pipeline Orchestrator — the autonomous newsroom workflow.
 *
 *   Discovery:  signals → synthesize → score → store opportunities
 *   Generation: research → plan → write → SEO → links → ads → image
 *               → fact-check → persist (publish or route to review)
 *   Daily:      pick top eligible opportunities → generate + publish
 *
 * Failsafe: any stage failure is logged and the article is never published
 * incomplete — it is saved as a draft (review queue) instead.
 */
import { MODELS, getGscSiteUrl } from "./config";
import { EngineError } from "./config";
import { querySearchAnalytics, defaultWindow, urlToSlug } from "./search-console";
import { gatherSignals, synthesizeOpportunities } from "./trends";
import { scoreOpportunities } from "./scoring";
import { gatherResearch } from "./research";
import { createContentPlan, toSlug } from "./planner";
import { generateArticle } from "./writer";
import {
  ensureHeadingIds,
  extractToc,
  computeSeoScore,
  computeReadabilityScore,
  canonicalFor,
} from "./seo";
import { insertInternalLinks } from "./internal-links";
import { injectAdPlaceholders } from "./ads";
import { generateFeaturedImage } from "./images";
import { factCheck } from "./factcheck";
import {
  saveOpportunities,
  getOpportunities,
  getEligibleOpportunities,
  getOpportunityById,
  updateOpportunity,
  logGeneration,
  getEngineSettings,
  ensureCategory,
  ensureDefaultAuthor,
  createArticleAdmin,
  slugExists,
  getLinkableArticles,
  getSlugToArticleMap,
  savePerformanceMetrics,
} from "./store";
import type { ContentOpportunity, PerformanceMetrics } from "@/types";

async function log(
  stage: string,
  status: "success" | "error" | "warning" | "info",
  message: string,
  extra: { opportunityId?: string; articleId?: string; model?: string; durationMs?: number } = {}
) {
  try {
    await logGeneration({ stage, status, message, ...extra });
  } catch {
    /* logging must never break the pipeline */
  }
  console.log(`[engine:${stage}] ${status.toUpperCase()} — ${message}`);
}

// ─── Discovery ──────────────────────────────────────────────────
export async function runDiscovery(): Promise<{ discovered: number; eligible: number }> {
  const started = Date.now();
  await log("discovery", "info", "Starting content opportunity scan");

  const signals = await gatherSignals();
  await log("discovery.signals", "info", `Gathered ${signals.length} raw signals`);
  if (signals.length === 0) {
    await log("discovery", "warning", "No signals gathered; aborting discovery");
    return { discovered: 0, eligible: 0 };
  }

  // Avoid near-duplicate topics against BOTH published articles and topics
  // already sitting in the queue (discovered/queued but not yet generated).
  const [publishedTitles, pending] = await Promise.all([
    getLinkableArticles().catch(() => []),
    getOpportunities().catch(() => []),
  ]);
  const existingTitles = [
    ...publishedTitles.map((a) => a.title),
    ...pending
      .filter((o) => o.status === "discovered" || o.status === "queued")
      .map((o) => o.title),
  ];
  const candidates = await synthesizeOpportunities(signals, 12, existingTitles);
  await log("discovery.synthesize", "info", `Synthesized ${candidates.length} candidate topics`, {
    model: MODELS.text,
  });

  const scored = await scoreOpportunities(candidates);
  const settings = await getEngineSettings();
  const threshold = settings.minTopicScore;
  const eligible = scored.filter((s) => s.topicScore >= threshold).length;
  await saveOpportunities(scored);

  await log(
    "discovery",
    "success",
    `Stored ${scored.length} opportunities (${eligible} scoring ${threshold}+)`,
    { durationMs: Date.now() - started }
  );
  return { discovered: scored.length, eligible };
}

// ─── Single-article generation ──────────────────────────────────
export interface GenerateResult {
  articleId: string;
  slug: string;
  status: "published" | "review";
  factCheckConfidence: number;
  wordCount: number;
  seoScore: number;
}

export async function generateArticleFromOpportunity(
  opp: ContentOpportunity,
  options: { autoPublish: boolean } = { autoPublish: false }
): Promise<GenerateResult> {
  const started = Date.now();
  await updateOpportunity(opp.id, { status: "generating" });
  await log("generate", "info", `Generating: ${opp.title}`, { opportunityId: opp.id });

  const settings = await getEngineSettings();

  try {
    // 1. Research
    const research = await gatherResearch(opp.topic, opp.primaryKeyword);
    await log("generate.research", "info", `Collected ${research.sources.length} sources`, {
      opportunityId: opp.id,
    });

    // 2. Plan
    const plan = await createContentPlan(opp, research.summary);

    // Ensure unique slug
    let slug = plan.slug || toSlug(opp.title);
    if (await slugExists(slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

    // 3. Write
    const written = await generateArticle(plan, research, opp.category, {
      minWords: settings.minWordCount,
    });
    if (written.wordCount < settings.minWordCount) {
      await log(
        "generate.write",
        "warning",
        `Word count ${written.wordCount} below minimum ${settings.minWordCount}`,
        { opportunityId: opp.id }
      );
    }

    // 4. SEO structure: heading ids + TOC
    let html = ensureHeadingIds(written.contentHtml);
    const toc = extractToc(html);

    // 5. Internal links
    const linkables = await getLinkableArticles();
    const category = await ensureCategory(opp.category);
    const linked = await insertInternalLinks(html, linkables, {
      categoryId: category.id,
      tags: opp.secondaryKeywords,
    });
    html = linked.html;

    // 6. Ads
    html = injectAdPlaceholders(html);

    // 7. Featured image (non-fatal: fall back to none → review)
    let featuredImage = "";
    try {
      const img = await generateFeaturedImage(slug, plan.seoTitle, opp.category, plan.seoTitle);
      featuredImage = img.url;
      await log("generate.image", "success", "Featured image generated", {
        opportunityId: opp.id,
        model: MODELS.image,
      });
    } catch (err) {
      await log("generate.image", "warning", `Image generation failed: ${String(err)}`, {
        opportunityId: opp.id,
      });
    }

    // 8. Fact-check
    const fact = await factCheck(html, research);
    await log(
      "generate.factcheck",
      fact.passed ? "success" : "warning",
      `Confidence ${fact.confidence}${fact.issues.length ? ` — ${fact.issues.join("; ")}` : ""}`,
      { opportunityId: opp.id }
    );

    // 9. Scores
    const seoScore = computeSeoScore({
      html,
      seoTitle: plan.seoTitle,
      metaDescription: plan.metaDescription,
      primaryKeyword: plan.primaryKeyword,
      wordCount: written.wordCount,
      faqCount: written.faqs.length,
      internalLinkCount: linked.links.length,
      hasImage: !!featuredImage,
    });
    const readabilityScore = computeReadabilityScore(html);

    // 10. Decide publish vs review (failsafe)
    const meetsConfidence = fact.confidence >= settings.minFactCheckConfidence;
    const hasImage = !!featuredImage;
    const shouldPublish = options.autoPublish && meetsConfidence && hasImage;
    const status: "published" | "draft" = shouldPublish ? "published" : "draft";

    const authorId = await ensureDefaultAuthor();
    const nowIso = new Date().toISOString();
    const tags = Array.from(new Set([opp.primaryKeyword, ...opp.secondaryKeywords])).slice(0, 12);

    const articleId = await createArticleAdmin({
      title: plan.seoTitle,
      slug,
      excerpt: written.excerpt || plan.metaDescription,
      content: html,
      contentJson: {},
      featuredImage,
      authorId,
      categoryId: category.id,
      status,
      publishedAt: status === "published" ? nowIso : null,
      scheduledAt: null,
      readingTime: Math.max(1, Math.ceil(written.wordCount / 250)),
      wordCount: written.wordCount,
      seoTitle: plan.seoTitle,
      seoDescription: plan.metaDescription,
      canonicalUrl: canonicalFor(slug),
      ogImage: featuredImage,
      tags,
      faqs: written.faqs,
      toc,
      internalLinks: linked.links,
      seoScore,
      readabilityScore,
      views: 0,
      isFeatured: false,
      isTrending: false,
    });

    await updateOpportunity(opp.id, {
      status: status === "published" ? "published" : "queued",
      generatedArticleId: articleId,
    });

    await log(
      "generate",
      "success",
      `${status === "published" ? "Published" : "Saved to review queue"}: ${slug} (${written.wordCount} words, SEO ${seoScore}, confidence ${fact.confidence})`,
      { opportunityId: opp.id, articleId, durationMs: Date.now() - started }
    );

    return {
      articleId,
      slug,
      status: status === "published" ? "published" : "review",
      factCheckConfidence: fact.confidence,
      wordCount: written.wordCount,
      seoScore,
    };
  } catch (err) {
    const message = err instanceof EngineError ? `[${err.stage}] ${err.message}` : String(err);
    await updateOpportunity(opp.id, { status: "failed" });
    await log("generate", "error", `Generation failed: ${message}`, { opportunityId: opp.id });
    throw err;
  }
}

// ─── Daily publish run ──────────────────────────────────────────
export async function runDailyPublish(): Promise<{
  attempted: number;
  published: number;
  review: number;
  failed: number;
}> {
  const settings = await getEngineSettings();
  await log("publish", "info", `Daily publish run (auto=${settings.autoPublishEnabled})`);

  if (!settings.autoPublishEnabled) {
    await log("publish", "warning", "Auto-publish disabled in settings; nothing published");
    return { attempted: 0, published: 0, review: 0, failed: 0 };
  }

  const eligible = await getEligibleOpportunities(settings.minTopicScore, settings.articlesPerDay);
  if (eligible.length === 0) {
    await log("publish", "warning", "No eligible opportunities (run discovery first?)");
    return { attempted: 0, published: 0, review: 0, failed: 0 };
  }

  let published = 0;
  let review = 0;
  let failed = 0;
  for (const opp of eligible) {
    try {
      const res = await generateArticleFromOpportunity(opp, { autoPublish: true });
      if (res.status === "published") published++;
      else review++;
    } catch {
      failed++;
      // Continue to next article — one failure must not block the run.
    }
  }

  await log(
    "publish",
    "success",
    `Run complete: ${published} published, ${review} to review, ${failed} failed`
  );
  return { attempted: eligible.length, published, review, failed };
}

// ─── Search Console performance ingestion ───────────────────────
export async function ingestSearchConsole(days = 28): Promise<{ rows: number; matched: number }> {
  const started = Date.now();
  const window = defaultWindow(days);
  await log("performance", "info", `Ingesting Search Console ${window.startDate}..${window.endDate}`);

  try {
    const rows = await querySearchAnalytics({
      startDate: window.startDate,
      endDate: window.endDate,
      dimensions: ["page"],
      rowLimit: 5000,
    });

    const siteUrl = getGscSiteUrl();
    const slugMap = await getSlugToArticleMap();
    const period = `${window.startDate}_${window.endDate}`;
    const now = new Date().toISOString();

    const metrics: PerformanceMetrics[] = [];
    for (const r of rows) {
      const slug = urlToSlug(r.keys?.[0] || "", siteUrl);
      const article = slugMap.get(slug);
      if (!article) continue;
      metrics.push({
        articleId: article.id,
        slug,
        title: article.title,
        impressions: r.impressions || 0,
        clicks: r.clicks || 0,
        ctr: +((r.ctr || 0) * 100).toFixed(2),
        avgPosition: +(r.position || 0).toFixed(1),
        traffic: r.clicks || 0, // organic clicks as traffic proxy (GA4 = roadmap)
        bounceRate: 0,
        avgTimeOnPage: 0,
        period,
        updatedAt: now,
      });
    }

    await savePerformanceMetrics(metrics);
    await log(
      "performance",
      "success",
      `Ingested ${rows.length} GSC rows, matched ${metrics.length} articles`,
      { durationMs: Date.now() - started }
    );
    return { rows: rows.length, matched: metrics.length };
  } catch (err) {
    const message = err instanceof EngineError ? `[${err.stage}] ${err.message}` : String(err);
    await log("performance", "error", `Search Console ingestion failed: ${message}`);
    throw err;
  }
}

export { getOpportunityById };
