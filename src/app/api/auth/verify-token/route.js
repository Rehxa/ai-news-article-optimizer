import { verifyToken } from "@/lib/auth/verify_token";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const payload = verifyToken(token);
    return Response.json({
      email: payload.email,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
