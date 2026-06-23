/**
 * Mock Settings Data
 * For testing without Firebase
 */

import { Settings } from "../../models/setting.js";

export const mockSettings = [
  {
    userId: "user_001",
    toneOfVoice: "professional",
    instruction:
      "Keep the article factual and concise. Target audience: news professionals.",
  },
  {
    userId: "user_002",
    toneOfVoice: "conversational",
    instruction:
      "Write in a friendly, accessible tone. Engage readers emotionally.",
  },
  {
    userId: "user_003",
    toneOfVoice: "academic",
    instruction:
      "Use formal language with citations where appropriate. Prioritize accuracy.",
  },
];

/**
 * Get mock settings by user ID
 */
export const getMockSettingsByUserId = (userId) => {
  return mockSettings.find((settings) => settings.userId === userId);
};

/**
 * Get all mock settings
 */
export const getAllMockSettings = () => {
  return mockSettings;
};
