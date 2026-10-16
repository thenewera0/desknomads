import { adminDb } from "@/lib/firebase/admin";
import { getEngineSettings, getEligibleOpportunities } from "@/lib/ai/store";

async function main() {
  console.log("=== 1. ENGINE SETTINGS ===");
  const settings = await getEngineSettings();
  console.log(JSON.stringify(settings, null, 2));

  console.log("\n=== 2. ELIGIBLE OPPORTUNITIES ===");
  const eligible = await getEligibleOpportunities(settings.minTopicScore, 10);
  console.log(`Found ${eligible.length} eligible opportunities with score >= ${settings.minTopicScore}`);
  eligible.forEach(e => console.log(`  [${e.topicScore}] ${e.title} (${e.status})`));

  console.log("\n=== 3. RECENT GENERATION LOGS (Last 15) ===");
  const logsSnap = await adminDb.collection("generationLogs").orderBy("createdAt", "desc").limit(15).get();
  logsSnap.docs.forEach(d => {
    const data = d.data();
    const time = data.createdAt?.toDate?.()?.toISOString() || "no-time";
    console.log(`  [${time}] [${data.stage}] [${data.status}] ${data.message}`);
  });

  console.log("\n=== 4. RECENT PUBLISHED ARTICLES (Last 10) ===");
  const articlesSnap = await adminDb.collection("articles").where("status", "==", "published").get();
  const sortedArticles = articlesSnap.docs
    .map(d => d.data())
    .sort((a, b) => {
      const da = a.publishedAt?.toDate ? a.publishedAt.toDate().getTime() : new Date(a.publishedAt || 0).getTime();
      const db = b.publishedAt?.toDate ? b.publishedAt.toDate().getTime() : new Date(b.publishedAt || 0).getTime();
      return db - da;
    })
    .slice(0, 10);
  sortedArticles.forEach(data => {
    const pub = data.publishedAt?.toDate?.()?.toISOString() || data.publishedAt || "no-date";
    console.log(`  [${pub}] ${data.title} (/ ${data.slug}) [views: ${data.views || 0}]`);
  });

  process.exit(0);
}

main().catch(err => {
  console.error("Diagnostic error:", err);
  process.exit(1);
});
