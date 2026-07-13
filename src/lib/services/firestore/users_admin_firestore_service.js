/**
 * Deletes a user's Firestore data: their articles + their user doc.
 */

import { adminDb } from "@/lib/firebase/admin";

export async function deleteUserData(uid) {
  const batch = adminDb.batch();

  // 1. Find all articles owned by this user
  const articlesSnap = await adminDb
    .collection("articles")
    .where("userId", "==", uid)
    .get();

  articlesSnap.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // 2. Delete the user doc itself
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
