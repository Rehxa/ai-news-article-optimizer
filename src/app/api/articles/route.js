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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const articleId = searchParams.get("articleId");
    const bin = searchParams.get("bin") === "true";

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
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
    console.log("[STEP 2 - API BEFORE RESPONSE]", articles);
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
    const body = await req.json();
    const { userId, title, description, content } = body;

    if (!userId || !title) {
      return Response.json(
        { error: "userId and title are required" },
        { status: 400 },
      );
    }

    const articleId = await createArticle(userId, title, description, content);
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
