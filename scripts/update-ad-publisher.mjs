// Replace the old AdSense publisher id baked into stored article HTML.
// Run: node --env-file=.env.local scripts/update-ad-publisher.mjs
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const OLD = "ca-pub-6797633093721504";
const NEW = "ca-pub-1562600430581360";

const app = getApps()[0] || initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);

const snap = await db.collection("articles").get();
let updated = 0;
for (const d of snap.docs) {
  const content = d.data().content || "";
  if (!content.includes(OLD)) continue;
  await d.ref.update({
    content: content.split(OLD).join(NEW),
    updatedAt: FieldValue.serverTimestamp(),
  });
  updated++;
}
console.log(`Updated ad publisher id in ${updated} article(s).`);
