/**
 * Firebase Admin SDK (server-only). Used for Operator admin username login:
 * look up user by username and issue custom token so client can sign in.
 * Requires FIREBASE_SERVICE_ACCOUNT_KEY (JSON string) in env.
 */

let admin = null;

function getAdmin() {
  if (typeof window !== "undefined") return null;
  if (admin !== null) return admin;
  try {
    // eslint-disable-next-line global-require
    const firebaseAdmin = require("firebase-admin");
    if (!firebaseAdmin.apps?.length) {
      const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      if (key) {
        const serviceAccount = typeof key === "string" ? JSON.parse(key) : key;
        firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(serviceAccount) });
      } else {
        firebaseAdmin.initializeApp();
      }
    }
    admin = firebaseAdmin;
  } catch (e) {
    console.error("Firebase Admin init error:", e.message);
  }
  return admin;
}

export function getAdminAuth() {
  const a = getAdmin();
  return a ? a.auth() : null;
}

export function getAdminFirestore() {
  const a = getAdmin();
  return a ? a.firestore() : null;
}
