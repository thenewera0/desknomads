/**
 * Authorization helpers for the engine API routes.
 *  - Cron routes accept Vercel's cron header or a shared CRON_SECRET bearer.
 *  - Admin routes verify a Firebase ID token from the signed-in admin user.
 */
import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { getCronSecret } from "./config";

export function isCronAuthorized(req: NextRequest): boolean {
  // Vercel Cron requests include this header automatically.
  if (req.headers.get("x-vercel-cron")) return true;
  const secret = getCronSecret();
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

export async function isAdminAuthorized(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return false;
  try {
    await adminAuth.verifyIdToken(token);
    return true;
  } catch {
    return false;
  }
}

/** Authorized if the request is a valid cron call OR a signed-in admin. */
export async function isCronOrAdmin(req: NextRequest): Promise<boolean> {
  if (isCronAuthorized(req)) return true;
  return isAdminAuthorized(req);
}
