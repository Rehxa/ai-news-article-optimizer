import { verifyToken } from "@/lib/auth/verify_token";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request) {
  const { token, password } = await request.json();

  if (!token || !password) {
    return Response.json(
      { error: "Missing token or password" },
      { status: 400 },
    );
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return Response.json(
      { error: "This link is invalid or has expired." },
      { status: 400 },
    );
  }

  // return Response.json({
  //   success: true,
  //   email: payload.email,
  // });
  let existingUser;

  try {
    existingUser = await adminAuth.getUserByEmail(payload.email);
  } catch (err) {
    if (err.code !== "auth/user-not-found") {
      throw err;
    }
  }

  if (existingUser) {
    const providers = existingUser.providerData.map(
      (provider) => provider.providerId,
    );

    if (providers.includes("google.com")) {
      return Response.json(
        {
          error: "This email is already registered with Google.",
          needsLinking: true,
          provider: "google.com",
          email: payload.email,
        },
        { status: 409 },
      );
    }

    if (providers.includes("password")) {
      return Response.json(
        {
          error: "An account with this email already exists.",
          provider: "password",
        },
        { status: 409 },
      );
    }
  }

  let userRecord;

  try {
    userRecord = await adminAuth.createUser({
      email: payload.email,
      password,
      emailVerified: true,
    });

    await adminDb.collection("users").doc(userRecord.uid).set({
      email: payload.email,
      toneOfVoice: "professional",
      createdAt: FieldValue.serverTimestamp(),
    });

    const customToken = await adminAuth.createCustomToken(userRecord.uid);

    return Response.json({ success: true, customToken });
  } catch (err) {
    if (userRecord) {
      await adminAuth.deleteUser(userRecord.uid);
    }
    if (err.code === "auth/email-already-exists") {
      return Response.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }
    if (
      err.code === "auth/weak-password" ||
      err.message?.includes("Password")
    ) {
      return Response.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 },
      );
    }
    console.error(err);
    return Response.json(
      { error: "Unable to create your account. Please try again." },
      { status: 500 },
    );
  }
}
