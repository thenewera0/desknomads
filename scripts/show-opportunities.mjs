// Print discovered opportunities + scores. Run: node --env-file=.env.local scripts/show-opportunities.mjs
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
const snap = await db.collection("opportunities").orderBy("topicScore", "desc").get();
console.log(`Total opportunities: ${snap.size}\n`);
for (const d of snap.docs) {
  const o = d.data();
  const s = o.scores || {};
  console.log(`[${String(o.topicScore).padStart(3)}] ${o.title}`);
  console.log(`      ${o.category} | dem:${s.searchDemand} trend:${s.trendVelocity} comp:${s.lowCompetition} viral:${s.viralPotential} rel:${s.relevance} | ${o.status}`);
}
