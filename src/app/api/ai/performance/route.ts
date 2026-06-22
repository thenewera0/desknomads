import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized, isCronOrAdmin } from "@/lib/ai/auth";
import { ingestSearchConsole } from "@/lib/ai/pipeline";
import { getPerformanceMetrics } from "@/lib/ai/store";
import { EngineConfigError } from "@/lib/ai/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Ingest Search Console performance (cron or admin). */
export async function POST(req: NextRequest) {
  if (!(await isCronOrAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const days = Number(new URL(req.url).searchParams.get("days")) || 28;
    const result = await ingestSearchConsole(days);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const status = err instanceof EngineConfigError ? 503 : 500;
    return NextResponse.json({ success: false, error: String(err) }, { status });
  }
}

/** List stored performance metrics (admin). */
export async function GET(req: NextRequest) {
  // Cron also issues GET; route it to ingestion for scheduler compatibility.
  if (req.headers.get("x-vercel-cron")) {
    return POST(req);
  }
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const limit = Number(new URL(req.url).searchParams.get("limit")) || 100;
    const metrics = await getPerformanceMetrics(limit);
    return NextResponse.json({ success: true, metrics });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
