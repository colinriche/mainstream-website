"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import {
  themes,
  getStoredTheme,
  getStoredDarkMode,
  DEFAULT_GUEST_THEME,
  DEFAULT_GUEST_DARK_MODE,
} from "@/lib/siteThemes";

export default function TheOperatorPage() {
  const [theme, setTheme] = useState(DEFAULT_GUEST_THEME);
  const [darkMode, setDarkMode] = useState(DEFAULT_GUEST_DARK_MODE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getStoredTheme());
    setDarkMode(getStoredDarkMode());
    setMounted(true);
  }, []);

  const currentTheme = themes[theme];
  const bgGradient = darkMode ? currentTheme.dark : currentTheme.light;
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textMuted = (theme === "black" && darkMode) ? "text-yellow-300" : (darkMode ? "text-gray-400" : "text-gray-600");
  const textBody = darkMode ? "text-gray-300" : "text-gray-700";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";
  const linkHover = darkMode ? "hover:text-white" : "hover:text-gray-900";

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 ${textMuted} ${linkHover} mb-10 transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mainstream Movement
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${currentTheme.accent} text-white`}>
                <Phone className="w-8 h-8" />
              </div>
              <h1 className={`text-3xl sm:text-4xl font-bold ${textPrimary}`}>
                The Operator Calling App
              </h1>
            </div>
          </header>

          <article className={`space-y-6 ${textBody} leading-relaxed`}>
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

          <div className="mt-10 text-center">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${currentTheme.accent} ${currentTheme.accentHover} text-white transition-colors font-medium`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Mainstream Movement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
