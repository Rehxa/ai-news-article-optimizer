import { GoogleGenAI } from "@google/genai";
import { prompts, buildFinalPrompt } from "@/lib/ai/prompts";

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const { articleContent, mode, tone } = await request.json();

    if (!articleContent || !mode || !prompts[mode]) {
      return Response.json(
        { success: false, error: "Missing or invalid parameters" },
        { status: 400 },
      );
    }

    const userPrompt = buildFinalPrompt(
      prompts[mode].userTemplate,
      articleContent,
      { tone },
    );

    const response = await client.models.generateContent({
      model: "gemini-3.1-flash-lite",
      // gemini-3.1-flash-lite
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: prompts[mode].system,
    });

    const text =
      response.text ??
      response.candidates?.[0]?.content?.parts?.[0]?.text ??
      "";

    return Response.json({
      success: true,
      data: text,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
