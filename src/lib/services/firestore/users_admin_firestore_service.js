/**
 * Admin-privileged Firestore operations for users.
 * Uses Admin SDK — bypasses security rules, server-only.
 */

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Get a user doc by uid. Returns null if it doesn't exist
 * (used for existence checks, e.g. post-verification provisioning).
 */
export async function getUserByIdAdmin(uid) {
  const snap = await adminDb.collection("users").doc(uid).get();
  return snap.exists ? snap.data() : null;
}

/**
 * Create a user doc. Called once, after email verification,
 * from verifyFirebaseToken middleware on first authenticated request.
 */
export async function createUserAdmin(uid, { email }) {
  const userData = {
    email,
    createdAt: FieldValue.serverTimestamp(),
    toneOfVoice: "professional",
  };

  await adminDb.collection("users").doc(uid).set(userData);

  return uid;
}

/**
 * Deletes a user's Firestore data: their articles + their user doc.
 */
export async function deleteUserData(uid) {
  const batch = adminDb.batch();

  const articlesSnap = await adminDb
    .collection("articles")
    .where("userId", "==", uid)
    .get();

  articlesSnap.forEach((doc) => {
    batch.delete(doc.ref);
  });

  const userRef = adminDb.collection("users").doc(uid);
  batch.delete(userRef);

  await batch.commit();

  return { deletedArticles: articlesSnap.size };
}

export async function clearUserArticles(uid) {
  const batch = adminDb.batch();

  const articlesSnap = await adminDb
    .collection("articles")
    .where("userId", "==", uid)
    .get();

  articlesSnap.forEach((doc) => batch.delete(doc.ref));

  await batch.commit();

  return { deletedArticles: articlesSnap.size };
}
