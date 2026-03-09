 "use client";

 /**
  * Operator group management (Group Admins).
  * Uses the Operator Firebase project via getOperatorDb().
  * One primary group per admin: document at groups/{ownerId}.
  */

 import {
   doc,
   getDoc,
   onSnapshot,
   setDoc,
   serverTimestamp,
 } from "firebase/firestore";
 import { getOperatorDb } from "./firebaseOperator";

 const GROUPS_COLLECTION = "groups";

 function groupRef(ownerId) {
   const db = getOperatorDb();
   if (!db) throw new Error("Operator DB not available");
   return doc(db, GROUPS_COLLECTION, ownerId);
 }

 export async function getGroup(ownerId) {
   const snap = await getDoc(groupRef(ownerId));
   return snap.exists() ? { id: snap.id, ...snap.data() } : null;
 }

 export function subscribeGroup(ownerId, callback) {
   return onSnapshot(
     groupRef(ownerId),
     (snap) => {
       callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
     },
     (err) => {
       console.error("Operator group subscription error:", err);
       callback(null);
     }
   );
 }

 export async function upsertGroup(ownerId, data) {
   const ref = groupRef(ownerId);
   const payload = {
     title: data.title ?? "",
     description: data.description ?? "",
     ageGroup: data.ageGroup ?? "",
     location: data.location ?? "",
     company: data.company ?? "",
     sport: data.sport ?? "",
     affiliation: data.affiliation ?? "",
     brandPrimaryColor: data.brandPrimaryColor ?? "",
     brandSecondaryColor: data.brandSecondaryColor ?? "",
     brandLogoUrl: data.brandLogoUrl ?? "",
     brandBannerUrl: data.brandBannerUrl ?? "",
     ownerId,
     updatedAt: serverTimestamp(),
   };
   await setDoc(
     ref,
     {
       ...payload,
       createdAt: data.createdAt || serverTimestamp(),
     },
     { merge: true }
   );
 }

