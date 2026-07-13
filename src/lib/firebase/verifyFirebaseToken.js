import { adminAuth } from "@/lib/firebase/admin";

export async function verifyFirebaseToken(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return { error: "Missing token", status: 401 };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log({ user: decodedToken });
    return { user: decodedToken };
  } catch (err) {
    return { error: "Invalid or expired token", status: 401 };
  }
}
