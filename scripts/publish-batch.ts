/**
 * One-off: run fresh (demand-anchored) discovery, then generate + auto-publish
 * the top N eligible opportunities with the full SEO pipeline.
 * Run: node --env-file=.env.local --import tsx scripts/publish-batch.ts 5
 */
import { runDiscovery, generateArticleFromOpportunity } from "@/lib/ai/pipeline";
import { getEligibleOpportunities, getEngineSettings } from "@/lib/ai/store";

async function main() {
  const N = Number(process.argv[2] || 5);

  console.log("=== 1. Discovery (real-demand anchored) ===");
  const disc = await runDiscovery();
  console.log("   ", disc);

  const settings = await getEngineSettings();
  const eligible = await getEligibleOpportunities(settings.minTopicScore, N);
  console.log(`\n=== 2. Publishing top ${eligible.length} (minScore ${settings.minTopicScore}) ===`);
  if (!eligible.length) {
    console.log("No eligible opportunities — lower minTopicScore or check discovery.");
    process.exit(1);
  }

  const results: { title: string; slug: string; status: string; wordCount: number; seoScore: number; conf: number }[] = [];
  for (const opp of eligible) {
    try {
      console.log(`\n→ ${opp.title}  (topicScore ${opp.topicScore}, kw "${opp.primaryKeyword}")`);
      const r = await generateArticleFromOpportunity(opp, { autoPublish: true });
      console.log(`   ${r.status.toUpperCase()}  /${r.slug}  | ${r.wordCount}w | SEO ${r.seoScore} | factcheck ${r.factCheckConfidence}`);
      results.push({ title: opp.title, slug: r.slug, status: r.status, wordCount: r.wordCount, seoScore: r.seoScore, conf: r.factCheckConfidence });
    } catch (e) {
      console.log(`   FAILED: ${String((e as Error)?.message || e).slice(0, 200)}`);
    }
  }

  const pub = results.filter((r) => r.status === "published").length;
  console.log(`\n=== Done: ${pub} published, ${results.length - pub} to review, ${eligible.length - results.length} failed ===`);
  results.forEach((r) => console.log(`  [${r.status}] ${r.wordCount}w SEO${r.seoScore}  https://www.desknomads.store/${r.slug}`));
  process.exit(0);
}
main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
