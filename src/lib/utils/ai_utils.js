// AI generation
const runAI = async (payload = {}) => {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "AI request failed");
    }

    return data.data;
  } catch (err) {
    throw err;
  }
};
export const AIRequest = {
  rewrite: ({ content, tone }) =>
    runAI({
      mode: "fullRewrite",
      articleContent: content,
      tone: tone,
    }),

  suggest: ({ content }) =>
    runAI({
      mode: "suggestions",
      articleContent: content,
    }),

  score: ({ content }) =>
    runAI({
      mode: "optimizationScore",
      articleContent: content,
    }),

  selectiveSuggestion: ({ content }) =>
    runAI({
      mode: "selectiveSuggestion",
      articleContent: content,
    }),
};
