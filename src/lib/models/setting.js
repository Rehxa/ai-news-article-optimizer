/**
 * Settings model
 * Represents default optimization settings for a user
 */

export class Setting {
  constructor({ userId, toneOfVoice, instruction }) {
    this.userId = userId;
    this.toneOfVoice = toneOfVoice;
    this.instruction = instruction;
  }

  /**
   * Factory method for creating new Settings instances
   */
  static create(userId, toneOfVoice = "professional", instruction = "") {
    return new Settings({
      userId,
      toneOfVoice,
      instruction,
    });
  }

  /**
   * Serialize for database storage
   */
  toJSON() {
    return {
      userId: this.userId,
      toneOfVoice: this.toneOfVoice,
      instruction: this.instruction,
    };
  }
}
