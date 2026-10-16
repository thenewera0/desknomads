/**
 * Migration Script: Fix Canonical URLs in Firestore
 * Updates all legacy 'desknomads.shop' canonical URLs to 'https://www.desknomads.store/${slug}'
 * Run: node --env-file=.env.local --import tsx scripts/fix-canonical-urls.ts
 */
import { adminDb } from "../src/lib/firebase/admin";

async function main() {
  console.log("Starting canonical URL fix across all articles...");
  const snap = await adminDb.collection("articles").get();
  console.log(`Found ${snap.size} articles in Firestore.`);

  let updated = 0;
  let batch = adminDb.batch();
  let countInBatch = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const slug = data.slug;
    if (!slug) continue;

    const currentCanonical = data.canonicalUrl || "";
    const correctCanonical = `https://www.desknomads.store/${slug}`;

    if (currentCanonical !== correctCanonical) {
      batch.update(doc.ref, {
        canonicalUrl: correctCanonical,
      });
      updated++;
      countInBatch++;

      if (countInBatch >= 450) {
        await batch.commit();
        console.log(`Committed batch of ${countInBatch} updates...`);
        batch = adminDb.batch();
        countInBatch = 0;
      }
    }
  }

  if (countInBatch > 0) {
    await batch.commit();
    console.log(`Committed final batch of ${countInBatch} updates.`);
  }

  console.log(`\n✅ Successfully updated ${updated} articles to canonical domain https://www.desknomads.store!`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
