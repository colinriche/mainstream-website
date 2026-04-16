/**
 * Operator waitlist: collect email (required), name (optional), phone (optional).
 * Saves to the `waitlist` collection in Operator Firestore via Admin SDK.
 */

import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebaseAdmin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const isTester = body?.isTester === true;

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const db = getAdminFirestore();
    if (!db) {
      return NextResponse.json({ error: "Database not available." }, { status: 503 });
    }

    // Prevent duplicate sign-ups for the same email
    const existing = await db
      .collection("waitlist")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json({ alreadyRegistered: true, message: "You're already on the waitlist!" });
    }

    const entry = {
      email,
      name: name || null,
      phone: phone || null,
      isTester,
      createdAt: new Date().toISOString(),
    };

    const ref = await db.collection("waitlist").add(entry);

    console.log("Operator waitlist entry saved:", ref.id, email);
    return NextResponse.json({ success: true, id: ref.id });
  } catch (err) {
    console.error("operator-waitlist error:", err);
    return NextResponse.json({ error: "Failed to join waitlist. Please try again." }, { status: 500 });
  }
}
