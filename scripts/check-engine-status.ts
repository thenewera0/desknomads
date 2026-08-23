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
  const articlesSnap = await adminDb.collection("articles").where("status", "==", "published").orderBy("publishedAt", "desc").limit(10).get();
  articlesSnap.docs.forEach(d => {
    const data = d.data();
    const pub = data.publishedAt?.toDate?.()?.toISOString() || data.publishedAt || "no-date";
    console.log(`  [${pub}] ${data.title} (/ ${data.slug})`);
  });

  process.exit(0);
}

main().catch(err => {
  console.error("Diagnostic error:", err);
  process.exit(1);
});
