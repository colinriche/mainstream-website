"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Calendar, BellOff, Loader2, LogOut } from "lucide-react";
import {
  themes,
  getStoredTheme,
  getStoredDarkMode,
  DEFAULT_GUEST_THEME,
  DEFAULT_GUEST_DARK_MODE,
} from "@/lib/siteThemes";
import { auth } from "@/lib/operatorAuth";
import { onAuthStateChanged } from "firebase/auth";
import {
  subscribeUserDoc,
  updateProfile,
  updateSchedule,
  updateDND,
  computeDndUntil,
  TIMEZONES,
  SCHEDULED_TIME_OPTIONS,
  DAYS,
  DND_OPTIONS,
} from "@/lib/operatorUser";

const defaultSchedule = () => {
  const impromptuAvailability = {};
  DAYS.forEach((d) => { impromptuAvailability[d] = { windows: [] }; });
  return { timezone: "UTC+00:00 (London)", scheduledSlots: [], impromptuAvailability };
};

export default function OperatorAccountPage() {
  const router = useRouter();
  const [theme, setTheme] = useState(DEFAULT_GUEST_THEME);
  const [darkMode, setDarkMode] = useState(DEFAULT_GUEST_DARK_MODE);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [profile, setProfile] = useState({ name: "", bio: "", interests: [] });
  const [schedule, setSchedule] = useState(defaultSchedule());
  const [dndOption, setDndOption] = useState("online");
  const [interestsInput, setInterestsInput] = useState("");

  useEffect(() => {
    setTheme(getStoredTheme());
    setDarkMode(getStoredDarkMode());
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) router.replace("/theoperator/login");
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeUserDoc(user.uid, (data) => {
      setUserDoc(data);
      if (data) {
        setProfile({
          name: data.name ?? "",
          bio: data.bio ?? "",
          interests: Array.isArray(data.interests) ? data.interests : [],
        });
        setInterestsInput((Array.isArray(data.interests) ? data.interests : []).join(", "));
        const s = data.schedule;
        if (s) {
          setSchedule({
            timezone: s.timezone ?? "UTC+00:00 (London)",
            scheduledSlots: Array.isArray(s.scheduledSlots) ? s.scheduledSlots : [],
            impromptuAvailability: s.impromptuAvailability ?? defaultSchedule().impromptuAvailability,
          });
        }
        setDndOption(data.dndOption ?? "online");
      }
    });
    return () => unsub();
  }, [user?.uid]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    setSaveError("");
    try {
      const interests = interestsInput.split(",").map((s) => s.trim()).filter(Boolean);
      await updateProfile(user.uid, { ...profile, interests });
    } catch (err) {
      setSaveError(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    setSaveError("");
    try {
      await updateSchedule(user.uid, schedule);
    } catch (err) {
      setSaveError(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDND = async (option) => {
    if (!user?.uid) return;
    setSaving(true);
    setSaveError("");
    try {
      const { dndUntil, dndOption: opt } = computeDndUntil(option);
      await updateDND(user.uid, dndUntil, opt);
      setDndOption(opt);
    } catch (err) {
      setSaveError(err.message || "Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  const addScheduledSlot = () => {
    setSchedule((s) => ({
      ...s,
      scheduledSlots: [...(s.scheduledSlots || []), { day: "Monday", time: "09:00" }],
    }));
  };

  const updateScheduledSlot = (index, field, value) => {
    setSchedule((s) => {
      const slots = [...(s.scheduledSlots || [])];
      slots[index] = { ...slots[index], [field]: value };
      return { ...s, scheduledSlots: slots };
    });
  };

  const removeScheduledSlot = (index) => {
    setSchedule((s) => ({
      ...s,
      scheduledSlots: (s.scheduledSlots || []).filter((_, i) => i !== index),
    }));
  };

  const addImpromptuWindow = (day) => {
    setSchedule((s) => {
      const imp = { ...(s.impromptuAvailability || {}), [day]: { windows: [...((s.impromptuAvailability || {})[day]?.windows || []), { start: "09:00", end: "17:00" }] } };
      return { ...s, impromptuAvailability: imp };
    });
  };

  const updateImpromptuWindow = (day, windowIndex, field, value) => {
    setSchedule((s) => {
      const imp = { ...(s.impromptuAvailability || {}) };
      if (!imp[day]) imp[day] = { windows: [] };
      const w = [...imp[day].windows];
      w[windowIndex] = { ...w[windowIndex], [field]: value };
      imp[day] = { windows: w };
      return { ...s, impromptuAvailability: imp };
    });
  };

  const removeImpromptuWindow = (day, windowIndex) => {
    setSchedule((s) => {
      const imp = { ...(s.impromptuAvailability || {}) };
      if (!imp[day]) return s;
      imp[day] = { windows: imp[day].windows.filter((_, i) => i !== windowIndex) };
      return { ...s, impromptuAvailability: imp };
    });
  };

  const currentTheme = themes[theme];
  const bgGradient = darkMode ? currentTheme.dark : currentTheme.light;
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textMuted = (theme === "black" && darkMode) ? "text-yellow-300" : (darkMode ? "text-gray-400" : "text-gray-600");
  const cardBg = darkMode ? "bg-gray-800/90" : "bg-white/95";
  const inputClass = `w-full px-4 py-2 rounded-lg border-2 ${darkMode ? "bg-gray-900 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 ${currentTheme.border}`;
  const tabClass = (active) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${active ? `${currentTheme.accent} text-white` : textMuted}`;

  const handleSignOut = async () => {
    const { signOut } = await import("@/lib/operatorAuth");
    await signOut();
    router.replace("/theoperator/login");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen dark bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-yellow-400/60 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "dark" : ""}`}>
      <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-colors duration-500 pb-20`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/theoperator"
              className={`inline-flex items-center gap-2 ${textMuted} hover:opacity-90`}
            >
              <ArrowLeft className="w-4 h-4" />
              The Operator
            </Link>
            <button
              onClick={handleSignOut}
              className={`inline-flex items-center gap-2 ${textMuted} hover:opacity-90`}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>

          <h1 className={`text-2xl font-bold ${textPrimary} mb-4`}>Manage your account</h1>
          <p className={`text-sm ${textMuted} mb-6`}>
            Changes here sync with The Operator app. Edits on the app appear here in real time.
          </p>

          <div className="flex gap-2 mb-6 flex-wrap">
            {["profile", "schedule", "dnd"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={tabClass(activeTab === tab)}
              >
                {tab === "profile" && <User className="w-4 h-4 inline mr-1" />}
                {tab === "schedule" && <Calendar className="w-4 h-4 inline mr-1" />}
                {tab === "dnd" && <BellOff className="w-4 h-4 inline mr-1" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {saveError && <p className="text-red-400 text-sm mb-4">{saveError}</p>}

          {activeTab === "profile" && (
            <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
              <h2 className={`text-lg font-semibold ${textPrimary} mb-4`}>Profile</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <label className={`block text-sm font-medium ${textPrimary}`}>Display name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className={inputClass}
                />
                <label className={`block text-sm font-medium ${textPrimary}`}>Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className={inputClass}
                />
                <label className={`block text-sm font-medium ${textPrimary}`}>Interests (comma-separated)</label>
                <input
                  type="text"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  placeholder="Reading, Walking, Sport"
                  className={inputClass}
                />
                <button
                  type="submit"
                  disabled={saving}
                  className={`py-2 px-4 rounded-lg font-semibold text-white ${currentTheme.accent} ${currentTheme.accentHover} flex items-center gap-2 disabled:opacity-50`}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save profile"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
              <h2 className={`text-lg font-semibold ${textPrimary} mb-4`}>Schedule</h2>
              <form onSubmit={handleSaveSchedule} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Timezone</label>
                  <select
                    value={schedule.timezone}
                    onChange={(e) => setSchedule((s) => ({ ...s, timezone: e.target.value }))}
                    className={inputClass}
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`text-sm font-medium ${textPrimary}`}>Scheduled call times</label>
                    <button type="button" onClick={addScheduledSlot} className={`text-sm ${currentTheme.text}`}>
                      + Add slot
                    </button>
                  </div>
                  {(schedule.scheduledSlots || []).map((slot, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <select
                        value={slot.day}
                        onChange={(e) => updateScheduledSlot(i, "day", e.target.value)}
                        className={`flex-1 ${inputClass}`}
                      >
                        {DAYS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <select
                        value={slot.time}
                        onChange={(e) => updateScheduledSlot(i, "time", e.target.value)}
                        className={`flex-1 ${inputClass}`}
                      >
                        {SCHEDULED_TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => removeScheduledSlot(i)} className={`${textMuted} hover:text-red-400`}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Impromptu availability (per day)</label>
                  {DAYS.map((day) => (
                    <div key={day} className="mb-3">
                      <span className={`text-sm ${textMuted}`}>{day}</span>
                      <button type="button" onClick={() => addImpromptuWindow(day)} className={`ml-2 text-xs ${currentTheme.text}`}>+ window</button>
                      {(schedule.impromptuAvailability?.[day]?.windows || []).map((win, wi) => (
                        <div key={wi} className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={win.start}
                            onChange={(e) => updateImpromptuWindow(day, wi, "start", e.target.value)}
                            placeholder="09:00"
                            className={`w-20 ${inputClass}`}
                          />
                          <span className={textMuted}>–</span>
                          <input
                            type="text"
                            value={win.end}
                            onChange={(e) => updateImpromptuWindow(day, wi, "end", e.target.value)}
                            placeholder="17:00"
                            className={`w-20 ${inputClass}`}
                          />
                          <button type="button" onClick={() => removeImpromptuWindow(day, wi)} className={textMuted}>Remove</button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className={`py-2 px-4 rounded-lg font-semibold text-white ${currentTheme.accent} ${currentTheme.accentHover} flex items-center gap-2 disabled:opacity-50`}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save schedule"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "dnd" && (
            <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
              <h2 className={`text-lg font-semibold ${textPrimary} mb-2`}>Do Not Disturb</h2>
              <p className={`text-sm ${textMuted} mb-4`}>
                When you&apos;re in DND, you won&apos;t receive impromptu or scheduled calls until it ends.
              </p>
              <div className="space-y-2">
                {DND_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSetDND(opt.value)}
                    disabled={saving}
                    className={`w-full py-3 px-4 rounded-lg text-left font-medium transition-colors ${
                      dndOption === opt.value
                        ? `${currentTheme.accent} text-white`
                        : darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {dndOption === opt.value && "✓ "}{opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
