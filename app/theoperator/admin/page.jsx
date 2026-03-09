"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Loader2 } from "lucide-react";
import {
  themes,
  getStoredTheme,
  getStoredDarkMode,
  DEFAULT_GUEST_THEME,
  DEFAULT_GUEST_DARK_MODE,
} from "@/lib/siteThemes";
import { operatorAuth } from "@/lib/operatorAuth";
import { signInWithCustomToken, onAuthStateChanged } from "firebase/auth";

export default function OperatorAdminLoginPage() {
  const router = useRouter();
  const [theme, setTheme] = useState(DEFAULT_GUEST_THEME);
  const [darkMode, setDarkMode] = useState(DEFAULT_GUEST_DARK_MODE);
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTheme(getStoredTheme());
    setDarkMode(getStoredDarkMode());
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(operatorAuth, (user) => {
      if (user) router.replace("/theoperator/account");
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const u = username.trim();
    if (!u) {
      setError("Enter your username.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/operator-admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      if (!data.token) {
        setError("Invalid response.");
        setLoading(false);
        return;
      }
      await signInWithCustomToken(operatorAuth, data.token);
      router.replace("/theoperator/account");
    } catch (err) {
      setError(err.message || "Login failed.");
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
                <Shield className="w-6 h-6" />
              </div>
              <h1 className={`text-2xl font-bold ${textPrimary}`}>Admin login</h1>
            </div>
            <p className={`text-sm ${textMuted} mb-6`}>
              Sign in with your admin username. Your account must have admin role in the Operator app.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className={`block text-sm font-medium ${textPrimary}`}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your admin username"
                className={inputClass}
                disabled={loading}
                autoComplete="username"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold text-white ${currentTheme.accent} ${currentTheme.accentHover} flex items-center justify-center gap-2 disabled:opacity-50`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
