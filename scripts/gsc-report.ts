/**
 * Search Console diagnostic: impressions/clicks + per-URL index status.
 * Run: node --env-file=.env.local --import tsx scripts/gsc-report.ts
 */
import { JWT } from "google-auth-library";
import { getGscCredentials, getGscSiteUrl } from "@/lib/ai/config";
import { adminDb } from "@/lib/firebase/admin";

const site = getGscSiteUrl(); // sc-domain:desknomads.store
const { clientEmail, privateKey } = getGscCredentials();
const client = new JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
});

const SA_URL = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;

async function sa(body: Record<string, unknown>) {
  const res = await client.request<{ rows?: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[] }>(
    { url: SA_URL, method: "POST", data: body }
  );
  return res.data.rows || [];
}

async function inspect(url: string): Promise<string> {
  try {
    const res = await client.request<{ inspectionResult?: { indexStatusResult?: { coverageState?: string; verdict?: string; lastCrawlTime?: string } } }>({
      url: "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
      method: "POST",
      data: { inspectionUrl: url, siteUrl: site },
    });
    const r = res.data.inspectionResult?.indexStatusResult;
    return `${r?.verdict || "?"} | ${r?.coverageState || "?"}${r?.lastCrawlTime ? " | crawled " + r.lastCrawlTime.slice(0, 10) : ""}`;
  } catch (e: unknown) {
    const err = e as { response?: { data?: unknown }; message?: string };
    return `inspect error: ${err.response?.data ? JSON.stringify(err.response.data).slice(0, 120) : err.message}`;
  }
}

async function main() {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 2);
  const start = new Date("2026-06-01");
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const range = { startDate: fmt(start), endDate: fmt(end) };
  console.log(`Property: ${site}\nWindow: ${range.startDate} .. ${range.endDate}\n`);

  const totals = await sa({ ...range });
  const t = totals[0];
  console.log("=== TOTAL (search) ===");
  console.log(t ? `impressions: ${t.impressions} | clicks: ${t.clicks} | ctr: ${(t.ctr * 100).toFixed(2)}% | avg pos: ${t.position.toFixed(1)}` : "no impressions at all yet");

  const daily = await sa({ ...range, dimensions: ["date"] });
  console.log(`\n=== days with any impressions: ${daily.length} ===`);
  daily.slice(-7).forEach((r) => console.log(`  ${r.keys[0]}: ${r.impressions} impr, ${r.clicks} clicks`));

  const queries = await sa({ ...range, dimensions: ["query"], rowLimit: 15 });
  console.log(`\n=== top queries (${queries.length}) ===`);
  queries.forEach((r) => console.log(`  "${r.keys[0]}" — ${r.impressions} impr, ${r.clicks} clicks, pos ${r.position.toFixed(1)}`));

  const pages = await sa({ ...range, dimensions: ["page"], rowLimit: 15 });
  console.log(`\n=== top pages by impressions (${pages.length}) ===`);
  pages.forEach((r) => console.log(`  ${r.impressions} impr | ${r.keys[0]}`));

  // Index status for a sample of published articles
  const snap = await adminDb.collection("articles").where("status", "==", "published").limit(8).get();
  console.log(`\n=== index status (URL Inspection) — sample of ${snap.size} articles ===`);
  for (const d of snap.docs) {
    const url = `https://www.desknomads.store/${d.data().slug}`;
    console.log(`  ${await inspect(url)}\n    ${url}`);
  }
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
