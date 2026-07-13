/**
 * API Route: /api/users/[id]/articles
 * DELETE → clear all articles for a user (history), account stays intact
 */

import { clearUserArticles } from "@/lib/services/firestore/users_admin_firestore_service";
import { verifyFirebaseToken } from "@/lib/firebase/verifyFirebaseToken";

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

    const { deletedArticles } = await clearUserArticles(id);
    return Response.json({ message: "History cleared", deletedArticles });
  } catch (error) {
    console.error("DELETE /api/users/[id]/articles error:", error);
    return Response.json(
      { error: error.message || "Failed to clear history" },
      { status: 500 },
    );
  }
}
