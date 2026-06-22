// Switch tool logos to Google's reliable favicon service.
// Run: node --env-file=.env.local scripts/fix-tool-logos.mjs
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

const snap = await db.collection("tools").get();
let updated = 0;
for (const d of snap.docs) {
  const logoUrl = d.data().logoUrl || "";
  const m = logoUrl.match(/logo\.clearbit\.com\/([^/?]+)/);
  if (!m) continue;
  const domain = m[1];
  await d.ref.update({ logoUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=128` });
  updated++;
}
console.log(`Updated ${updated} tool logos to Google favicons.`);
