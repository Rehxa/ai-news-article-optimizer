/**
 * API Route: PATCH /api/articles/[id]
 * Update an article
 */

import {
  updateArticleContent,
  updateArticleScore,
  updateArticleToneOverride,
  updateArticleFields,
  softDeleteArticle,
  restoreArticle,
  deleteArticle,
} from "@/lib/services/firestore";
import { verifyFirebaseToken } from "@/lib/firebase/verifyFirebaseToken";

export async function PATCH(req, { params }) {
  try {
    const { user, error, status } = await verifyFirebaseToken(req);
    if (error) {
      return Response.json({ error }, { status });
    }
    const { id } = await params;
    const body = await req.json();
    const { action, ...updates } = body;

    if (!id) {
      return Response.json(
        { error: "Article ID is required" },
        { status: 400 },
      );
    }

    // Handle different update actions
    if (action === "updateContent") {
      const { optimizedContent, content } = updates;
      const fields = {};
      if (content !== undefined) fields.content = content;
      if (optimizedContent !== undefined)
        fields.optimizedContent = optimizedContent;
      await updateArticleFields(id, fields);
      return Response.json({ message: "Article content updated" });
    }

    if (action === "updateSaveAs") {
      const { title, description } = updates;
      const fields = {};
      if (description !== undefined) fields.description = description;
      if (title !== undefined) fields.title = title;
      await updateArticleFields(id, fields);
      return Response.json({ message: "Article content updated" });
    }

    if (action === "updateScore") {
      const { aiScore } = updates;
      if (aiScore === undefined) {
        return Response.json(
          { error: "aiScore is required for updateScore" },
          { status: 400 },
        );
      }
      await updateArticleFields(id, { aiScore: aiScore });
      return Response.json({ message: "Article score updated" });
    }

    if (action === "updateTone") {
      await updateArticleFields(id, {
        overrideToneOfVoice: updates.overrideToneOfVoice || null,
      });
      return Response.json({ message: "Article tone updated" });
    }

    if (action === "softDelete") {
      await softDeleteArticle(id);
      return Response.json({ message: "Article moved to bin" });
    }

    if (action === "restore") {
      await restoreArticle(id);
      return Response.json({ message: "Article restored from bin" });
    }

    if (action === "delete") {
      await deleteArticle(id);
      return Response.json({ message: "Article permanently deleted" });
    }

    // Generic update if no action specified
    await updateArticleFields(id, updates);
    return Response.json({ message: "Article updated" });
  } catch (error) {
    console.error(`PATCH /api/articles/${params.id} error:`, error);
    return Response.json(
      { error: error.message || "Failed to update article" },
      { status: 500 },
    );
  }
}
