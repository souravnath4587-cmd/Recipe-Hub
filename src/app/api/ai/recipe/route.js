import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { requireAiUser } from "@/app/lib/ai/guard";
import { MODELS } from "@/app/lib/ai/models";
import { runModel } from "@/app/lib/ai/run";

export const maxDuration = 30;

// Field names here must match what AddRecipeForm actually persists, not what the
// form state is called. See the prepTime/preparationTime note in the form.
const RecipeSchema = z.object({
  recipeName: z.string().describe("Short, appetising dish name"),
  category: z.string().describe("e.g. Breakfast, Dessert, Main Course"),
  cuisineType: z.string().describe("e.g. Italian, Thai, Bengali"),
  difficultyLevel: z.enum(["Easy", "Medium", "Hard"]),
  preparationTime: z.string().describe('Total time, formatted like "45 Mins"'),
  ingredients: z
    .array(z.string())
    .describe("One ingredient per item, including quantity, e.g. '2 tbsp olive oil'"),
  instructions: z
    .string()
    .describe("All steps as a single string, numbered, separated by newlines"),
});

const INSTRUCTIONS = [
  "You generate structured recipe data for a recipe-sharing website.",
  "Return realistic, cookable recipes with accurate quantities.",
  "preparationTime must look like '45 Mins'.",
  "ingredients must be one per array item and include quantities.",
  "instructions must be a single string of numbered steps separated by newlines.",
].join(" ");

export async function POST(request) {
  try {
    // Gate first: an unauthenticated request must never reach the model.
    const gate = await requireAiUser();
    if (gate.error) {
      return NextResponse.json({ error: gate.error }, { status: gate.status });
    }

    const body = await request.json().catch(() => ({}));
    const idea = typeof body?.idea === "string" ? body.idea.trim() : "";

    if (!idea) {
      return NextResponse.json(
        { error: "Describe the dish you want to generate." },
        { status: 400 }
      );
    }

    if (idea.length > 300) {
      return NextResponse.json(
        { error: "Keep the description under 300 characters." },
        { status: 400 }
      );
    }

    const { object } = await runModel(MODELS.recipe, (model) =>
      generateObject({
        model,
        schema: RecipeSchema,
        instructions: INSTRUCTIONS,
        prompt: idea,
      })
    );

    return NextResponse.json(object);
  } catch (error) {
    console.error("AI RECIPE ERROR:", error?.message);
    return NextResponse.json(
      { error: "Could not generate a recipe right now. Please try again." },
      { status: 500 }
    );
  }
}
