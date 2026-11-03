import { initializeApp, getApps, cert, type App, type ServiceAccount } from "firebase-admin/app";
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

function getAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizeKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  const serviceAccount: ServiceAccount = {
    projectId,
    clientEmail,
    privateKey,
  };

  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

// Lazy proxy wrapper: defers initialization until a method or property is accessed.
// Prevents build-time module-load crashes during Next.js static analysis/page data collection
// if environment variables are not injected into the build container.
function createLazyService<T extends object>(getter: (app: App) => T, serviceName: string): T {
  let instance: T | null = null;
  return new Proxy({} as T, {
    get(_target, prop) {
      if (!instance) {
        const app = getAdminApp();
        if (!app) {
          throw new Error(
            `Firebase Admin (${serviceName}) cannot be initialized: missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY environment variables.`
          );
        }
        instance = getter(app);
      }
      const val = (instance as any)[prop];
      return typeof val === "function" ? val.bind(instance) : val;
    },
  });
}

const adminApp = getAdminApp();
const adminDb = createLazyService((app) => getFirestore(app), "Firestore");
const adminAuth = createLazyService((app) => getAuth(app), "Auth");
const adminStorage = createLazyService((app) => getStorage(app), "Storage");

export { adminApp, adminDb, adminAuth, adminStorage };
