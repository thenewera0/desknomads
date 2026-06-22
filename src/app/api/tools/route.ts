import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const revalidate = 600;

/** Public list of approved directory tools for the homepage + /tools page. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featuredOnly = searchParams.get("featured") === "true";
  const limit = Number(searchParams.get("limit")) || 100;

  try {
    const snap = await adminDb.collection("tools").where("status", "==", "approved").get();
    let tools = snap.docs.map((d) => {
      const t = d.data();
      return {
        id: d.id,
        name: t.name || "",
        slug: t.slug || "",
        description: t.description || "",
        logoUrl: t.logoUrl || "",
        url: t.url || "",
        category: t.category || "AI Tools",
        pricing: t.pricing || "freemium",
        rating: t.rating || 0,
        isFeatured: !!t.isFeatured,
        isVerified: !!t.isVerified,
        tags: t.tags || [],
      };
    });
    tools.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.rating - a.rating);
    if (featuredOnly) tools = tools.filter((t) => t.isFeatured);
    return NextResponse.json({ success: true, tools: tools.slice(0, limit) });
  } catch (err) {
    console.error("Public tools fetch failed:", err);
    return NextResponse.json({ success: true, tools: [] });
  }
}
