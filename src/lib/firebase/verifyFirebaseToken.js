import { adminAuth } from "@/lib/firebase/admin";
import {
  getUserByIdAdmin,
  createUserAdmin,
} from "@/lib/services/firestore/users_admin_firestore_service.js";

export async function verifyFirebaseToken(request) {
  const authHeader = request.headers.get("authorization");
  const idToken = authHeader?.split("Bearer ")[1];

  if (!idToken) {
    return { user: null, error: "missing-token", status: 401 };
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch (err) {
    return { user: null, error: "invalid-token", status: 401 };
  }

  if (!decoded.email_verified) {
    return { user: null, error: "email-not-verified", status: 403 };
  }

  const existing = await getUserByIdAdmin(decoded.uid);
  if (!existing) {
    await createUserAdmin(decoded.uid, {
      email: decoded.email,
    });
  }

  return { user: decoded, error: null, status: 200 };
}
