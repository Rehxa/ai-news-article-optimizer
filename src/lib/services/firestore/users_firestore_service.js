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
 * Firestore—Firebase Auth handles it
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
