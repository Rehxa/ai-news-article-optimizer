/**
 * Articles Service
 * Firestore CRUD operations for articles
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client.js";
import { Article } from "../../models/article.js";

const ARTICLES_COLLECTION = "articles";

/**
 * Get all active articles for a user (excluding bin)
 */
export async function getArticlesByUserId(userId, excludeBin = true) {
  try {
    let q;
    if (excludeBin) {
      q = query(
        collection(db, ARTICLES_COLLECTION),
        where("userId", "==", userId),
        where("isInBin", "==", false),
        orderBy("createdAt", "desc"),
      );
    } else {
      q = query(
        collection(db, ARTICLES_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
      );
    }

    const snapshot = await getDocs(q);
    const articles = snapshot.docs.map((doc) => {
      const data = doc.data();
      // const article = new Article({
      //   id: doc.id,
      //   ...data,
      //   createdAt: data.createdAt?.toDate() || new Date(),
      //   updatedAt: data.updatedAt?.toDate() || new Date(),
      //   deletedAt: data.deletedAt ? data.deletedAt.toDate() : null,
      // });
      // console.log("[STEP 1 - FIRESTORE]", article);

      // return article;
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        isInBin: data.isInBin,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        deletedAt: data.deletedAt ? data.deletedAt.toDate() : null,
        aiScore: data.aiScore,
      };
    });

    console.log("[STEP 1 - FINAL OUTPUT]", articles);
    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
}

/**
 * Get a single article by ID
 */
export async function getArticleById(articleId) {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Article ${articleId} not found`);
    }

    const data = docSnap.data();
    const article = new Article({
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      deletedAt: data.deletedAt ? data.deletedAt.toDate() : null,
    });

    return article;
  } catch (error) {
    console.error(`Error fetching article ${articleId}:`, error);
    throw error;
  }
}

/**
 * Create a new article
 */
export async function createArticle(
  userId,
  title,
  description,
  content,
  overrideToneOfVoice,
) {
  try {
    const now = new Date();
    const articleData = {
      userId,
      title,
      description,
      content,
      optimizedContent: "",
      isInBin: false,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
      deletedAt: null,
      overrideToneOfVoice: overrideToneOfVoice,
      aiScore: 0,
    };

    const docRef = await addDoc(
      collection(db, ARTICLES_COLLECTION),
      articleData,
    );
    return docRef.id;
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
}

/**
 * Update article content and optimizedContent
 */

export async function updateArticleFields(articleId, fields) {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, {
      ...fields,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error(`Error updating article ${articleId}:`, error);
    throw error;
  }
}

export async function updateArticleContent(articleId, updates) {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error(`Error updating article ${articleId}:`, error);
    throw error;
  }
}

/**
 * Update article optimization score
 */
export async function updateArticleScore(articleId, aiScore) {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, {
      aiScore,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error(`Error updating score for article ${articleId}:`, error);
    throw error;
  }
}

/**
 * Update article tone override
 */
export async function updateArticleToneOverride(articleId, toneOfVoice) {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, {
      overrideToneOfVoice: toneOfVoice || null,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error(
      `Error updating tone override for article ${articleId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Soft delete article (move to bin)
 */
export async function softDeleteArticle(articleId) {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, {
      isInBin: true,
      deletedAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error(`Error soft deleting article ${articleId}:`, error);
    throw error;
  }
}

/**
 * Restore article from bin
 */
export async function restoreArticle(articleId) {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, {
      isInBin: false,
      deletedAt: null,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error(`Error restoring article ${articleId}:`, error);
    throw error;
  }
}

/**
 * Permanently delete article
 */
export async function deleteArticle(articleId) {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting article ${articleId}:`, error);
    throw error;
  }
}

/**
 * Get articles due for permanent deletion (older than X days in bin)
 */
export async function getArticlesDueForDeletion(userId, daysInBin = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInBin);

    const q = query(
      collection(db, ARTICLES_COLLECTION),
      where("userId", "==", userId),
      where("isInBin", "==", true),
      where("deletedAt", "<", Timestamp.fromDate(cutoffDate)),
    );

    const snapshot = await getDocs(q);
    const articles = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    return articles;
  } catch (error) {
    console.error("Error fetching articles due for deletion:", error);
    throw error;
  }
}

/**
 * Get bin articles for a user
 */
export async function getBinArticles(userId) {
  try {
    const q = query(
      collection(db, ARTICLES_COLLECTION),
      where("userId", "==", userId),
      where("isInBin", "==", true),
      orderBy("deletedAt", "desc"),
    );

    const snapshot = await getDocs(q);
    const articles = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        isInBin: data.isInBin,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        deletedAt: data.deletedAt ? data.deletedAt.toDate() : null,
      };
    });

    return articles;
  } catch (error) {
    console.error("Error fetching bin articles:", error);
    throw error;
  }
}
