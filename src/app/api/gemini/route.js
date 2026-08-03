import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { prompts, buildFinalPrompt } from "@/lib/ai/prompts";

const client = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3.1-flash-lite",
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

    const response = await client.invoke([
      new SystemMessage(prompts[mode].system),
      new HumanMessage(userPrompt),
    ]);

    // console.log(response.response_metadata);
    console.log(JSON.stringify(response.response_metadata, null, 2));

    const text = typeof response.content === "string" ? response.content : "";

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
