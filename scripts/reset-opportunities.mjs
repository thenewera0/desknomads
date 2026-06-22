// Delete all docs in the `opportunities` collection (test cleanup).
// Run: node --env-file=.env.local scripts/reset-opportunities.mjs
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = getApps()[0] || initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);
const snap = await db.collection("opportunities").get();
let n = 0;
for (let i = 0; i < snap.docs.length; i += 450) {
  const batch = db.batch();
  for (const d of snap.docs.slice(i, i + 450)) { batch.delete(d.ref); n++; }
  await batch.commit();
}
console.log(`Deleted ${n} opportunity docs.`);
