/**
 * Setting Service
 * Firestore CRUD operations for user setting
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Setting } from "@/lib/models/setting.js";

const SETTING_COLLECTION = "settings";

/**
 * Get setting for a user
 * If setting don't exist, create default ones
 */
export async function getSettingByUserId(userId) {
  try {
    const docRef = doc(db, SETTING_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Setting don't exist, create default ones
      await createDefaultSetting(userId);
      return new Setting({
        userId,
        toneOfVoice: "professional",
      });
    }

    const data = docSnap.data();
    const setting = new Setting({
      userId: data.userId,
      toneOfVoice: data.toneOfVoice,
    });

    return setting;
  } catch (error) {
    console.error(`Error fetching setting for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Create default setting for a new user
 */
export async function createDefaultSetting(userId) {
  try {
    const settingData = {
      userId,
      toneOfVoice: "professional",
      createdAt: Timestamp.fromDate(new Date()),
    };

    const docRef = doc(db, SETTING_COLLECTION, userId);
    await setDoc(docRef, settingData);
  } catch (error) {
    console.error(`Error creating default setting for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Update setting tone of voice
 */
export async function updateSettingToneOfVoice(userId, toneOfVoice) {
  try {
    const docRef = doc(db, SETTING_COLLECTION, userId);
    await updateDoc(docRef, {
      toneOfVoice,
    });
  } catch (error) {
    console.error(`Error updating tone of voice for user ${userId}:`, error);
    throw error;
  }
}
