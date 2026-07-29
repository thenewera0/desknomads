/**
 * Bulk SEO Database Fixer — runs offline directly in Node to optimize
 * all 113 articles in Firestore (updating meta descriptions, featured images,
 * heading IDs, Table of Contents, and calculating final SEO/readability scores).
 *
 * Run:
 *   node --env-file=.env.local --import tsx scripts/fix-seo-bulk.ts
 */
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import {
  ensureHeadingIds,
  extractToc,
  computeSeoScore,
  computeReadabilityScore,
} from "@/lib/ai/seo";

// Curated stock images from Unsplash for category mappings
const UNSPLASH_IMAGES = {
  tech: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  work: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1200&auto=format&fit=crop",
  general: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
};

// Helper to strip HTML tags to get plain text preview for descriptions
function stripHtmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const snap = await adminDb.collection("articles").where("status", "==", "published").get();
  console.log(`Auditing and fixing SEO for ${snap.size} published articles...`);

  let count = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const docId = doc.id;
    const title = data.title || "";
    const existingContent = data.content || "";
    const tags = data.tags || [];

    let needsUpdate = false;
    const updatePayload: Record<string, any> = {};

    // 1. Resolve Missing / Short Meta Description
    let excerpt = data.seoDescription || data.excerpt || "";
    if (!excerpt || excerpt.length < 100) {
      const plainText = stripHtmlToText(existingContent);
      excerpt = plainText.slice(0, 155).trim();
      if (excerpt.length > 0) {
        if (excerpt.length === 155) excerpt += "...";
        updatePayload.excerpt = excerpt;
        updatePayload.seoDescription = excerpt;
        needsUpdate = true;
      }
    }

    // 2. Resolve Missing Featured Image
    let featuredImage = data.featuredImage || "";
    if (!featuredImage) {
      // Determine image based on tags
      const lowerTags = tags.map((t: string) => t.toLowerCase());
      const isTech = lowerTags.some((t: string) => 
        t.includes("ai") || t.includes("model") || t.includes("gpt") || t.includes("llama") || t.includes("code") || t.includes("software")
      );
      const isWork = lowerTags.some((t: string) => 
        t.includes("job") || t.includes("work") || t.includes("freelance") || t.includes("income") || t.includes("earn") || t.includes("side")
      );

      featuredImage = isTech ? UNSPLASH_IMAGES.tech : (isWork ? UNSPLASH_IMAGES.work : UNSPLASH_IMAGES.general);
      updatePayload.featuredImage = featuredImage;
      updatePayload.ogImage = featuredImage;
      needsUpdate = true;
    }

    // 3. Ensure heading IDs and Table of Contents (TOC)
    const contentWithHeadingIds = ensureHeadingIds(existingContent);
    const toc = extractToc(contentWithHeadingIds);

    if (contentWithHeadingIds !== existingContent) {
      updatePayload.content = contentWithHeadingIds;
      updatePayload.toc = toc;
      needsUpdate = true;
    } else if (!data.toc || data.toc.length === 0) {
      updatePayload.toc = toc;
      needsUpdate = true;
    }

    // Calculate word count
    const words = stripHtmlToText(contentWithHeadingIds).split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    if (wordCount !== data.wordCount) {
      updatePayload.wordCount = wordCount;
      updatePayload.readingTime = Math.max(1, Math.ceil(wordCount / 250));
      needsUpdate = true;
    }

    // 4. Calculate Final SEO & Readability Scores
    const links = data.internalLinks || [];
    const faqs = data.faqs || [];
    
    const seoScore = computeSeoScore({
      html: contentWithHeadingIds,
      seoTitle: data.seoTitle || title,
      metaDescription: excerpt,
      primaryKeyword: tags[0] || title,
      wordCount,
      faqCount: faqs.length,
      internalLinkCount: links.length,
      hasImage: !!featuredImage,
    });
    
    const readabilityScore = computeReadabilityScore(contentWithHeadingIds);

    if (seoScore !== data.seoScore) {
      updatePayload.seoScore = seoScore;
      needsUpdate = true;
    }

    if (readabilityScore !== data.readabilityScore) {
      updatePayload.readabilityScore = readabilityScore;
      needsUpdate = true;
    }

    if (needsUpdate) {
      updatePayload.updatedAt = FieldValue.serverTimestamp();
      await adminDb.collection("articles").doc(docId).update(updatePayload);
      console.log(`  ✓ Updated: ${data.slug} (Word count: ${wordCount}, SEO: ${seoScore}, Readability: ${readabilityScore})`);
      count++;
    }
  }

  console.log(`\nSuccessfully optimized and updated ${count} articles in Firestore database.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
