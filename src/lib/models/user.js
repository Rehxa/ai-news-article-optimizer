/*
  User model
 */

export class User {
  constructor({ id, email, password, createdAt, toneOfVoice }) {
    this.id = id;
    this.email = email;
    this.createdAt = createdAt;
    this.toneOfVoice = toneOfVoice ?? "professional";
  }

  /*
    Serialize for database storage
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
