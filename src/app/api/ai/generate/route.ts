import { NextRequest, NextResponse } from "next/server";
import { isCronOrAdmin } from "@/lib/ai/auth";
import { generateArticleFromOpportunity, getOpportunityById } from "@/lib/ai/pipeline";
import { EngineConfigError } from "@/lib/ai/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Manually generate an article from a specific opportunity (admin or cron secret). */
export async function POST(req: NextRequest) {
  if (!(await isCronOrAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { opportunityId, autoPublish } = await req.json();
    if (!opportunityId) {
      return NextResponse.json({ error: "opportunityId is required" }, { status: 400 });
    }
    const opp = await getOpportunityById(opportunityId);
    if (!opp) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }
    const result = await generateArticleFromOpportunity(opp, { autoPublish: !!autoPublish });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const status = err instanceof EngineConfigError ? 503 : 500;
    return NextResponse.json({ success: false, error: String(err) }, { status });
  }
}
