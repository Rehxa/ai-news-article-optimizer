/**
 * API Route: /api/users/[id]
 * GET    → fetch a user
 * PATCH  → update a user's tone of voice
 */

import { getUserById, updateUserToneOfVoice } from "@/lib/services/firestore";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const user = await getUserById(id);
    return Response.json(user);
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { toneOfVoice } = body;

    if (!toneOfVoice) {
      return Response.json(
        { error: "toneOfVoice is required" },
        { status: 400 },
      );
    }

    await updateUserToneOfVoice(id, toneOfVoice);
    return Response.json({ message: "Tone of voice updated" });
  } catch (error) {
    console.error("PATCH /api/users/[id] error:", error);
    return Response.json(
      { error: error.message || "Failed to update tone of voice" },
      { status: 500 },
    );
  }
}
