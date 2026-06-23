/**
 * Mock User Data
 * For testing without Firebase
 */

import { User } from "../../models/user.js";

export const mockUsers = [
  {
    id: "user_001",
    email: "alice@kiripost.news",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "user_002",
    email: "bob@kiripost.news",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "user_003",
    email: "charlie@kiripost.news",
    createdAt: new Date("2024-03-05"),
  },
];

/**
 * Get a mock user by ID
 */
export const getMockUserById = (userId) => {
  return mockUsers.find((user) => user.id === userId);
};

/**
 * Get all mock users
 */
export const getAllMockUsers = () => {
  return mockUsers;
};
