/**
 * Cleanup: archive stale pending opportunities so pre-fix obscure topics can't
 * be published, and optionally unpublish named weak articles (set to draft).
 * Run: node --env-file=.env.local --import tsx scripts/cleanup-batch.ts [slug1 slug2 ...]
 */
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

async function main() {
  // 1. Archive all pending opportunities (discovered/queued) — fresh discovery
  //    will repopulate with demand-anchored topics on the next run.
  const snap = await adminDb.collection("opportunities").where("status", "in", ["discovered", "queued"]).get();
  let archived = 0;
  for (const d of snap.docs) {
    await d.ref.update({ status: "archived", updatedAt: FieldValue.serverTimestamp() });
    archived++;
  }
  console.log(`Archived ${archived} stale pending opportunities.`);

  // 2. Unpublish (draft) any slugs passed as args.
  const slugs = process.argv.slice(2);
  for (const slug of slugs) {
    const q = await adminDb.collection("articles").where("slug", "==", slug).limit(1).get();
    if (q.empty) { console.log(`  not found: ${slug}`); continue; }
    await q.docs[0].ref.update({ status: "draft", publishedAt: null, updatedAt: FieldValue.serverTimestamp() });
    console.log(`  unpublished (draft): ${slug}`);
  }
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
