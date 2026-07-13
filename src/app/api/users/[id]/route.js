/**
 * API Route: /api/users/[id]
 * GET    → fetch a user
 * PATCH  → update a user's tone of voice
 */

import { getUserById, updateUserToneOfVoice } from "@/lib/services/firestore";
import { deleteUserData } from "@/lib/services/firestore/users_admin_firestore_service";
import { verifyFirebaseToken } from "@/lib/firebase/verifyFirebaseToken";
import { adminAuth } from "@/lib/firebase/admin";

export async function GET(req, { params }) {
  try {
    const { user, error, status } = await verifyFirebaseToken(req);

    if (error) {
      return Response.json({ error }, { status });
    }

    const { id } = await params;

    if (user.uid !== id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const userData = await getUserById(id);
    return Response.json(userData);
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
    const { user, error, status } = await verifyFirebaseToken(req);
    if (error) {
      return Response.json({ error }, { status });
    }
    const { id } = await params;
    const body = await req.json();
    const { toneOfVoice } = body;

    if (user.uid !== id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

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

export async function DELETE(req, { params }) {
  try {
    const { user, error, status } = await verifyFirebaseToken(req);
    if (error) {
      return Response.json({ error }, { status });
    }

    const { id } = await params;

    if (user.uid !== id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { deletedArticles } = await deleteUserData(id);
    await adminAuth.deleteUser(id); // Auth deleted last, after Firestore cleanup succeeds

    return Response.json({ message: "Account deleted", deletedArticles });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return Response.json(
      { error: error.message || "Failed to delete account" },
      { status: 500 },
    );
  }
}
