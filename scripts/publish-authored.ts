/**
 * Publish hand-authored articles through the full SEO pipeline (heading ids,
 * TOC, internal links, ad slots, Pollinations featured image, SEO scoring).
 * Content is written by a human/editor, so there is NO LLM call and NO
 * fact-check gate — these publish directly.
 *
 * Run: node --env-file=.env.local --import tsx scripts/publish-authored.ts
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ARTICLES } from "./authored/manifest";
import {
  ensureHeadingIds,
  extractToc,
  computeSeoScore,
  computeReadabilityScore,
  canonicalFor,
} from "@/lib/ai/seo";
import { insertInternalLinks } from "@/lib/ai/internal-links";
import { injectAdPlaceholders } from "@/lib/ai/ads";
import { generateFeaturedImage } from "@/lib/ai/images";
import {
  ensureCategory,
  ensureDefaultAuthor,
  createArticleAdmin,
  slugExists,
  getLinkableArticles,
} from "@/lib/ai/store";

const HERE = dirname(fileURLToPath(import.meta.url));
const wordCount = (html: string) => html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

async function main() {
  const authorId = await ensureDefaultAuthor();
  const nowIso = new Date().toISOString();

  for (const a of ARTICLES) {
    try {
      let slug = a.slug;
      if (await slugExists(slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

      const raw = readFileSync(join(HERE, "authored", a.file), "utf8");
      let html = ensureHeadingIds(raw);
      const toc = extractToc(html);
      const words = wordCount(html);

      const category = await ensureCategory(a.category);
      const linkables = await getLinkableArticles();
      const linked = await insertInternalLinks(html, linkables, {
        categoryId: category.id,
        tags: a.secondaryKeywords,
      });
      html = injectAdPlaceholders(linked.html);

      let featuredImage = "";
      try {
        const img = await generateFeaturedImage(slug, a.seoTitle, a.category, a.seoTitle);
        featuredImage = img.url;
      } catch (e) {
        console.log(`  ! image failed for ${slug}: ${String((e as Error)?.message || e).slice(0, 80)}`);
      }

      const seoScore = computeSeoScore({
        html,
        seoTitle: a.seoTitle,
        metaDescription: a.seoDescription,
        primaryKeyword: a.primaryKeyword,
        wordCount: words,
        faqCount: a.faqs.length,
        internalLinkCount: linked.links.length,
        hasImage: !!featuredImage,
      });
      const readabilityScore = computeReadabilityScore(html);
      const tags = Array.from(new Set([a.primaryKeyword, ...a.secondaryKeywords])).slice(0, 12);

      const id = await createArticleAdmin({
        title: a.seoTitle,
        slug,
        excerpt: a.excerpt,
        content: html,
        contentJson: {},
        featuredImage,
        authorId,
        categoryId: category.id,
        status: "published",
        publishedAt: nowIso,
        scheduledAt: null,
        readingTime: Math.max(1, Math.ceil(words / 250)),
        wordCount: words,
        seoTitle: a.seoTitle,
        seoDescription: a.seoDescription,
        canonicalUrl: canonicalFor(slug),
        ogImage: featuredImage,
        tags,
        faqs: a.faqs,
        toc,
        internalLinks: linked.links,
        seoScore,
        readabilityScore,
        views: 0,
        isFeatured: false,
        isTrending: false,
      });

      console.log(`PUBLISHED  /${slug}  | ${words}w | SEO ${seoScore} | links ${linked.links.length} | img ${featuredImage ? "yes" : "no"}  (${id})`);
    } catch (e) {
      console.log(`FAILED  ${a.slug}: ${String((e as Error)?.message || e).slice(0, 160)}`);
    }
  }
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
