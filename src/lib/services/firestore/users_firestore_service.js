/**
 * Users Service
 * Firestore CRUD operations for users
 */

import {
  collection,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client.js";
import { User } from "../../models/user.js";

const USERS_COLLECTION = "users";

/**
 * Get a user by ID
 */
export async function getUserById(userId) {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`User ${userId} not found`);
    }

    const data = docSnap.data();
    const user = new User({
      id: docSnap.id,
      email: data.email,
      password: null, // Never fetch password from Firestore
      createdAt: data.createdAt?.toDate() || new Date(),
      toneOfVoice: data.toneOfVoice,
    });

    return user;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
}

/**
 * Create a new user
 * Note: Password is NOT stored in Firestore—Firebase Auth handles it
 */
export async function createUser(userId, email) {
  try {
    const userData = {
      email,
      createdAt: Timestamp.fromDate(new Date()),
      toneOfVoice: "professional",
    };

    const docRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(docRef, userData);

    return userId;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Update a user's tone of voice
 */
export async function updateUserToneOfVoice(userId, toneOfVoice) {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, { toneOfVoice });
  } catch (error) {
    console.error(`Error updating tone of voice for user ${userId}:`, error);
    throw error;
  }
}

// /**
//  * Deletes a user's Firestore data: their articles + their user doc.
//  */
// export async function deleteUserData(uid) {
//   const batch = adminDb.batch();

//   // 1. Find all articles owned by this user
//   const articlesSnap = await adminDb
//     .collection("articles")
//     .where("createdBy", "==", uid)
//     .get();

//   articlesSnap.forEach((doc) => {
//     batch.delete(doc.ref);
//   });

//   // 2. Delete the user doc itself
//   const userRef = adminDb.collection("users").doc(uid);
//   batch.delete(userRef);

//   await batch.commit();

//   return { deletedArticles: articlesSnap.size };
// }
