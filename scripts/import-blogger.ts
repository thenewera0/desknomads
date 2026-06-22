/**
 * Blogger XML Import Script
 * 
 * Parses a Blogger export XML file and imports articles into Firestore.
 * Also builds a redirect map from old Blogger URLs to new clean slugs.
 * 
 * Usage:
 *   npx tsx scripts/import-blogger.ts path/to/blog-export.xml
 * 
 * Prerequisites:
 *   - FIREBASE_SERVICE_ACCOUNT_KEY env var set (path to service account JSON)
 *   - Or run from project root where .env.local is configured
 */

import * as fs from "fs";
import * as path from "path";

// Simple XML parser — extracts tags from Blogger Atom XML
function extractBetween(xml: string, tag: string): string {
  const open = `<${tag}`;
  const close = `</${tag}>`;
  const start = xml.indexOf(open);
  if (start === -1) return "";
  const contentStart = xml.indexOf(">", start) + 1;
  const end = xml.indexOf(close, contentStart);
  if (end === -1) return "";
  return xml.substring(contentStart, end);
}

function extractAll(xml: string, tag: string): string[] {
  const results: string[] = [];
  let pos = 0;
  const open = `<${tag}`;
  const close = `</${tag}>`;
  
  while (true) {
    const start = xml.indexOf(open, pos);
    if (start === -1) break;
    const end = xml.indexOf(close, start);
    if (end === -1) break;
    results.push(xml.substring(start, end + close.length));
    pos = end + close.length;
  }
  return results;
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const tagStart = xml.indexOf(`<${tag}`);
  if (tagStart === -1) return "";
  const tagEnd = xml.indexOf(">", tagStart);
  const tagStr = xml.substring(tagStart, tagEnd);
  const attrStart = tagStr.indexOf(`${attr}="`);
  if (attrStart === -1) {
    const attrStart2 = tagStr.indexOf(`${attr}='`);
    if (attrStart2 === -1) return "";
    const valStart = attrStart2 + attr.length + 2;
    const valEnd = tagStr.indexOf("'", valStart);
    return tagStr.substring(valStart, valEnd);
  }
  const valStart = attrStart + attr.length + 2;
  const valEnd = tagStr.indexOf('"', valStart);
  return tagStr.substring(valStart, valEnd);
}

function extractAllAttrs(xml: string, tag: string, attr: string): string[] {
  const results: string[] = [];
  let pos = 0;
  while (true) {
    const start = xml.indexOf(`<${tag}`, pos);
    if (start === -1) break;
    const end = xml.indexOf(">", start);
    if (end === -1) break;
    const segment = xml.substring(start, end + 1);
    const attrMatch = new RegExp(`${attr}=["']([^"']+)["']`).exec(segment);
    if (attrMatch) results.push(attrMatch[1]);
    pos = end + 1;
  }
  return results;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirstImage(html: string): string {
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(html);
  return match ? match[1] : "";
}

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 250));
}

interface BloggerPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
  updatedAt: string;
  bloggerUrl: string;
  tags: string[];
  readingTime: number;
  wordCount: number;
}

function parseBloggerXml(xmlPath: string): BloggerPost[] {
  console.log(`📄 Reading XML from: ${xmlPath}`);
  const xml = fs.readFileSync(xmlPath, "utf-8");
  
  const entries = extractAll(xml, "entry");
  console.log(`📦 Found ${entries.length} total entries`);
  
  const posts: BloggerPost[] = [];
  
  for (const entry of entries) {
    // Skip settings/template entries — only process actual posts
    const categories = extractAllAttrs(entry, "category", "term");
    const isPost = categories.some(
      (c) => c === "http://schemas.google.com/blogger/2008/kind#post"
    );
    if (!isPost) continue;
    
    // Skip drafts
    const draft = extractBetween(entry, "app:draft");
    if (draft === "yes") continue;
    
    const title = extractBetween(entry, "title")
      .replace(/<!\[CDATA\[/, "")
      .replace(/\]\]>/, "")
      .trim();
    
    if (!title) continue;
    
    const content = extractBetween(entry, "content")
      .replace(/<!\[CDATA\[/, "")
      .replace(/\]\]>/, "");
    
    const published = extractBetween(entry, "published");
    const updated = extractBetween(entry, "updated");
    
    // Extract original Blogger URL
    let bloggerUrl = "";
    const links = extractAll(entry, "link");
    // Actually, just find href with rel="alternate"
    const altLinkMatch = /href=["']([^"']*\.html)["']/i.exec(entry);
    if (altLinkMatch) {
      bloggerUrl = altLinkMatch[1];
    }
    
    // Extract tags (skip Blogger kind categories)
    const tags = categories.filter(
      (c) => !c.startsWith("http://schemas.google.com/")
    );
    
    const plainText = htmlToPlainText(content);
    const slug = slugify(title);
    const excerpt = plainText.substring(0, 200).trim() + "...";
    const featuredImage = extractFirstImage(content);
    const wordCount = plainText.split(/\s+/).length;
    const readingTime = estimateReadingTime(plainText);
    
    posts.push({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      publishedAt: published,
      updatedAt: updated,
      bloggerUrl,
      tags,
      readingTime,
      wordCount,
    });
  }
  
  console.log(`✅ Parsed ${posts.length} publishable posts`);
  return posts;
}

function generateRedirectMap(posts: BloggerPost[]): Record<string, string> {
  const redirects: Record<string, string> = {};
  
  for (const post of posts) {
    if (!post.bloggerUrl) continue;
    
    try {
      const url = new URL(post.bloggerUrl);
      const oldPath = url.pathname;
      const newPath = `/${post.slug}`;
      redirects[oldPath] = newPath;
    } catch {
      // If URL parsing fails, try regex
      const match = /\/\d{4}\/\d{2}\/[^"']+\.html/.exec(post.bloggerUrl);
      if (match) {
        redirects[match[0]] = `/${post.slug}`;
      }
    }
  }
  
  return redirects;
}

function generateFirestoreImport(posts: BloggerPost[]): object[] {
  return posts.map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    contentJson: {},
    featuredImage: post.featuredImage,
    authorId: "desknomads-team",
    categoryId: "", // Map manually after import
    status: "published",
    publishedAt: post.publishedAt,
    scheduledAt: null,
    readingTime: post.readingTime,
    wordCount: post.wordCount,
    seoTitle: post.title,
    seoDescription: post.excerpt,
    canonicalUrl: "",
    ogImage: post.featuredImage,
    tags: post.tags,
    faqs: [],
    toc: [],
    internalLinks: [],
    seoScore: 0,
    readabilityScore: 0,
    views: 0,
    isFeatured: false,
    isTrending: false,
    bloggerOriginalUrl: post.bloggerUrl,
    createdAt: post.publishedAt,
    updatedAt: post.updatedAt,
  }));
}

// ─── Main ───────────────────────────────────────────────────────
async function main() {
  const xmlPath = process.argv[2];
  
  if (!xmlPath) {
    console.error("❌ Usage: npx tsx scripts/import-blogger.ts <path-to-blogger-export.xml>");
    process.exit(1);
  }
  
  if (!fs.existsSync(xmlPath)) {
    console.error(`❌ File not found: ${xmlPath}`);
    process.exit(1);
  }
  
  console.log("🚀 DeskNomads Blogger Import Tool");
  console.log("─".repeat(40));
  
  // Parse
  const posts = parseBloggerXml(xmlPath);
  
  if (posts.length === 0) {
    console.log("⚠️  No posts found in the export file.");
    process.exit(0);
  }
  
  // Generate outputs
  const redirectMap = generateRedirectMap(posts);
  const firestoreData = generateFirestoreImport(posts);
  
  // Write outputs
  const outDir = path.join(process.cwd(), "scripts", "output");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  // 1. Firestore import JSON
  const firestorePath = path.join(outDir, "firestore-articles.json");
  fs.writeFileSync(firestorePath, JSON.stringify(firestoreData, null, 2));
  console.log(`📁 Firestore data: ${firestorePath}`);
  
  // 2. Redirect map JSON
  const redirectPath = path.join(outDir, "redirect-map.json");
  fs.writeFileSync(redirectPath, JSON.stringify(redirectMap, null, 2));
  console.log(`📁 Redirect map: ${redirectPath}`);
  
  // 3. Redirect map as TypeScript (for middleware.ts)
  const redirectTs = `// Auto-generated redirect map from Blogger import
// Paste this into src/middleware.ts staticRedirects
export const staticRedirects: Record<string, string> = ${JSON.stringify(redirectMap, null, 2)};
`;
  const redirectTsPath = path.join(outDir, "redirect-map.ts");
  fs.writeFileSync(redirectTsPath, redirectTs);
  console.log(`📁 Redirect TS: ${redirectTsPath}`);
  
  // Summary
  console.log("\n─".repeat(40));
  console.log(`✅ Import complete!`);
  console.log(`   📝 ${posts.length} articles parsed`);
  console.log(`   🔀 ${Object.keys(redirectMap).length} redirects mapped`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Review firestore-articles.json`);
  console.log(`   2. Import to Firestore via Admin SDK or console`);
  console.log(`   3. Copy redirect-map.ts contents to src/middleware.ts`);
  console.log(`   4. Map categoryId for each article`);
  console.log(`   5. Re-host images from Blogger to Firebase Storage`);
}

main().catch(console.error);
