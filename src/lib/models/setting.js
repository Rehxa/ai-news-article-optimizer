/**
 * Settings model
 * Represents default optimization settings for a user
 */

export class Setting {
  constructor({ userId, toneOfVoice }) {
    this.userId = userId;
    this.toneOfVoice = toneOfVoice;
  }

  /**
   * Factory method for creating new Settings instances
   */
  static create(userId, toneOfVoice = "professional") {
    return new Setting({
      userId,
      toneOfVoice,
    });
  }

  /**
   * Serialize for database storage
   */
  toJSON() {
    return {
      userId: this.userId,
      toneOfVoice: this.toneOfVoice,
    };
  }
}
