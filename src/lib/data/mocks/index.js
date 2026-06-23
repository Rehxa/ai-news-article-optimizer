/**
 * Mocks Index
 * Central export for all mock data
 */

export { mockUsers, getMockUserById, getAllMockUsers } from "./mockUsers.js";

export {
  mockSettings,
  getMockSettingsByUserId,
  getAllMockSettings,
} from "./mockSettings.js";

export {
  mockArticles,
  getMockArticleById,
  getMockArticlesByUserId,
  getAllMockArticles,
  getMockBinArticles,
  getMockArticlesDueForDeletion,
  getMockOptimizedArticles,
} from "./mockArticles.js";
