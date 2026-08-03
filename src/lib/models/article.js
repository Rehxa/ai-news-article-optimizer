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
    this.aiScore = aiScore;
    this.userId = userId;
  }

  /*
   Serialize for database storage
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
