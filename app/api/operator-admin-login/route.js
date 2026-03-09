/**
 * Operator admin login: username only. Looks up user by username in Firestore,
 * requires role === 'admin', then returns a Firebase custom token so the client
 * can sign in as that user. Credentials stay server-side.
 */

import { NextResponse } from "next/server";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebaseAdmin";

export async function POST(request) {
  try {
    const body = await request.json();
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    const adminAuth = getAdminAuth();
    const adminDb = getAdminFirestore();
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: "Server auth not configured" },
        { status: 503 }
      );
    }

    const usersRef = adminDb.collection("user");
    const snapshot = await usersRef.where("username", "==", username).limit(1).get();
    if (snapshot.empty) {
      return NextResponse.json({ error: "Invalid username" }, { status: 401 });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    if (data?.role !== "admin") {
      return NextResponse.json({ error: "Invalid username" }, { status: 401 });
    }

    const userId = doc.id;
    const token = await adminAuth.createCustomToken(userId);
    return NextResponse.json({ token });
  } catch (err) {
    console.error("operator-admin-login:", err);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
