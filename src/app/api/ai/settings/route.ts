import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/ai/auth";
import { getEngineSettings, updateEngineSettings } from "@/lib/ai/store";
import type { EngineSettings } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await getEngineSettings();
  return NextResponse.json({ success: true, settings });
}

const ALLOWED: (keyof EngineSettings)[] = [
  "autoPublishEnabled",
  "articlesPerDay",
  "minTopicScore",
  "minFactCheckConfidence",
  "minWordCount",
  "publishHourIST",
  "discoverHourIST",
];

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Partial<EngineSettings>;
    const patch: Partial<EngineSettings> = {};
    for (const key of ALLOWED) {
      if (key in body && body[key] !== undefined) {
        // @ts-expect-error narrowed by ALLOWED iteration
        patch[key] = body[key];
      }
    }
    await updateEngineSettings(patch);
    const settings = await getEngineSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
