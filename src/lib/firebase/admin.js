import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import serviceAccountKey from "../../../serviceAccountKey.json";

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(serviceAccountKey),
    });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
