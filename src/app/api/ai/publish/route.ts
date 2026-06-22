import { NextRequest, NextResponse } from "next/server";
import { isCronOrAdmin } from "@/lib/ai/auth";
import { runDailyPublish } from "@/lib/ai/pipeline";
import { EngineConfigError } from "@/lib/ai/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  if (!(await isCronOrAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runDailyPublish();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const status = err instanceof EngineConfigError ? 503 : 500;
    return NextResponse.json({ success: false, error: String(err) }, { status });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
