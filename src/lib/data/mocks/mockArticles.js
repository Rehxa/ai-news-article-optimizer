/**
 * Mock Article Data
 * For testing without Firebase
 */

import { Article } from "../../models/article.js";

export const mockArticles = [
  {
    id: "article_001",
    userId: "user_001",
    title: "Cambodia Tech Boom: What You Need To Know",
    description:
      "A comprehensive look at the growing technology sector in Cambodia",
    content: `The technology sector in Cambodia has been experiencing unprecedented growth over the past few years. 
      Startups are emerging from Phnom Penh at an increasing rate, attracting both local and international investors. 
      This growth is driven by a young, tech-savvy population and government initiatives to promote digital transformation. 
      Major players in the industry are already establishing offices in the capital, bringing high-paying jobs and opportunities 
      for local talent. The ecosystem is still developing, but the potential is enormous. Several incubators and accelerators 
      have been launched to support early-stage companies. Universities are also updating their curricula to match industry demands. 
      The infrastructure is improving with better internet connectivity and more co-working spaces. Challenges remain, including 
      skills gaps and access to capital, but the momentum is undeniable.`,
    optimizedContent: "",
    isOptimized: false,
    isInBin: false,
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-06-01"),
    deletedAt: null,
    overrideToneOfVoice: null,
    appendInstruction: null,
    aiScore: 0,
  },
  {
    id: "article_002",
    userId: "user_001",
    title: "Southeast Asia Climate Policy: Latest Developments",
    description:
      "How countries in the region are tackling environmental challenges",
    content: `Southeast Asia faces significant environmental challenges as it continues to develop economically. 
      Climate change is impacting everything from agriculture to coastal communities. Most ASEAN nations have committed to 
      various environmental agreements and are implementing policies to reduce emissions. However, progress is uneven. 
      Some countries are investing heavily in renewable energy, while others still rely primarily on fossil fuels. 
      The region is also a hotspot for biodiversity, making conservation efforts critical. Cross-border cooperation is 
      essential, as environmental issues don't respect political boundaries. International support and technology transfer 
      play important roles in helping the region transition to sustainable practices. Local communities are increasingly 
      involved in conservation efforts.`,
    optimizedContent: "",
    isOptimized: false,
    isInBin: false,
    createdAt: new Date("2024-06-02"),
    updatedAt: new Date("2024-06-02"),
    deletedAt: null,
    overrideToneOfVoice: null,
    appendInstruction: null,
    aiScore: 0,
  },
  {
    id: "article_003",
    userId: "user_002",
    title: "Interview: A Day With A Local Artisan",
    description: "Meet the craftspeople preserving traditional Khmer arts",
    content: `In a small workshop nestled in Siem Reap, master artisan Sokun carefully shapes intricate wooden sculptures. 
      His hands move with practiced precision, the result of decades spent perfecting his craft. Sokun learned from his father, 
      who learned from his father before him. The tradition runs deep in his family. Today, he worries about the future. 
      Young people are moving to cities, seeking opportunities in other industries. Few apprentices are taking up the craft. 
      "My son works in tourism," Sokun says with a mix of pride and resignation. Yet he remains optimistic. Recently, NGOs 
      and tourism initiatives have begun supporting traditional artisans. International buyers appreciate authentic Khmer crafts. 
      Sokun has started teaching workshops for tourists and locals alike. He sees these efforts as vital to preserving his culture.`,
    optimizedContent: "",
    isOptimized: false,
    isInBin: false,
    createdAt: new Date("2024-06-03"),
    updatedAt: new Date("2024-06-03"),
    deletedAt: null,
    overrideToneOfVoice: "conversational",
    appendInstruction: null,
    aiScore: 0,
  },
  {
    id: "article_004",
    userId: "user_003",
    title: "Economic Indicators: Q2 2024 Analysis",
    description: "Statistical overview of regional economic performance",
    content: `The second quarter of 2024 saw mixed economic results across Southeast Asia. GDP growth rates varied significantly, 
      with some nations experiencing acceleration while others faced headwinds. Inflation remains a concern in several countries, 
      though it has moderated from previous peaks. Trade patterns continue to shift due to geopolitical tensions and supply chain 
      reorganization. Foreign direct investment flows were robust in manufacturing and technology sectors. Agricultural output 
      was affected by weather patterns, particularly in rice-producing regions. Currency movements reflected broader global trends, 
      with most regional currencies facing some depreciation pressure. Labor market data suggests persistent skills mismatches 
      in key sectors. Financial market performance has been resilient, with major indices posting gains. Monetary policy decisions 
      by central banks remain data-dependent and cautious.`,
    optimizedContent: "",
    isOptimized: false,
    isInBin: false,
    createdAt: new Date("2024-06-04"),
    updatedAt: new Date("2024-06-04"),
    deletedAt: null,
    overrideToneOfVoice: null,
    appendInstruction:
      "Include at least 3 specific statistics or data points to support claims.",
    aiScore: 0,
  },
  {
    id: "article_005",
    userId: "user_001",
    title: "Old Article (Archived)",
    description: "This article was deleted 45 days ago",
    content: `This is content from an article that has been soft-deleted and is pending permanent deletion.`,
    optimizedContent: "",
    isOptimized: false,
    isInBin: true,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-15"),
    deletedAt: new Date("2024-04-20"), // 45+ days ago
    overrideToneOfVoice: null,
    appendInstruction: null,
    aiScore: 0,
  },
];

/**
 * Get mock article by ID
 */
export const getMockArticleById = (articleId) => {
  return mockArticles.find((article) => article.id === articleId);
};

/**
 * Get all mock articles by user ID (excluding bin)
 */
export const getMockArticlesByUserId = (userId, excludeBin = true) => {
  return mockArticles.filter(
    (article) => article.userId === userId && (!excludeBin || !article.isInBin),
  );
};

/**
 * Get all mock articles
 */
export const getAllMockArticles = () => {
  return mockArticles;
};

/**
 * Get bin articles for a user
 */
export const getMockBinArticles = (userId) => {
  return mockArticles.filter(
    (article) => article.userId === userId && article.isInBin,
  );
};

/**
 * Get articles due for permanent deletion (older than 30 days in bin)
 */
export const getMockArticlesDueForDeletion = (daysInBin = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysInBin);

  return mockArticles.filter(
    (article) =>
      article.isInBin && article.deletedAt && article.deletedAt < cutoffDate,
  );
};

/**
 * Get optimized articles (isOptimized = true)
 */
export const getMockOptimizedArticles = (userId) => {
  return mockArticles.filter(
    (article) =>
      article.userId === userId && article.isOptimized && !article.isInBin,
  );
};
