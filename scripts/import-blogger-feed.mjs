// Import all posts from the live Blogger feed into Firestore as published articles.
// Run: node --env-file=.env.local scripts/import-blogger-feed.mjs
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";

const app = getApps()[0] || initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);
const PUB = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "pub-1562600430581360";
const FEED = "https://www.desknomads.shop/feeds/posts/default?alt=json&max-results=500";
const AUTHOR_ID = "desknomads-team";

// ── helpers ──────────────────────────────────────────────────────
const slugify = (s) => s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
const kebab = (s) => s.replace(/<[^>]+>/g, "").toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60);
const htmlToText = (h) => h.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
const firstImage = (h) => (h.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || "";

function ensureHeadingIds(html) {
  const used = new Set();
  return html.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (full, tag, attrs, inner) => {
    let id = (attrs.match(/id=["']([^"']+)["']/i)?.[1] || kebab(inner) || "section");
    let u = id, n = 2;
    while (used.has(u)) u = `${id}-${n++}`;
    used.add(u);
    return `<${tag}${attrs.replace(/\s*id=["'][^"']*["']/i, "")} id="${u}">${inner}</${tag}>`;
  });
}
function extractToc(html) {
  const toc = []; const re = /<(h2|h3)[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/\1>/gi; let m;
  while ((m = re.exec(html))) toc.push({ id: m[2], text: m[3].replace(/<[^>]+>/g, "").trim(), level: m[1].toLowerCase() === "h2" ? 2 : 3 });
  return toc;
}
function adBlock(pos) {
  return `<div class="dn-in-article-ad" data-ad-position="${pos}" aria-label="Advertisement"><ins class="adsbygoogle" style="display:block;text-align:center" data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-${PUB}" data-dn-lazy="true"></ins></div>`;
}
function injectAds(html) {
  if (/dn-in-article-ad/.test(html)) return html;
  const blocks = html.match(/<(p|h2|h3|ul|ol|table|blockquote)[\s\S]*?<\/\1>/gi);
  if (!blocks || blocks.length < 4) return html;
  const pIdx = blocks.map((b, i) => ({ b, i })).filter((x) => /^<p/i.test(x.b)).map((x) => x.i);
  const insertAt = new Set();
  if (pIdx[2] !== undefined) insertAt.add(pIdx[2] + 1);
  insertAt.add(Math.floor(blocks.length / 2));
  let out = "", placed = 0; const pos = ["after-p3", "mid-content"];
  blocks.forEach((b, i) => { if (insertAt.has(i) && placed < pos.length) { out += adBlock(pos[placed++]); } out += b; });
  const head = html.slice(0, html.indexOf(blocks[0]));
  const tail = html.slice(html.lastIndexOf(blocks[blocks.length - 1]) + blocks[blocks.length - 1].length);
  return head + out + tail;
}

const LABEL_MAP = {
  "side hustle": "Side Hustles", "side hustles": "Side Hustles",
  "ai tool": "AI Tools", "ai tools": "AI Tools",
  "remote job": "Remote Jobs", "remote jobs": "Remote Jobs",
  "work from home": "Work From Home", "passive income": "Passive Income",
  "productivity": "Productivity", "automation": "Automation",
  "freelancing": "Freelancing", "freelance": "Freelancing",
  "digital products": "Digital Products", "startups": "Startups",
  "online income": "Online Income", "future careers": "Future Careers",
};
const normalizeCategory = (label) => LABEL_MAP[(label || "").toLowerCase().trim()] || label || "AI Tools";

const catCache = new Map();
async function ensureCategory(name) {
  const slug = slugify(name);
  if (catCache.has(slug)) return catCache.get(slug);
  const ex = await db.collection("categories").where("slug", "==", slug).limit(1).get();
  let id;
  if (!ex.empty) id = ex.docs[0].id;
  else {
    const ref = await db.collection("categories").add({
      name, slug, description: `${name} articles and guides from DeskNomads.`,
      icon: "Sparkle", color: "#3B82F6", sortOrder: 99,
      seoTitle: `${name} — DeskNomads`, seoDescription: `Latest ${name} articles from DeskNomads.`,
      createdAt: FieldValue.serverTimestamp(),
    });
    id = ref.id;
  }
  catCache.set(slug, id);
  return id;
}
async function ensureAuthor() {
  const ref = db.collection("authors").doc(AUTHOR_ID);
  if (!(await ref.get()).exists) {
    await ref.set({
      name: "DeskNomads Editorial", slug: "desknomads-editorial",
      bio: "The DeskNomads editorial team covers AI tools, remote work, and digital income.",
      avatarUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://desknomads.shop"}/logo.png`,
      socialLinks: { twitter: "https://twitter.com/desknomads" }, role: "admin",
      createdAt: FieldValue.serverTimestamp(),
    });
  }
}

// ── run ──────────────────────────────────────────────────────────
console.log("Fetching Blogger feed…");
const res = await fetch(FEED);
const feed = (await res.json()).feed;
const entries = feed.entry || [];
console.log(`Found ${entries.length} posts.`);
await ensureAuthor();

let created = 0, skipped = 0;
for (const e of entries) {
  const title = e.title?.$t?.trim();
  const contentRaw = e.content?.$t || e.summary?.$t || "";
  if (!title || !contentRaw) { skipped++; continue; }

  const url = (e.link || []).find((l) => l.rel === "alternate")?.href || "";
  const slugMatch = url.match(/\/\d{4}\/\d{2}\/(.+)\.html$/);
  const slug = slugMatch ? slugMatch[1] : slugify(title);

  const exists = await db.collection("articles").where("slug", "==", slug).limit(1).get();
  if (!exists.empty) { console.log("  skip (exists):", slug); skipped++; continue; }

  const labels = (e.category || []).map((c) => c.term);
  const categoryName = normalizeCategory(labels[0]);
  const categoryId = await ensureCategory(categoryName);

  let html = injectAds(ensureHeadingIds(contentRaw));
  const toc = extractToc(html);
  const text = htmlToText(contentRaw);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 250));
  const excerpt = (text.slice(0, 180).trim() + (text.length > 180 ? "…" : ""));
  let featuredImage = firstImage(contentRaw);
  if (!featuredImage && e["media$thumbnail"]?.url) {
    featuredImage = e["media$thumbnail"].url.replace(/\/s\d+(-c)?\//, "/s1600/");
  }
  const published = e.published?.$t ? new Date(e.published.$t) : new Date();
  const updated = e.updated?.$t ? new Date(e.updated.$t) : published;

  await db.collection("articles").add({
    title, slug, excerpt, content: html, contentJson: {},
    featuredImage, authorId: AUTHOR_ID, categoryId,
    status: "published",
    publishedAt: Timestamp.fromDate(published),
    scheduledAt: null,
    readingTime, wordCount,
    seoTitle: title, seoDescription: excerpt,
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://desknomads.shop"}/${slug}`,
    ogImage: featuredImage,
    tags: labels.slice(0, 12), faqs: [], toc, internalLinks: [],
    seoScore: 0, readabilityScore: 0, views: 0,
    isFeatured: false, isTrending: false,
    bloggerOriginalUrl: url,
    createdAt: Timestamp.fromDate(published),
    updatedAt: Timestamp.fromDate(updated),
  });
  console.log(`  imported [${categoryName}] ${slug} (${wordCount}w${featuredImage ? ", img" : ", NO IMG"})`);
  created++;
}
console.log(`\nDone. Imported ${created}, skipped ${skipped}.`);
