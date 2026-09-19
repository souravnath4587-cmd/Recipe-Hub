import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
import { NextResponse } from "next/server";
import { requireAiUser } from "@/app/lib/ai/guard";
import { MODELS } from "@/app/lib/ai/models";

export const maxDuration = 30;

const INSTRUCTIONS = [
  "You are the cooking assistant for Recipe-Hub, a recipe sharing site.",
  "Help with recipes, ingredient substitutions, scaling portions, cooking",
  "technique, storage and food safety. Be concise and practical.",
  "Use short paragraphs or short lists; this renders in a narrow chat panel.",
  "If asked about anything unrelated to food or cooking, say that you only help",
  "with cooking and invite a cooking question instead.",
  "Never claim to have looked at the user's saved recipes - you cannot see them.",
].join(" ");

export async function POST(request) {
  try {
    // Gate first: an unauthenticated request must never reach the model.
    const gate = await requireAiUser();
    if (gate.error) {
      return NextResponse.json({ error: gate.error }, { status: gate.status });
    }

    const body = await request.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    // NOTE: runModel() is deliberately not used here. streamText does not throw on
    // a capacity error - it resolves immediately and the failure arrives later on
    // the stream, so a try/catch around it would never fire. The retry affordance
    // for chat is regenerate() in the client instead.
    const result = streamText({
      model: MODELS.chat,
      instructions: INSTRUCTIONS,
      messages: await convertToModelMessages(messages),
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        // Without this the SDK masks the error entirely. Log the real one, show
        // the user something actionable.
        onError: (error) => {
          console.error("AI CHAT STREAM ERROR:", error?.message ?? error);
          return "Sorry, I could not answer that just now. Please try again.";
        },
      }),
    });
  } catch (error) {
    console.error("AI CHAT ERROR:", error?.message);
    return NextResponse.json(
      { error: "Chat is unavailable right now. Please try again." },
      { status: 500 }
    );
  }
}
