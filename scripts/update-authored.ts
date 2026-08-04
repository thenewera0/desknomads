/**
 * Re-process the hand-authored articles and UPDATE the existing published docs
 * in place (matched by slug) — used after expanding the source HTML.
 * Run: node --env-file=.env.local --import tsx scripts/update-authored.ts
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ARTICLES } from "./authored/manifest";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import {
  ensureHeadingIds,
  extractToc,
  computeSeoScore,
  computeReadabilityScore,
} from "@/lib/ai/seo";
import { injectAdPlaceholders } from "@/lib/ai/ads";

const HERE = dirname(fileURLToPath(import.meta.url));
const wordCount = (html: string) => html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

async function main() {
  for (const a of ARTICLES) {
    try {
      const q = await adminDb.collection("articles").where("slug", "==", a.slug).limit(1).get();
      if (q.empty) { console.log(`NOT FOUND: ${a.slug}`); continue; }
      const ref = q.docs[0].ref;

      const raw = readFileSync(join(HERE, "authored", a.file), "utf8");
      const html = injectAdPlaceholders(ensureHeadingIds(raw));
      const toc = extractToc(html);
      const words = wordCount(html);

      const existing = q.docs[0].data();
      const seoScore = computeSeoScore({
        html, seoTitle: a.seoTitle, metaDescription: a.seoDescription, primaryKeyword: a.primaryKeyword,
        wordCount: words, faqCount: a.faqs.length,
        internalLinkCount: (existing.internalLinks || []).length, hasImage: !!existing.featuredImage,
      });

      await ref.update({
        content: html,
        wordCount: words,
        toc,
        readingTime: Math.max(1, Math.ceil(words / 250)),
        seoScore,
        readabilityScore: computeReadabilityScore(html),
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`UPDATED  /${a.slug}  | ${words}w | SEO ${seoScore}${words >= 1000 ? "  OK" : "  <-- STILL THIN"}`);
    } catch (e) {
      console.log(`FAILED  ${a.slug}: ${String((e as Error)?.message || e).slice(0, 160)}`);
    }
  }
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
