/**
 * AdSense Optimization — injects in-article ad placeholders into article HTML.
 *
 * In-content positions (per spec): after paragraph 3, mid-content, and before
 * the conclusion. Below-title and sidebar slots are handled at the page layout
 * level. Slots are lazy-loaded by ArticleContent to preserve Core Web Vitals.
 */
import { SITE } from "./config";

function adBlock(position: string): string {
  const client = `ca-${SITE.adsensePublisherId}`;
  return `<div class="dn-in-article-ad" data-ad-position="${position}" aria-label="Advertisement"><ins class="adsbygoogle" style="display:block;text-align:center" data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="${client}" data-dn-lazy="true"></ins></div>`;
}

/**
 * Insert ad placeholders at sensible breakpoints inside the article body.
 * Returns HTML with markers ArticleContent will lazy-activate.
 */
export function injectAdPlaceholders(html: string): string {
  if (/dn-in-article-ad/.test(html)) return html; // already injected (idempotent)

  // Split into top-level blocks by closing tags of common block elements.
  const blocks = html.match(/<(p|h2|h3|ul|ol|table|blockquote)[\s\S]*?<\/\1>/gi);
  if (!blocks || blocks.length < 6) return html;

  // Determine insertion anchors.
  const paragraphIdxs = blocks
    .map((b, i) => ({ b, i }))
    .filter((x) => /^<p/i.test(x.b))
    .map((x) => x.i);

  const afterP3 = paragraphIdxs[2]; // after 3rd paragraph
  const mid = Math.floor(blocks.length / 2);
  const conclusionIdx = blocks.findIndex((b) => /<h2[^>]*>[\s\S]*conclusion/i.test(b));

  const insertAt = new Set<number>();
  if (afterP3 !== undefined) insertAt.add(afterP3 + 1);
  insertAt.add(mid);
  if (conclusionIdx > 0) insertAt.add(conclusionIdx);

  // Rebuild HTML, inserting blocks before the chosen indexes.
  let result = "";
  const positions = ["after-p3", "mid-content", "before-conclusion"];
  let placed = 0;
  blocks.forEach((block, i) => {
    if (insertAt.has(i) && placed < positions.length) {
      result += adBlock(positions[placed]);
      placed++;
    }
    result += block;
  });

  // Preserve any trailing content not captured by the block regex.
  const lastBlockEnd = html.lastIndexOf(blocks[blocks.length - 1]) + blocks[blocks.length - 1].length;
  const tail = html.slice(lastBlockEnd);
  // Preserve any leading content before first block (e.g. stray text).
  const head = html.slice(0, html.indexOf(blocks[0]));
  return head + result + tail;
}
