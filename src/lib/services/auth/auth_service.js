import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  updatePassword,
  signOut,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";

import { auth, db, googleProvider } from "@/lib/firebase/client";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { createUser } from "@/lib/services/firestore/users_firestore_service.js";
import { fetchWithAuth } from "@/app/api/auth/fetch_with_auth";

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  // return signInWithPopup(auth, googleProvider);
  const cred = await signInWithPopup(auth, googleProvider);

  // Google sign-in can be a brand-new user too — check before creating
  const userRef = doc(db, "users", cred.user.uid);
  const existing = await getDoc(userRef);

  if (!existing.exists()) {
    await createUser(cred.user.uid, cred.user.email);
  }

  return cred.user;
}

// const ALLOWED_DOMAIN = "yourcompany.com"; // adjust
// export async function loginWithGoogle() {
//   const result = await signInWithPopup(auth, googleProvider);
//   const email = result.user.email || "";

//   if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
//     await signOut(auth);
//     throw new Error(`Only @${ALLOWED_DOMAIN} accounts are allowed.`);
//   }

//   return result;
// }

export async function logout() {
  return signOut(auth);
}

export async function register(email, password) {
  // return createUserWithEmailAndPassword(auth, email, password);
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUser(cred.user.uid, cred.user.email);
  return cred.user;
}

// --- Forgot password (unauthenticated) ---

export async function resetPassword(email) {
  const actionCodeSettings = {
    url: `${window.location.origin}/views/reset_password`,
    handleCodeInApp: true,
  };
  await sendPasswordResetEmail(auth, email, actionCodeSettings);
}

export async function confirmResetPassword(oobCode, password) {
  return confirmPasswordReset(auth, oobCode, password);
}

export async function verifyResetCode(oobCode) {
  return verifyPasswordResetCode(auth, oobCode);
}

export async function checkSignInMethod(email) {
  return fetchSignInMethodsForEmail(auth, email);
}

// --- Change password (authenticated, settings page) ---
export async function changePassword(oldPassword, newPassword) {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user.");

  if (getAuthProvider(user) !== "password") {
    throw new Error("This account does not use a password.");
  }

  if (!user.email) {
    throw new Error("User has no email.");
  }

  const credential = EmailAuthProvider.credential(user.email, oldPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

// --- Provider detection ---
export function getAuthProvider(user = auth.currentUser) {
  if (!user || !user.providerData.length) return null;
  return user.providerData[0].providerId;
}

export async function deleteAccount(password = null) {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user.");

  const provider = getAuthProvider(user);

  if (provider === "password") {
    if (!password) throw new Error("Password required to confirm deletion.");

    const credential = EmailAuthProvider.credential(user.email, password);

    await reauthenticateWithCredential(user, credential);
  } else if (provider === "google.com") {
    await reauthenticateWithPopup(user, googleProvider);
  }

  const token = await user.getIdToken();

  const res = await fetchWithAuth(`/api/users/${user.uid}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete account.");
  }

  return res.json();
}
