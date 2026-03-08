# Web App: Credentials and Schemas for Profile, Schedule & DND

This document describes what you need to build an independent website where users can log in and edit the **same** profile, schedule, and Do Not Disturb (DND) data that the Operator mobile app uses. Changes on the website and in the app stay in sync because both read and write the same Firebase Firestore data.

---

## 1. Credentials and Firebase Setup

### 1.1 Firebase project

The app uses a single Firebase project. Use the **same project** for the website so both share the same `user` collection and auth.

- **Project ID** (from the app): `webrtc-clone-dc88c`
- **Web config** is in `lib/firebase_options.dart` under `FirebaseOptions web`. Use that for the Web SDK, or copy the config from Firebase Console → Project settings → Your apps → Web app.

### 1.2 Firebase Web SDK config (for your website)

Initialise the JavaScript SDK with the same web app config. The shape is:

```js
const firebaseConfig = {
  apiKey: "<WEB_API_KEY>",
  authDomain: "<PROJECT_ID>.firebaseapp.com",
  projectId: "webrtc-clone-dc88c",
  storageBucket: "webrtc-clone-dc88c.firebasestorage.app",
  messagingSenderId: "814468863288",
  appId: "<WEB_APP_ID>"
};
```

Values are in `lib/firebase_options.dart` (property `DefaultFirebaseOptions.web`). In Firebase Console, add your website’s domain to **Authorized domains** (Authentication → Settings). Optionally restrict the **Web API key** to that domain (Google Cloud Console → APIs & Services → Credentials).

### 1.3 Authentication (how users log in)

The app supports two login flows; the website should use at least one that matches how your users are created.

| Method | How it works | User document ID |
|--------|----------------|------------------|
| **Phone (OTP)** | Firebase Auth `signInWithPhoneNumber` / `signInWithCredential` with `PhoneAuthProvider.credential`. | Firebase Auth **UID** = Firestore `user` document ID. |
| **Username** | No Firebase Auth. Look up `user` where `username` equals the typed value. | Use that document’s **ID** as `userId`. (App does not use a password for this path.) |

- For **phone**: enable **Phone** in Firebase Console → Authentication → Sign-in method. On the web you’ll use RecaptchaVerifier and `signInWithPhoneNumber`. After sign-in, `auth.currentUser.uid` is the `userId` (and the `user` doc id).
- For **username**: run a Firestore query `collection('user').where('username', '==', username)` and take the first document’s `id` as `userId`. You will need Firestore rules that allow this query (e.g. allow read on `user` for the query you use, or use a backend/Callable to resolve username → uid).

Use the same `userId` (Firestore document ID) for all reads and writes below so the website and app share the same profile, schedule, and DND state.

---

## 2. Firestore collection and document

- **Collection:** `user`
- **Document ID:** `userId` (Firebase Auth UID for phone sign-in, or the document ID from username lookup).

All profile, schedule, and DND fields live in this single document:  
`user/{userId}`

---

## 3. User document schema (profile, schedule, DND)

These are the fields the app reads and writes for profile, schedule, and DND. Your website should read/write the same structure so both stay in sync.

### 3.1 Profile (from Profile page)

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name. |
| `bio` | string | Short bio. |
| `interests` | array of strings | List of interest tags (e.g. `["Reading", "Walking"]`). |

**Write:** Use Firestore `update()` with `name`, `bio`, `interests`. The app also sets `updatedAt: serverTimestamp()` when saving profile.

**Optional (app uses these elsewhere):** `username`, `imageUrl`, `phoneNumber`, `fcmToken`, `contactIds`, `favouriteIds`, `contactGroups`, `preferFavouritesHome`, `role`, `report_count`, `flagged`, `banned`, `ignoredIds`. Only change these if your web UI is designed to edit them; otherwise leave them as-is.

### 3.2 Schedule (from Schedule page)

Stored under a single **`schedule`** map on the user document.

| Field | Type | Description |
|-------|------|-------------|
| `schedule` | map | See structure below. |
| `updatedAt` | timestamp | Set to `serverTimestamp()` when saving. |

**`schedule` map structure:**

| Key | Type | Description |
|-----|------|-------------|
| `timezone` | string | One of the app’s timezone strings (see list below). |
| `scheduledSlots` | array of maps | Fixed “call at this time” slots. |
| `impromptuAvailability` | map | Per-day “available in these windows”. |

**`schedule.scheduledSlots`**  
Array of:

- `day`: string — one of `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`
- `time`: string — time in 24h `"HH:mm"`, e.g. `"09:00"`, `"14:30"`

Allowed times (same as app):  
`06:00` … `23:30` in 30-minute steps (e.g. `06:00`, `06:30`, `07:00`, …).

**`schedule.impromptuAvailability`**  
Map: **day name →** object with key **`windows`** (array of time windows).

- **Day names:** `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`
- Each **window**: `{ "start": "HH:mm", "end": "HH:mm" }` (e.g. `{ "start": "09:00", "end": "17:00" }`)

**Timezone strings (use exactly one):**

```
UTC-12:00 (Baker Island)
UTC-11:00 (Samoa)
UTC-10:00 (Hawaii)
UTC-09:00 (Alaska)
UTC-08:00 (Pacific)
UTC-07:00 (Mountain)
UTC-06:00 (Central)
UTC-05:00 (Eastern)
UTC-04:00 (Atlantic)
UTC-03:00 (Buenos Aires)
UTC-02:00 (Mid-Atlantic)
UTC-01:00 (Azores)
UTC+00:00 (London)
UTC+01:00 (Paris)
UTC+02:00 (Cairo)
UTC+03:00 (Moscow)
UTC+04:00 (Dubai)
UTC+05:00 (Karachi)
UTC+05:30 (Mumbai)
UTC+06:00 (Dhaka)
UTC+07:00 (Bangkok)
UTC+08:00 (Singapore)
UTC+09:00 (Tokyo)
UTC+10:00 (Sydney)
UTC+11:00 (Solomon Islands)
UTC+12:00 (Fiji)
```

**Example `schedule` object:**

```json
{
  "timezone": "UTC+00:00 (London)",
  "scheduledSlots": [
    { "day": "Monday", "time": "09:00" },
    { "day": "Wednesday", "time": "14:00" }
  ],
  "impromptuAvailability": {
    "Monday": { "windows": [{ "start": "09:00", "end": "12:00" }, { "start": "14:00", "end": "17:00" }] },
    "Tuesday": { "windows": [] }
  }
}
```

When saving from the web, write the whole `schedule` map and set `updatedAt` to server timestamp so the app sees the same structure.

### 3.3 Do Not Disturb / DND (from menu drawer)

DND is stored on the **same** `user/{userId}` document.

| Field | Type | Description |
|-------|------|-------------|
| `dndUntil` | Firestore Timestamp or null | When DND ends. `null` = not in DND (online). |
| `dndOption` | string or null | Which option was selected; used for UI. |

**DND option values (enum `dndOption`):**

| Value | Meaning |
|-------|--------|
| `online` | Not in DND. Set `dndUntil` to `null` and `dndOption` to `"online"`. |
| `oneHour` | DND for 1 hour from now. |
| `twoHours` | DND for 2 hours from now. |
| `threeHours` | DND for 3 hours from now. |
| `allDay` | DND until end of today (23:59:59 local). |

**Behaviour:**

- **Online:** `dndUntil = null`, `dndOption = "online"`.
- **1 / 2 / 3 hours:** set `dndUntil` to `now + 1/2/3` hours (server or client time), and `dndOption` to `"oneHour"` / `"twoHours"` / `"threeHours"`.
- **All day:** set `dndUntil` to end of current calendar day (e.g. 23:59:59), `dndOption` to `"allDay"`.

The app treats the user as “in DND” when `dndUntil` is set and `dndUntil > now`. Your website should use the same rule so behaviour matches.

---

## 4. How to keep website and app in sync

- **Single source of truth:** Firestore document `user/{userId}`.
- **Writes:** Both app and website use Firestore `update()` on `user/{userId}` for profile, schedule, and DND. Always set `updatedAt: serverTimestamp()` when updating profile or schedule.
- **Reads:** Use Firestore **real-time listeners** (`onSnapshot` on the web) on `user/{userId}` so that when either the app or the website updates the document, the other sees changes immediately. If you only poll or read once, you can still sync, but listeners give instant sync and a better UX.

No extra “sync layer” is required; sharing the same Firebase project and the same document does the job.

---

## 5. Firestore security rules (minimal for web)

Ensure your rules allow the signed-in user to read and update their own document. Example (adjust to your auth method):

- **Phone Auth:** `request.auth != null && request.auth.uid == userId` for `user/{userId}`.
- **Username-only (no Auth):** You typically need a backend or Callable that checks credentials and returns a custom token or that performs the update, so the web client still uses Firebase Auth with a token tied to that `userId`. Otherwise, if the web has no Auth, you must not expose direct write access to `user` in rules.

Example for **authenticated** access (e.g. phone or custom token where `auth.uid == userId`):

```
match /user/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

## 6. Summary checklist for the website

1. Use the **same Firebase project** and **Web SDK config** (from `lib/firebase_options.dart` or Console).
2. Implement **login** (phone OTP and/or username lookup) so you have a **userId** (Firestore `user` document ID).
3. **Read** `user/{userId}` for profile (`name`, `bio`, `interests`), `schedule`, and DND (`dndUntil`, `dndOption`).
4. **Write** with the same field names and types (profile, full `schedule` object, DND fields).
5. Use **onSnapshot** on `user/{userId}` so edits on the app or website appear on both.
6. Set **`updatedAt`** to server timestamp when updating profile or schedule.

This gives you a web app that edits the same user data as the Operator app with profile, schedule, and DND staying in sync on both.
