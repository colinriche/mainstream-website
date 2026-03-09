// lib/firebaseOperator.js
// Operator Firebase project (named app). Used only by /theoperator/* pages.
// Initialized only in the browser to avoid auth/invalid-api-key during prerender
// when Operator env vars are not available on the server.

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const OPERATOR_APP_NAME = "operator";

const operatorConfig = {
  apiKey: process.env.NEXT_PUBLIC_OPERATOR_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_OPERATOR_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_OPERATOR_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_OPERATOR_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_OPERATOR_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_OPERATOR_FIREBASE_APP_ID,
};

let operatorApp = null;

function getOperatorApp() {
  if (typeof window === "undefined") return null;
  if (!operatorConfig.apiKey) return null;
  if (operatorApp) return operatorApp;
  const existing = getApps().find((app) => app.name === OPERATOR_APP_NAME);
  if (existing) {
    operatorApp = existing;
    return operatorApp;
  }
  operatorApp = initializeApp(operatorConfig, OPERATOR_APP_NAME);
  return operatorApp;
}

/**
 * Returns Operator Auth instance, or null on server / when Operator config is not set.
 * Use only in client-side code (e.g. inside useEffect or event handlers).
 */
export function getOperatorAuth() {
  const app = getOperatorApp();
  return app ? getAuth(app) : null;
}

/**
 * Returns Operator Firestore instance, or null on server / when Operator config is not set.
 * Use only in client-side code.
 */
export function getOperatorDb() {
  const app = getOperatorApp();
  return app ? getFirestore(app) : null;
}

export default getOperatorApp;
