"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Loader2, Shield } from "lucide-react";
import {
  themes,
  getStoredTheme,
  getStoredDarkMode,
  DEFAULT_GUEST_THEME,
  DEFAULT_GUEST_DARK_MODE,
} from "@/lib/siteThemes";
import {
  getOperatorAuth,
  getRecaptchaVerifier,
  sendPhoneOtp,
  verifyPhoneOtp,
  RECAPTCHA_CONTAINER_ID,
} from "@/lib/operatorAuth";
import { onAuthStateChanged } from "firebase/auth";
import { ensureUserDoc } from "@/lib/operatorUser";

export default function OperatorLoginPage() {
  const router = useRouter();
  const [theme, setTheme] = useState(DEFAULT_GUEST_THEME);
  const [darkMode, setDarkMode] = useState(DEFAULT_GUEST_DARK_MODE);
  const [mounted, setMounted] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const confirmationResultRef = useRef(null);
  const verifierRef = useRef(null);

  useEffect(() => {
    setTheme(getStoredTheme());
    setDarkMode(getStoredDarkMode());
    setMounted(true);
  }, []);

  useEffect(() => {
    const auth = getOperatorAuth();
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/theoperator/account");
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!mounted || step !== "phone") return;
    const container = document.getElementById(RECAPTCHA_CONTAINER_ID);
    if (container && !verifierRef.current) {
      try {
        verifierRef.current = getRecaptchaVerifier();
        verifierRef.current.render();
      } catch (e) {
        console.error("RecaptchaVerifier init:", e);
        setError("Could not load security check. Refresh the page.");
      }
    }
    return () => {
      if (verifierRef.current) {
        try {
          verifierRef.current.clear();
        } catch (_) {}
        verifierRef.current = null;
      }
    };
  }, [mounted, step]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    const raw = phone.trim().replace(/\s/g, "");
    const e164 = raw.startsWith("+") ? raw : `+44${raw.replace(/^0/, "")}`;
    if (!e164 || e164.length < 10) {
      setError("Enter a valid phone number (e.g. +44 7xxx or 07xxx).");
      return;
    }
    setLoading(true);
    try {
      const verifier = verifierRef.current;
      if (!verifier) throw new Error("Security check not ready. Refresh and try again.");
      const result = await sendPhoneOtp(e164, verifier);
      confirmationResultRef.current = result;
      setStep("otp");
      setOtp("");
    } catch (err) {
      setError(err.message || "Failed to send code. Check number and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    const code = otp.trim().replace(/\s/g, "");
    if (!code || code.length < 4) {
      setError("Enter the 6-digit code from your phone.");
      return;
    }
    setLoading(true);
    try {
      const result = confirmationResultRef.current;
      if (!result) throw new Error("Session expired. Start again.");
      await verifyPhoneOtp(result.verificationId, code);
      const auth = getOperatorAuth();
      const user = auth?.currentUser;
      if (user) await ensureUserDoc(user.uid);
      router.replace("/theoperator/account");
    } catch (err) {
      setError(err.message || "Invalid code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentTheme = themes[theme];
  const bgGradient = darkMode ? currentTheme.dark : currentTheme.light;
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textMuted = (theme === "black" && darkMode) ? "text-yellow-300" : (darkMode ? "text-gray-400" : "text-gray-600");
  const inputClass = `w-full px-4 py-3 rounded-lg border-2 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-offset-0 ${currentTheme.border}`;

  if (!mounted) {
    return (
      <div className="min-h-screen dark bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-yellow-400/60 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "dark" : ""}`}>
      <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-colors duration-500`}>
        <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
          <Link
            href="/theoperator"
            className={`inline-flex items-center gap-2 ${textMuted} hover:opacity-90 mb-8 transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to The Operator
          </Link>

          <div className={`${darkMode ? "bg-gray-800/90" : "bg-white/95"} rounded-2xl shadow-xl p-6 sm:p-8`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-xl ${currentTheme.accent} text-white`}>
                <Phone className="w-6 h-6" />
              </div>
              <h1 className={`text-2xl font-bold ${textPrimary}`}>Log in</h1>
            </div>
            <p className={`text-sm ${textMuted} mb-6`}>
              Use the same phone number as in The Operator app. We&apos;ll send you a one-time code.
            </p>

            <div id={RECAPTCHA_CONTAINER_ID} className="mb-4" />

            {step === "phone" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <label className={`block text-sm font-medium ${textPrimary}`}>
                  Phone number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 900000 or 07700900000"
                  className={inputClass}
                  disabled={loading}
                  autoComplete="tel"
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white ${currentTheme.accent} ${currentTheme.accentHover} flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send code"}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <label className={`block text-sm font-medium ${textPrimary}`}>
                  Enter 6-digit code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className={inputClass}
                  disabled={loading}
                  autoComplete="one-time-code"
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white ${currentTheme.accent} ${currentTheme.accentHover} flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep("phone"); setError(""); }}
                  className={`w-full py-2 text-sm ${textMuted} hover:underline`}
                >
                  Use a different number
                </button>
              </form>
            )}
            <p className="mt-6 text-center">
              <Link
                href="/theoperator/admin"
                className={`inline-flex items-center gap-1.5 text-sm ${textMuted} hover:underline`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
