export class Article {
  constructor({
    id,
    title,
    description,
    content,
    optimizedContent,
    isInBin,
    createdAt,
    updatedAt,
    deletedAt,
    overrideToneOfVoice,
    aiScore,
    userId,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.content = content;
    this.optimizedContent = optimizedContent;
    this.isInBin = isInBin;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.overrideToneOfVoice = overrideToneOfVoice;
    this.aiScore = aiScore; // Double: optimization quality score (0-100)
    this.userId = userId;
  }

  /**
   * Factory method for creating new Article instances
   */
  static create(userId, title, description, content) {
    const now = new Date();
    return new Article({
      id: null, // Will be assigned by Firestore
      title,
      description,
      content,
      optimizedContent: "",
      isInBin: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      overrideToneOfVoice: null,
      aiScore: 0,
      userId,
    });
  }

  /**
   * Serialize for database storage
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      content: this.content,
      optimizedContent: this.optimizedContent,
      isInBin: this.isInBin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      overrideToneOfVoice: this.overrideToneOfVoice,
      aiScore: this.aiScore,
      userId: this.userId,
    };
  }
}
