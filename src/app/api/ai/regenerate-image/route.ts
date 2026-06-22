import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/ai/auth";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateFeaturedImage } from "@/lib/ai/images";
import { logGeneration } from "@/lib/ai/store";
import { EngineConfigError } from "@/lib/ai/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Regenerate the featured image for an existing article (admin only). */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { articleId } = await req.json();
    if (!articleId) {
      return NextResponse.json({ error: "articleId is required" }, { status: 400 });
    }
    const ref = adminDb.collection("articles").doc(articleId);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    const data = snap.data()!;
    const img = await generateFeaturedImage(
      data.slug || articleId,
      data.seoTitle || data.title || "DeskNomads article",
      "AI Tools",
      data.title || ""
    );
    await ref.update({
      featuredImage: img.url,
      ogImage: img.url,
      updatedAt: FieldValue.serverTimestamp(),
    });
    await logGeneration({
      stage: "regenerate-image",
      status: "success",
      message: `Regenerated featured image for ${data.slug}`,
      articleId,
    });
    return NextResponse.json({ success: true, url: img.url });
  } catch (err) {
    const status = err instanceof EngineConfigError ? 503 : 500;
    return NextResponse.json({ success: false, error: String(err) }, { status });
  }
}
