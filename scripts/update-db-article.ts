/**
 * Update an existing article in Firestore directly using a JSON payload.
 * Bypasses LLM generation to write high-quality manual content.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/update-db-article.ts
 */
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import {
  ensureHeadingIds,
  extractToc,
  computeSeoScore,
  computeReadabilityScore,
} from "@/lib/ai/seo";
import { insertInternalLinks } from "@/lib/ai/internal-links";
import { injectAdPlaceholders } from "@/lib/ai/ads";
import { getLinkableArticles } from "@/lib/ai/store";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const payloadPath = path.join(process.cwd(), "scripts", "article-payload.json");
  if (!fs.existsSync(payloadPath)) {
    console.error(`Error: Payload file not found at ${payloadPath}`);
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(payloadPath, "utf-8"));
  const { slug, title, contentHtml, excerpt, featuredImage, tags, faqs } = payload;

  if (!slug || !contentHtml || !title) {
    console.error("Error: Missing required fields in payload (slug, title, contentHtml)");
    process.exit(1);
  }

  console.log(`\n→ Querying article with slug: ${slug}`);
  const snap = await adminDb.collection("articles").where("slug", "==", slug).limit(1).get();
  if (snap.empty) {
    console.error(`Error: Article with slug "${slug}" not found in Firestore.`);
    process.exit(1);
  }

  const doc = snap.docs[0];
  const docId = doc.id;
  const existingData = doc.data();

  console.log(`Found article docId: ${docId}. Starting processing...`);

  // Count raw word count
  const countWords = (html: string) => {
    const text = html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ");
    return text.split(/\s+/).filter(Boolean).length;
  };
  const wordCount = countWords(contentHtml);

  // 1. Process Heading IDs & Table of Contents
  let html = ensureHeadingIds(contentHtml);
  const toc = extractToc(html);

  // 2. Process Internal Links (Bypassed LLM call to run completely offline)
  const linkedLinks = existingData.internalLinks || [];

  // 3. Process Ads Placeholders
  html = injectAdPlaceholders(html);

  // 4. Compute SEO Score
  const seoScore = computeSeoScore({
    html,
    seoTitle: existingData.seoTitle || title,
    metaDescription: existingData.seoDescription || excerpt || existingData.excerpt || "",
    primaryKeyword: (tags && tags[0]) || (existingData.tags && existingData.tags[0]) || title,
    wordCount,
    faqCount: faqs ? faqs.length : (existingData.faqs || []).length,
    internalLinkCount: linkedLinks.length,
    hasImage: !!(featuredImage || existingData.featuredImage),
  });

  // 5. Build final update payload
  const updateData: Record<string, any> = {
    title,
    content: html,
    contentJson: {},
    toc,
    internalLinks: linkedLinks,
    wordCount,
    readingTime: Math.max(1, Math.ceil(wordCount / 250)),
    seoScore,
    readabilityScore: computeReadabilityScore(html),
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (excerpt) updateData.excerpt = excerpt;
  if (featuredImage) {
    updateData.featuredImage = featuredImage;
    updateData.ogImage = featuredImage;
  }
  if (tags) updateData.tags = tags;
  if (faqs) updateData.faqs = faqs;

  await adminDb.collection("articles").doc(docId).update(updateData);

  console.log(`\n✓ Article updated successfully!`);
  console.log(`  Slug: ${slug}`);
  console.log(`  Word count: ${wordCount}`);
  console.log(`  SEO Score: ${seoScore}`);
  console.log(`  Internal links: ${linkedLinks.length}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
