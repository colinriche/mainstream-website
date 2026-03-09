"use client";

/**
 * Operator app authentication (Phone OTP).
 * Uses Firebase Auth only; no credentials stored in app code or localStorage.
 * Session is persisted securely by Firebase Auth (IndexedDB).
 * Uses getOperatorAuth() so Firebase is not initialized during SSR/prerender.
 */

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getOperatorAuth } from "./firebaseOperator";

const RECAPTCHA_CONTAINER_ID = "operator-recaptcha-container";

/**
 * Initialize RecaptchaVerifier. Call once when login form is mounted.
 * @param {string} [containerId=RECAPTCHA_CONTAINER_ID]
 * @returns {RecaptchaVerifier|null}
 */
export function getRecaptchaVerifier(containerId = RECAPTCHA_CONTAINER_ID) {
  if (typeof window === "undefined") return null;
  const auth = getOperatorAuth();
  if (!auth) return null;
  const existing = window.__operatorRecaptchaVerifier;
  if (existing) {
    try {
      existing.clear();
    } catch (_) {}
  }
  const verifier = new RecaptchaVerifier(
    containerId,
    {
      size: "normal",
      callback: () => {},
      "expired-callback": () => {},
    },
    auth
  );
  window.__operatorRecaptchaVerifier = verifier;
  return verifier;
}

/**
 * Send OTP to phone number. Returns confirmation result for verifyOtp().
 * @param {string} phoneNumber - E.164 format (e.g. +44...)
 * @param {RecaptchaVerifier} verifier
 * @returns {Promise<import("firebase/auth").ConfirmationResult>}
 */
export async function sendPhoneOtp(phoneNumber, verifier) {
  const auth = getOperatorAuth();
  if (!auth) throw new Error("Operator auth not available");
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
}

/**
 * Verify OTP and sign in. On success, Firebase Auth session is set (no local credential storage).
 * @param {string} verificationId - From confirmationResult.verificationId
 * @param {string} otp - User-entered code
 */
export async function verifyPhoneOtp(verificationId, otp) {
  const auth = getOperatorAuth();
  if (!auth) throw new Error("Operator auth not available");
  const credential = PhoneAuthProvider.credential(verificationId, otp);
  await signInWithCredential(auth, credential);
}

/**
 * Sign out. Clears Firebase Auth session.
 */
export async function signOut() {
  const auth = getOperatorAuth();
  if (auth) await firebaseSignOut(auth);
}

export { getOperatorAuth, RECAPTCHA_CONTAINER_ID };
