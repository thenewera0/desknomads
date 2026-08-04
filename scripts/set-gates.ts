/**
 * Adjust engine gates. Autocomplete already validates topic demand, so the LLM
 * topic-score gate can be lower; fact-check stays reasonably strict.
 * Run: node --env-file=.env.local --import tsx scripts/set-gates.ts
 */
import { getEngineSettings, updateEngineSettings } from "@/lib/ai/store";

async function main() {
  const before = await getEngineSettings();
  console.log("before:", { minTopicScore: before.minTopicScore, minFactCheckConfidence: before.minFactCheckConfidence, autoPublishEnabled: before.autoPublishEnabled });
  await updateEngineSettings({ minTopicScore: 65, minFactCheckConfidence: 65 });
  const after = await getEngineSettings();
  console.log("after: ", { minTopicScore: after.minTopicScore, minFactCheckConfidence: after.minFactCheckConfidence });
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
