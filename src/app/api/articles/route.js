/**
 * API Route: GET /api/articles
 * Fetch articles for the current user
 */

import {
  getArticlesByUserId,
  getArticleById,
  createArticle,
  getBinArticles,
} from "@/lib/services/firestore";
import { verifyFirebaseToken } from "@/lib/firebase/verifyFirebaseToken";
export async function GET(req) {
  try {
    const { user, error, status } = await verifyFirebaseToken(req);
    if (error) {
      return Response.json({ error }, { status });
    }
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const articleId = searchParams.get("articleId");
    const bin = searchParams.get("bin") === "true";

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    if (user.uid !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get single article
    if (articleId) {
      const article = await getArticleById(articleId);
      return Response.json(article);
    }

    // Get bin articles
    if (bin) {
      const articles = await getBinArticles(userId);
      return Response.json(articles);
    }

    // Get active articles
    const articles = await getArticlesByUserId(userId, true);
    return Response.json(articles);
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch articles" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const { user, error, status } = await verifyFirebaseToken(req);
    if (error) {
      return Response.json({ error }, { status });
    }
    const body = await req.json();
    const { userId, title, description, content, overrideToneOfVoice } = body;

    if (!userId || !title) {
      return Response.json(
        { error: "userId and title are required" },
        { status: 400 },
      );
    }

    const articleId = await createArticle(
      userId,
      title,
      description,
      content,
      overrideToneOfVoice,
    );
    return Response.json(
      { id: articleId, message: "Article created" },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/articles error:", error);
    return Response.json(
      { error: error.message || "Failed to create article" },
      { status: 500 },
    );
  }
}
