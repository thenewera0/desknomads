import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/ai/auth";
import { getLogs } from "@/lib/ai/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const limit = Number(new URL(req.url).searchParams.get("limit")) || 100;
  try {
    const logs = await getLogs(limit);
    return NextResponse.json({ success: true, logs });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
