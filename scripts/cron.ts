/**
 * Standalone cron entry for the autonomous content engine.
 * Runs the pipeline directly in Node (e.g. inside GitHub Actions) so it isn't
 * bound by serverless function time limits.
 *
 * Usage:
 *   npx tsx scripts/cron.ts discover      # scan + score topic opportunities
 *   npx tsx scripts/cron.ts publish       # generate + auto-publish the daily articles
 *   npx tsx scripts/cron.ts performance   # ingest Google Search Console metrics
 *
 * All configuration is read from environment variables (see .env.example).
 */
import { runDiscovery, runDailyPublish, ingestSearchConsole } from "@/lib/ai/pipeline";

async function main() {
  const task = process.argv[2];
  const started = Date.now();
  console.log(`[cron] task="${task}" started at ${new Date().toISOString()}`);

  switch (task) {
    case "discover": {
      const r = await runDiscovery();
      console.log("[cron] discovery result:", r);
      break;
    }
    case "publish": {
      const r = await runDailyPublish();
      console.log("[cron] publish result:", r);
      break;
    }
    case "performance": {
      const r = await ingestSearchConsole();
      console.log("[cron] performance result:", r);
      break;
    }
    default:
      console.error(`[cron] unknown task "${task}". Use: discover | publish | performance`);
      process.exit(1);
  }

  console.log(`[cron] done in ${Math.round((Date.now() - started) / 1000)}s`);
  // firebase-admin keeps the event loop alive — force a clean exit.
  process.exit(0);
}

main().catch((err) => {
  console.error("[cron] FAILED:", err);
  process.exit(1);
});
