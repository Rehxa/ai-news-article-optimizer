export class Article {
  constructor({
    id,
    title,
    description,
    content,
    optimizedContent,
    isOptimized,
    isInBin,
    createdAt,
    updatedAt,
    deletedAt,
    overrideToneOfVoice,
    appendInstruction,
    aiScore,
    userId,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.content = content;
    this.optimizedContent = optimizedContent;
    this.isOptimized = isOptimized;
    this.isInBin = isInBin;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.overrideToneOfVoice = overrideToneOfVoice;
    this.appendInstruction = appendInstruction;
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
      isOptimized: false,
      isInBin: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      overrideToneOfVoice: null,
      appendInstruction: null,
      aiScore: 0,
      userId,
    });
  }

  /**
   * Serialize for database storage
   */
  toJSON() {
    return {
      title: this.title,
      description: this.description,
      content: this.content,
      optimizedContent: this.optimizedContent,
      isOptimized: this.isOptimized,
      isInBin: this.isInBin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      overrideToneOfVoice: this.overrideToneOfVoice,
      appendInstruction: this.appendInstruction,
      aiScore: this.aiScore,
      userId: this.userId,
    };
  }
}
