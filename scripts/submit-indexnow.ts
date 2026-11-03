import { getPublishedSlugs } from "../src/lib/firebase/server-data";
import { submitToIndexNow, INDEXNOW_HOST } from "../src/lib/seo/indexnow";

async function main() {
  console.log("Fetching all published indexable articles from Firestore...");
  const articles = await getPublishedSlugs();
  const siteUrl = `https://${INDEXNOW_HOST}`;

  const coreUrls = [
    siteUrl,
    `${siteUrl}/tools`,
    `${siteUrl}/stories`,
    `${siteUrl}/trending`,
    `${siteUrl}/category/ai-tools`,
    `${siteUrl}/category/remote-jobs`,
    `${siteUrl}/category/passive-income`,
    `${siteUrl}/category/automation`,
    `${siteUrl}/category/productivity`,
    `${siteUrl}/llms.txt`,
  ];

  const articleUrls = articles.filter((a) => a.slug).map((a) => `${siteUrl}/${a.slug}`);
  const allUrls = [...coreUrls, ...articleUrls];

  console.log(`Submitting ${allUrls.length} total URLs to IndexNow (Bing, Yandex, Seznam, AI search)...`);
  const result = await submitToIndexNow(allUrls);

  console.log(`IndexNow Status: ${result.status} (${result.ok ? "SUCCESS" : "ERROR"})`);
  console.log(`Response: ${result.text}`);

  process.exit(result.ok ? 0 : 1);
}

main().catch((err) => {
  console.error("IndexNow script failed:", err);
  process.exit(1);
});
