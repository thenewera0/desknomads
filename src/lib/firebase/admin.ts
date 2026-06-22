import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

// Normalize the private key: strip accidental surrounding quotes and convert
// escaped "\n" to real newlines (covers both single-line and multiline pastes
// across local .env, Vercel, and GitHub Actions).
function normalizeKey(raw: string | undefined): string | undefined {
  if (!raw) return raw;
  return raw.trim().replace(/^["']|["']$/g, "").replace(/\\n/g, "\n");
}

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: normalizeKey(process.env.FIREBASE_PRIVATE_KEY),
};

// Initialize Firebase Admin (server-side only)
const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });

const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);
const adminStorage = getStorage(adminApp);

export { adminApp, adminDb, adminAuth, adminStorage };
