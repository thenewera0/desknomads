import { gatherSignals, synthesizeOpportunities } from "@/lib/ai/trends";

async function main() {
  console.log("Gathering signals...");
  const signals = await gatherSignals();
  const real = signals.filter((s) => s.source === "Google Autocomplete");
  console.log(`Total signals: ${signals.length} | real Google searches: ${real.length}`);

  console.log("\nSynthesizing 8 opportunities (demand-anchored)...\n");
  const opps = await synthesizeOpportunities(signals, 8, []);
  opps.forEach((o, i) => {
    console.log(`${i + 1}. ${o.title}`);
    console.log(`   keyword: "${o.primaryKeyword}"  | ${o.category} | ${o.searchIntent}`);
  });
  process.exit(0);
}
main().catch((e) => { console.error("FAILED:", e); process.exit(1); });
