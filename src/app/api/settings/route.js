/**
 * API Route: GET /api/settings
 * Fetch user settings
 */

import {
  getSettingByUserId,
  updateSettingToneOfVoice,
  createDefaultSetting,
} from "@/lib/services/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const settings = await getSettingByUserId(userId);
    return Response.json(settings);
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    await createDefaultSetting(userId);
    return Response.json(
      { message: "Default settings created" },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return Response.json(
      { error: error.message || "Failed to create settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { userId, toneOfVoice } = body;

    if (!userId || !toneOfVoice) {
      return Response.json(
        { error: "userId and toneOfVoice are required" },
        { status: 400 },
      );
    }

    await updateSettingToneOfVoice(userId, toneOfVoice);
    return Response.json({ message: "Settings updated" });
  } catch (error) {
    console.error("PATCH /api/settings error:", error);
    return Response.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 },
    );
  }
}
