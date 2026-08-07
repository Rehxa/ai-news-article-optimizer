import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  EmailAuthProvider,
  linkWithCredential,
  reauthenticateWithCredential,
  updatePassword,
  signOut,
  verifyPasswordResetCode,
  confirmPasswordReset,
  sendEmailVerification,
  GoogleAuthProvider,
} from "firebase/auth";

import { auth, db, googleProvider } from "@/lib/firebase/client";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { createUser } from "@/lib/services/firestore/users_firestore_service.js";
import { fetchWithAuth } from "@/app/api/auth/fetch_with_auth";

export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
}

export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);

  const userRef = doc(db, "users", cred.user.uid);
  const existing = await getDoc(userRef);

  if (!existing.exists()) {
    await createUser(cred.user.uid, cred.user.email);
  }

  return cred.user;
}

export async function logout() {
  return signOut(auth);
}

export async function checkEmailAuthState(email) {
  const res = await fetch("/api/auth/check-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("email-check-failed");
  }

  const { state } = await res.json();
  return state; // "new" | "google-only" | "password-only" | "both" | "unknown"
}

export async function register(email, password) {
  const authState = await checkEmailAuthState(email);

  if (authState === "google-only") {
    throw new Error("account-exists-google");
  }

  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  await sendEmailVerification(user, {
    url: `${process.env.NEXT_PUBLIC_APP_URL}/views/login`,
  });

  await signOut(auth);

  return user;
}

export async function resendVerificationEmail(email, password) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    console.log("Signed in:", {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
    });

    if (user.emailVerified) {
      throw new Error("already-verified");
    }

    await sendEmailVerification(user, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/views/login`,
    });

    return true;
  } catch (err) {
    console.error("resendVerificationEmail failed:", {
      code: err.code,
      message: err.message,
      error: err,
    });

    throw err;
  } finally {
    if (auth.currentUser) {
      await signOut(auth);
    }
  }
}

export async function resetPasswordFirebase(email) {
  const authState = await checkEmailAuthState(email);

  if (authState === "google-only") {
    throw new Error("account-exists-google");
  }

  const actionCodeSettings = {
    url: `${window.location.origin}/views/reset_password`,
    handleCodeInApp: true,
  };
  await sendPasswordResetEmail(auth, email, actionCodeSettings);
}

export async function resetPassword(email) {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Failed to send reset email.");
  }
}

export async function confirmResetPassword(oobCode, password) {
  return confirmPasswordReset(auth, oobCode, password);
}

export async function verifyResetCode(oobCode) {
  return verifyPasswordResetCode(auth, oobCode);
}

// --- Change password (authenticated, settings page) ---
export async function changePassword(oldPassword, newPassword) {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user.");

  if (!hasPasswordProvider(user)) {
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
export function hasPasswordProvider(user = auth.currentUser) {
  if (!user) return false;

  return user.providerData.some(
    (provider) => provider.providerId === "password",
  );
}

export async function deleteAccount(password = null) {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user.");

  if (hasPasswordProvider(user)) {
    if (!password) throw new Error("Password required to confirm deletion.");

    const credential = EmailAuthProvider.credential(user.email, password);

    await reauthenticateWithCredential(user, credential);
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

export function canChangePassword(user = auth.currentUser) {
  if (!user) return false;

  return user.providerData.some(
    (provider) => provider.providerId === "password",
  );
}

export async function linkGoogleAccountWithPassword(email, password) {
  const provider = new GoogleAuthProvider();

  try {
    const { user } = await signInWithPopup(auth, provider);

    if (user.email !== email) {
      throw new Error("google-email-mismatch");
    }

    const providers = user.providerData.map((provider) => provider.providerId);

    if (providers.includes("password")) {
      throw new Error("password-already-linked");
    }

    const credential = EmailAuthProvider.credential(email, password);

    await linkWithCredential(user, credential);

    return user;
  } finally {
    if (auth.currentUser) {
      await signOut(auth);
    }
  }
}
