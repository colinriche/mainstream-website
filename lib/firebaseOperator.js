// lib/firebaseOperator.js
// Operator Firebase project (named app). Used only by /theoperator/* pages.

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

function getOperatorApp() {
  const existing = getApps().find((app) => app.name === OPERATOR_APP_NAME);
  if (existing) return existing;
  return initializeApp(operatorConfig, OPERATOR_APP_NAME);
}

const operatorApp = getOperatorApp();

export const operatorAuth = getAuth(operatorApp);
export const operatorDb = getFirestore(operatorApp);

export default operatorApp;
