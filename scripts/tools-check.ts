import { adminDb } from "@/lib/firebase/admin";

async function main() {
  const snap = await adminDb.collection("tools").get();
  console.log("total tool docs:", snap.size);
  let missing = 0;
  snap.docs.forEach((d) => {
    const t = d.data();
    const has = !!(t.url && String(t.url).trim());
    if (!has) missing++;
    console.log(`${has ? "OK " : "NO-URL"} | ${t.status || "?"} | ${t.name} -> ${t.url || "(empty)"}`);
  });
  console.log(`\nmissing url: ${missing}/${snap.size}`);
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
