import { gatherSignals, synthesizeOpportunities } from "@/lib/ai/trends";
import { getLinkableArticles, getOpportunities } from "@/lib/ai/store";

async function main() {
  const [publishedTitles, pending] = await Promise.all([
    getLinkableArticles().catch(() => []),
    getOpportunities().catch(() => []),
  ]);
  const existingTitles = [
    ...publishedTitles.map((a) => a.title),
    ...pending
      .filter((o) => o.status === "discovered" || o.status === "queued")
      .map((o) => o.title),
  ];
  console.log(`Existing titles count: ${existingTitles.length}`);
  const signals = await gatherSignals();
  const opps = await synthesizeOpportunities(signals, 8, existingTitles);
  console.log(`Synthesized & deduped opportunities count: ${opps.length}`);
  opps.forEach((o, i) => console.log(`${i + 1}. [${o.category}] ${o.title}`));
  process.exit(0);
}
main().catch(err => { console.error("ERR:", err); process.exit(1); });
