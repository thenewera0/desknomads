import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/ai/auth";
import { getOpportunities } from "@/lib/ai/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const limit = Number(searchParams.get("limit")) || 100;
  try {
    const opportunities = await getOpportunities({ status, limit });
    return NextResponse.json({ success: true, opportunities });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
