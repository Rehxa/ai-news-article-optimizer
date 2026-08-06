import { adminAuth } from "@/lib/firebase/admin";

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return Response.json({ error: "email is required" }, { status: 400 });
  }

  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    const providers = userRecord.providerData.map((p) => p.providerId);

    const hasGoogle = providers.includes("google.com");
    const hasPassword = providers.includes("password");

    let state = "unknown";
    if (hasGoogle && hasPassword) state = "both";
    else if (hasGoogle) state = "google-only";
    else if (hasPassword) state = "password-only";

    return Response.json({ state });
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      return Response.json({ state: "new" });
    }
    console.error("check-email error:", err);
    return Response.json({ error: "check-failed" }, { status: 500 });
  }
}
