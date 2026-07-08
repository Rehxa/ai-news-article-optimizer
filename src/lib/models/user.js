/**
 * User model
 * Represents a user of the AI News Article Optimizer
 */

export class User {
  constructor({ id, email, password, createdAt, toneOfVoice }) {
    this.id = id; // String: unique user ID
    this.email = email; // String: user email
    this.password = password; // String: hashed password (Firebase Auth handles this)
    this.createdAt = createdAt; // Timestamp: ;account creation time
    this.toneOfVoice = toneOfVoice ?? "professional";
  }

  /**
   * Factory method for creating new User instances
   */
  static create(email, password) {
    return new User({
      id: null, // Will be assigned by Firebase/Firestore
      email,
      password,
      createdAt: new Date(),
      toneOfVoice: "professional",
    });
  }

  /**
   * Serialize for database storage
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      toneOfVoice: this.toneOfVoice,
    };
  }
}
