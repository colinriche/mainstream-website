"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Phone, LogIn, User, Shield, Users, Bell, CheckCircle, Loader2, FlaskConical } from "lucide-react";
import {
  themes,
  getStoredTheme,
  getStoredDarkMode,
  DEFAULT_GUEST_THEME,
  DEFAULT_GUEST_DARK_MODE,
} from "@/lib/siteThemes";
import { getOperatorAuth } from "@/lib/operatorAuth";
import { onAuthStateChanged } from "firebase/auth";

export default function TheOperatorPage() {
  const [theme, setTheme] = useState(DEFAULT_GUEST_THEME);
  const [darkMode, setDarkMode] = useState(DEFAULT_GUEST_DARK_MODE);
  const [mounted, setMounted] = useState(false);
  const [operatorUser, setOperatorUser] = useState(null);

  // Waitlist form state
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistPhone, setWaitlistPhone] = useState("");
  const [isTester, setIsTester] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState(null); // null | 'success' | 'already' | 'error'
  const [waitlistError, setWaitlistError] = useState("");

  function handleEmailChange(e) {
    const val = e.target.value;
    setWaitlistEmail(val);
    if (val.trim()) setShowOptional(true);
  }

  async function handleWaitlistSubmit(e) {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setWaitlistSubmitting(true);
    setWaitlistError("");
    try {
      const res = await fetch("/api/operator-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: waitlistEmail.trim(),
          name: waitlistName.trim(),
          phone: waitlistPhone.trim(),
          isTester,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWaitlistError(data.error || "Something went wrong. Please try again.");
        setWaitlistStatus("error");
      } else if (data.alreadyRegistered) {
        setWaitlistStatus("already");
      } else {
        setWaitlistStatus("success");
      }
    } catch {
      setWaitlistError("Network error. Please try again.");
      setWaitlistStatus("error");
    } finally {
      setWaitlistSubmitting(false);
    }
  }

  useEffect(() => {
    setTheme(getStoredTheme());
    setDarkMode(getStoredDarkMode());
    setMounted(true);
  }, []);

  useEffect(() => {
    const auth = getOperatorAuth();
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (user) => setOperatorUser(user));
    return () => unsub();
  }, []);

  const currentTheme = themes[theme];
  const bgGradient = darkMode ? currentTheme.dark : currentTheme.light;
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textMuted = (theme === "black" && darkMode) ? "text-yellow-300" : (darkMode ? "text-gray-400" : "text-gray-600");
  const textBody = darkMode ? "text-gray-300" : "text-gray-700";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";
  const linkHover = darkMode ? "hover:text-white" : "hover:text-gray-900";

  const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/60 transition ${
    darkMode
      ? "bg-gray-900 border-gray-600 text-white placeholder-gray-500"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
  }`;

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 ${textMuted} ${linkHover} mb-8 transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mainstream Movement
          </Link>

          {/* ── Top: title left / waitlist right ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 items-start">

            {/* Left — title + tagline */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${currentTheme.accent} text-white`}>
                  <Phone className="w-8 h-8" />
                </div>
                <h1 className={`text-3xl sm:text-4xl font-bold ${textPrimary}`}>
                  The Operator Calling App
                </h1>
              </div>
              <p className={`text-base ${textBody} leading-relaxed`}>
                A calling app that connects you with people you know — or don&apos;t — based on shared interests, groups, and availability. No phone numbers shared. No commitment to answer.
              </p>
              <p className={`mt-3 text-sm font-semibold ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                Coming soon — strengthening communities one to one.
              </p>
            </div>

            {/* Right — waitlist card */}
            <div className={`rounded-2xl border-2 ${
              darkMode ? "border-yellow-400/50 bg-yellow-400/5" : "border-yellow-500/50 bg-yellow-50"
            } p-5 sm:p-6`}>

            {waitlistStatus === "success" ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-7 h-7 text-green-500 flex-shrink-0" />
                  <p className={`text-lg font-bold ${textPrimary}`}>You&apos;re on the list!</p>
                </div>
                <p className={`pl-10 text-sm ${textBody}`}>
                  We&apos;ll notify you at <strong>{waitlistEmail}</strong> when The Operator goes live.
                  {isTester && " We've also noted your interest in being an early tester — thank you!"}
                </p>
              </div>
            ) : waitlistStatus === "already" ? (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-7 h-7 text-blue-500 flex-shrink-0" />
                <p className={`font-semibold ${textPrimary}`}>You&apos;re already on the waitlist — we&apos;ll be in touch!</p>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-1">
                  <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${darkMode ? "bg-yellow-400/20" : "bg-yellow-100"}`}>
                    <Bell className={`w-5 h-5 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>
                      Not live yet — be first to know
                    </h2>
                    <p className={`mt-1 text-sm ${textBody}`}>
                      Join the waitlist and we&apos;ll alert you the moment The Operator launches.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleWaitlistSubmit} className="mt-5 space-y-3">
                  {/* Email — always visible */}
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={waitlistEmail}
                      onChange={handleEmailChange}
                      placeholder="Your email address"
                      className={`${inputClass} flex-1`}
                    />
                    {!showOptional && (
                      <button
                        type="submit"
                        disabled={waitlistSubmitting || !waitlistEmail.trim()}
                        className={`flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          waitlistSubmitting || !waitlistEmail.trim()
                            ? "opacity-50 cursor-not-allowed bg-yellow-400/60 text-gray-900"
                            : "bg-yellow-400 hover:bg-yellow-300 text-gray-900 shadow"
                        }`}
                      >
                        {waitlistSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Notify me"}
                      </button>
                    )}
                  </div>

                  {/* Optional fields — revealed once email has a value */}
                  {showOptional && (
                    <div className="space-y-3">
                      <div className="space-y-3">
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${textMuted}`}>Name (optional)</label>
                          <input
                            type="text"
                            value={waitlistName}
                            onChange={(e) => setWaitlistName(e.target.value)}
                            placeholder="Your name"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${textMuted}`}>Phone (optional — for launch alert)</label>
                          <input
                            type="tel"
                            value={waitlistPhone}
                            onChange={(e) => setWaitlistPhone(e.target.value)}
                            placeholder="+44 7700 000000"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* Tester opt-in */}
                      <label className={`flex items-start gap-3 cursor-pointer rounded-xl border p-3 transition-colors ${
                        isTester
                          ? darkMode ? "border-yellow-400/60 bg-yellow-400/10" : "border-yellow-400 bg-yellow-50"
                          : darkMode ? "border-gray-700 hover:border-yellow-400/40" : "border-gray-200 hover:border-yellow-300"
                      }`}>
                        <input
                          type="checkbox"
                          checked={isTester}
                          onChange={(e) => setIsTester(e.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-yellow-400 flex-shrink-0"
                        />
                        <div>
                          <span className={`flex items-center gap-1.5 font-semibold text-sm ${textPrimary}`}>
                            <FlaskConical className="w-4 h-4 text-yellow-500" />
                            I want to be an early tester
                          </span>
                          <span className={`text-xs ${textBody}`}>
                            Help bring The Operator to market sooner. Early testers get hands-on access before the public launch and can shape the final product.
                          </span>
                        </div>
                      </label>

                      {waitlistStatus === "error" && (
                        <p className="text-red-500 text-sm">{waitlistError}</p>
                      )}

                      <button
                        type="submit"
                        disabled={waitlistSubmitting || !waitlistEmail.trim()}
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          waitlistSubmitting || !waitlistEmail.trim()
                            ? "opacity-50 cursor-not-allowed bg-yellow-400/60 text-gray-900"
                            : "bg-yellow-400 hover:bg-yellow-300 text-gray-900 shadow-md"
                        }`}
                      >
                        {waitlistSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Joining…
                          </>
                        ) : (
                          <>
                            <Bell className="w-4 h-4" />
                            {isTester ? "Join waitlist & apply to test" : "Notify me when it launches"}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
          {/* end grid */}
          </div>

          {/* ── Article ── */}
          <article className={`space-y-6 ${textBody} leading-relaxed`}>
            <figure className="md:float-right md:w-80 lg:w-96 md:ml-6 md:mb-4 mb-6">
              <div className="overflow-hidden rounded-2xl shadow-xl border border-white/10 bg-black/40">
                <Image
                  src="/assets/operator_switchboard.jpg"
                  alt="Representation of The Operator"
                  width={512}
                  height={341}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              <figcaption className="mt-2 text-[11px] uppercase tracking-wide text-gray-400 text-center">
                Representation of The Operator
              </figcaption>
            </figure>
            <p>
              When the phone rings you are put on hold while the Operator selects who to connect you with.
            </p>
            <p>
              The Operator will put you through to someone you know or someone you don&apos;t, depending on your selections.
              They may be a member of your interest groups, work related groups, a distant relation or someone just looking for a chat with someone about what&apos;s happening in the world. You won&apos;t know who you are matched with before you answer the call, finding out is all part of the fun—you will just know on what basis you are matched.
            </p>
            <p>
              Once you have created an account you can enter your interests, sports, hobbies etc. and then select the hours of the week when you are available and hours when you are not available. This is for people who like impromptu calls.
            </p>
            <p>
              For the most part calls are scheduled, which is what you select next.
            </p>
            <p>
              When a call arrives, there is no one waiting for you to answer so there is no commitment to take the call.
            </p>
            <p>
              Any sharing of your personal information with other users is completely with your permission and once given you can withdraw it at any time. For example you can allow another user to call you directly by adding them to your friends list; removing them from the list or disabling them removes the right to call you. This means there is no need to share phone numbers with others so your privacy is protected. You can even moderate calls with friends that call too often.
            </p>
            <p>
              The phone system also allows for call-backs so calls with friends are placed when both parties are available.
            </p>
          </article>

          <p className={`mt-12 pt-8 border-t ${borderClass} text-center text-lg font-semibold ${textPrimary}`}>
            The Operator App — strengthening communities one to one
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {operatorUser ? (
              <Link
                href="/theoperator/account"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${currentTheme.accent} ${currentTheme.accentHover} text-white transition-colors font-medium`}
              >
                <User className="w-5 h-5" />
                Manage your account
              </Link>
            ) : (
              <Link
                href="/theoperator/login"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${currentTheme.accent} ${currentTheme.accentHover} text-white transition-colors font-medium`}
              >
                <LogIn className="w-5 h-5" />
                Log in to sync with the app
              </Link>
            )}
            <Link
              href="/"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 ${currentTheme.border} ${textPrimary} ${currentTheme.accentHover} transition-colors font-medium`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Mainstream Movement
            </Link>
          </div>
          <div className="mt-6 text-center space-y-2 text-sm">
            <p>
              <Link
                href="/theoperator/admin"
                className={`inline-flex items-center gap-1.5 ${textMuted} hover:underline`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            </p>
            <p>
              <Link
                href="/theoperator/groups"
                className={`inline-flex items-center gap-1.5 ${textMuted} hover:underline`}
              >
                <Users className="w-4 h-4" />
                Group Admins
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
