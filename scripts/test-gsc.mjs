// Standalone Search Console connectivity probe.
// Run: node --env-file=.env.local scripts/test-gsc.mjs
import { JWT } from "google-auth-library";

const siteUrl = process.env.GSC_SITE_URL;
const email = process.env.GSC_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
const key = (process.env.GSC_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

console.log("Property:", siteUrl);
console.log("Service account:", email);

if (!siteUrl || !email || !key) {
  console.error("❌ Missing GSC_SITE_URL / service-account email / private key in env.");
  process.exit(1);
}

const end = new Date();
end.setUTCDate(end.getUTCDate() - 3);
const start = new Date(end);
start.setUTCDate(start.getUTCDate() - 28);
const fmt = (d) => d.toISOString().slice(0, 10);

const client = new JWT({ email, key, scopes: ["https://www.googleapis.com/auth/webmasters.readonly"] });
const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;

try {
  const res = await client.request({
    url,
    method: "POST",
    data: { startDate: fmt(start), endDate: fmt(end), dimensions: ["date"], rowLimit: 5 },
  });
  const rows = res.data.rows || [];
  console.log(`✅ Connected. Window ${fmt(start)}..${fmt(end)} returned ${rows.length} day-rows.`);
  for (const r of rows) console.log(`   ${r.keys[0]}: ${r.clicks} clicks, ${r.impressions} impressions`);
  if (rows.length === 0) console.log("   (No data yet — normal for a new/low-traffic property.)");
} catch (err) {
  const detail = err?.response?.data ? JSON.stringify(err.response.data) : err?.message;
  console.error("❌ Query failed:", detail);
  console.error("   Common causes: API not enabled, service account not added as a GSC user, or wrong GSC_SITE_URL form.");
  process.exit(1);
}
