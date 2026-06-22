import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await adminDb
      .collection("subscribers")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { success: true, id: existing.docs[0].id, message: "Already subscribed" },
        { status: 200 }
      );
    }

    // Add new subscriber
    const docRef = await adminDb.collection("subscribers").add({
      email,
      name: name || "",
      status: "pending",
      segments: [],
      subscribedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { success: true, id: docRef.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
