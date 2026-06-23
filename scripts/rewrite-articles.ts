/**
 * Rewrite existing AI-generated articles in place with the upgraded scannable
 * writer (short paragraphs, bold, lists, callouts, tables) — keeps the same
 * slug/url/image/date. Blogger-imported posts are left untouched.
 *
 * Run:
 *   node --env-file=.env.local --import tsx scripts/rewrite-articles.ts            # all AI articles
 *   node --env-file=.env.local --import tsx scripts/rewrite-articles.ts <slug...>  # specific slugs
 */
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { gatherResearch } from "@/lib/ai/research";
import { generateArticle } from "@/lib/ai/writer";
import {
  ensureHeadingIds,
  extractToc,
  computeSeoScore,
  computeReadabilityScore,
} from "@/lib/ai/seo";
import { insertInternalLinks } from "@/lib/ai/internal-links";
import { injectAdPlaceholders } from "@/lib/ai/ads";
import { getLinkableArticles } from "@/lib/ai/store";
import type { ContentPlan } from "@/types";

async function categoryName(categoryId: string): Promise<string> {
  if (!categoryId) return "AI Tools";
  const d = await adminDb.collection("categories").doc(categoryId).get();
  return (d.exists && (d.data()!.name as string)) || "AI Tools";
}

async function rewriteOne(docId: string): Promise<void> {
  const ref = adminDb.collection("articles").doc(docId);
  const snap = await ref.get();
  const data = snap.data()!;
  const started = Date.now();
  console.log(`\n→ Rewriting: ${data.slug}`);

  const plan: ContentPlan = {
    seoTitle: data.seoTitle || data.title,
    slug: data.slug,
    primaryKeyword: (data.tags && data.tags[0]) || data.title,
    secondaryKeywords: (data.tags || []).slice(1),
    searchIntent: "informational",
    angle: "A clear, scannable, in-depth guide.",
    metaDescription: data.seoDescription || data.excerpt || "",
    faqTopics: (data.faqs || []).map((f: { question: string }) => f.question),
    outline: (data.toc || [])
      .filter((t: { level: number }) => t.level === 2)
      .map((h: { text: string }) => ({ heading: h.text, level: 2 as const, points: [] })),
  };

  const cat = await categoryName(data.categoryId);
  const research = await gatherResearch(data.title, plan.primaryKeyword);
  const written = await generateArticle(plan, research, cat, { minWords: 2500 });

  let html = ensureHeadingIds(written.contentHtml);
  const toc = extractToc(html);
  const linkables = (await getLinkableArticles()).filter((a) => a.id !== docId);
  const linked = await insertInternalLinks(html, linkables, {
    categoryId: data.categoryId,
    tags: plan.secondaryKeywords,
  });
  html = injectAdPlaceholders(linked.html);

  const seoScore = computeSeoScore({
    html,
    seoTitle: plan.seoTitle,
    metaDescription: plan.metaDescription,
    primaryKeyword: plan.primaryKeyword,
    wordCount: written.wordCount,
    faqCount: written.faqs.length,
    internalLinkCount: linked.links.length,
    hasImage: !!data.featuredImage,
  });

  await ref.update({
    content: html,
    contentJson: {},
    excerpt: written.excerpt || data.excerpt,
    faqs: written.faqs.length ? written.faqs : data.faqs || [],
    toc,
    internalLinks: linked.links,
    wordCount: written.wordCount,
    readingTime: Math.max(1, Math.ceil(written.wordCount / 250)),
    seoScore,
    readabilityScore: computeReadabilityScore(html),
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log(
    `  ✓ ${data.slug} — ${written.wordCount} words, SEO ${seoScore}, ${linked.links.length} links, ${(Date.now() - started) / 1000}s`
  );
}

async function main() {
  const slugs = process.argv.slice(2);
  const snap = await adminDb.collection("articles").where("status", "==", "published").get();
  let targets = snap.docs.filter((d) => !d.data().bloggerOriginalUrl); // AI-generated only
  if (slugs.length) targets = targets.filter((d) => slugs.includes(d.data().slug));

  console.log(`Rewriting ${targets.length} article(s)...`);
  for (const d of targets) {
    try {
      await rewriteOne(d.id);
    } catch (err) {
      console.error(`  ✗ ${d.data().slug} failed:`, String(err));
    }
  }
  console.log("\nDone.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
