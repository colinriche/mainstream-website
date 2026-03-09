"use client";

/**
 * Operator user document (Firestore): profile, schedule, DND.
 * Matches WEB_APP_CREDENTIALS_AND_SCHEMAS.md. Same data as mobile app.
 */

import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { operatorDb } from "./firebaseOperator";

const COLLECTION = "user";

/** Timezone strings (use exactly one). */
export const TIMEZONES = [
  "UTC-12:00 (Baker Island)",
  "UTC-11:00 (Samoa)",
  "UTC-10:00 (Hawaii)",
  "UTC-09:00 (Alaska)",
  "UTC-08:00 (Pacific)",
  "UTC-07:00 (Mountain)",
  "UTC-06:00 (Central)",
  "UTC-05:00 (Eastern)",
  "UTC-04:00 (Atlantic)",
  "UTC-03:00 (Buenos Aires)",
  "UTC-02:00 (Mid-Atlantic)",
  "UTC-01:00 (Azores)",
  "UTC+00:00 (London)",
  "UTC+01:00 (Paris)",
  "UTC+02:00 (Cairo)",
  "UTC+03:00 (Moscow)",
  "UTC+04:00 (Dubai)",
  "UTC+05:00 (Karachi)",
  "UTC+05:30 (Mumbai)",
  "UTC+06:00 (Dhaka)",
  "UTC+07:00 (Bangkok)",
  "UTC+08:00 (Singapore)",
  "UTC+09:00 (Tokyo)",
  "UTC+10:00 (Sydney)",
  "UTC+11:00 (Solomon Islands)",
  "UTC+12:00 (Fiji)",
];

/** Allowed scheduled times: 06:00–23:30 in 30-min steps. */
export const SCHEDULED_TIME_OPTIONS = (() => {
  const out = [];
  for (let h = 6; h <= 23; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 23) out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
})();

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** DND option values. */
export const DND_OPTIONS = [
  { value: "online", label: "Online (not in DND)" },
  { value: "oneHour", label: "1 hour" },
  { value: "twoHours", label: "2 hours" },
  { value: "threeHours", label: "3 hours" },
  { value: "allDay", label: "All day (until end of today)" },
];

function userRef(userId) {
  return doc(operatorDb, COLLECTION, userId);
}

/**
 * Get user document once.
 */
export async function getUserDoc(userId) {
  const snap = await getDoc(userRef(userId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Subscribe to user document for real-time sync with app.
 * @param {string} userId
 * @param {(data: object | null) => void} callback
 * @returns {() => void} unsubscribe
 */
export function subscribeUserDoc(userId, callback) {
  return onSnapshot(
    userRef(userId),
    (snap) => {
      callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    },
    (err) => {
      console.error("Operator user subscription error:", err);
      callback(null);
    }
  );
}

/**
 * Update profile (name, bio, interests). Sets updatedAt to server timestamp.
 */
export async function updateProfile(userId, { name, bio, interests }) {
  const ref = userRef(userId);
  const data = {
    name: name ?? "",
    bio: bio ?? "",
    interests: Array.isArray(interests) ? interests : [],
    updatedAt: serverTimestamp(),
  };
  await updateDoc(ref, data);
}

/**
 * Update schedule. Writes full schedule map and updatedAt.
 * @param {string} userId
 * @param {object} schedule - { timezone, scheduledSlots[], impromptuAvailability{} }
 */
export async function updateSchedule(userId, schedule) {
  const ref = userRef(userId);
  await updateDoc(ref, {
    schedule: normalizeSchedule(schedule),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Compute dndUntil from dndOption (for use with updateDND).
 * Returns { dndUntil: Timestamp | null, dndOption: string }.
 */
export function computeDndUntil(dndOption) {
  if (!dndOption || dndOption === "online")
    return { dndUntil: null, dndOption: "online" };
  const now = new Date();
  let end;
  if (dndOption === "oneHour") end = new Date(now.getTime() + 60 * 60 * 1000);
  else if (dndOption === "twoHours") end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  else if (dndOption === "threeHours") end = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  else if (dndOption === "allDay") {
    end = new Date(now);
    end.setHours(23, 59, 59, 999);
  } else return { dndUntil: null, dndOption: "online" };
  return { dndUntil: Timestamp.fromDate(end), dndOption };
}

/**
 * Update DND. dndUntil: Timestamp or null; dndOption: string.
 */
export async function updateDND(userId, dndUntil, dndOption) {
  const ref = userRef(userId);
  await updateDoc(ref, { dndUntil, dndOption });
}

/**
 * Ensure user document exists (e.g. first login from web). Merges so app fields are not overwritten.
 */
export async function ensureUserDoc(userId, defaults = {}) {
  const ref = userRef(userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(
      ref,
      {
        name: defaults.name ?? "",
        bio: defaults.bio ?? "",
        interests: defaults.interests ?? [],
        schedule: defaults.schedule ?? getDefaultSchedule(),
        dndUntil: null,
        dndOption: "online",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}

function getDefaultSchedule() {
  const impromptuAvailability = {};
  DAYS.forEach((day) => {
    impromptuAvailability[day] = { windows: [] };
  });
  return {
    timezone: "UTC+00:00 (London)",
    scheduledSlots: [],
    impromptuAvailability,
  };
}

function normalizeSchedule(schedule) {
  const timezone = schedule?.timezone ?? "UTC+00:00 (London)";
  const scheduledSlots = Array.isArray(schedule?.scheduledSlots)
    ? schedule.scheduledSlots.filter(
        (s) => s?.day && s?.time && DAYS.includes(s.day)
      )
    : [];
  const impromptuAvailability = { ...(schedule?.impromptuAvailability ?? {}) };
  DAYS.forEach((day) => {
    if (!impromptuAvailability[day])
      impromptuAvailability[day] = { windows: [] };
    if (!Array.isArray(impromptuAvailability[day].windows))
      impromptuAvailability[day].windows = [];
  });
  return { timezone, scheduledSlots, impromptuAvailability };
}
