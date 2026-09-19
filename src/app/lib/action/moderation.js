"use server";

import { generateObject } from "ai";
import { z } from "zod";
import { requireAiUser } from "../ai/guard";
import { MODELS } from "../ai/models";
import { runModel } from "../ai/run";

const TriageSchema = z.object({
  severity: z.enum(["low", "medium", "high"]),
  category: z
    .string()
    .describe("Short label for the problem, e.g. 'Spam', 'Copyright', 'Unsafe advice'"),
  reasoning: z.string().describe("One short sentence explaining the severity"),
  recommendedAction: z.enum(["dismiss", "review", "remove"]),
});

const INSTRUCTIONS = [
  "You triage moderation reports for a recipe sharing website.",
  "Judge only the report text you are given - you cannot see the recipe itself,",
  "so never claim to have read it and stay cautious when the details are thin.",
  "Reserve 'high' for credible food-safety risk, clear copyright theft, or abuse.",
  "Use 'remove' only when the report alone is convincing; otherwise 'review'.",
  "Keep reasoning to one short sentence.",
].join(" ");

/**
 * Advisory triage of a single report. Changes nothing - the admin still acts.
 *
 * Server actions are separately addressable endpoints: the requireRole("admin")
 * in dashboard/admin/layout.jsx protects the page, NOT this function. The role
 * check below is the real gate.
 */
export async function triageReport({ reason, details }) {
  // Reuses the shared gate for session, blocked-account and rate-limit checks.
  const gate = await requireAiUser();
  if (gate.error) return { error: gate.error };

  if (gate.user?.role !== "admin") {
    return { error: "Admin access required." };
  }

  const report = [
    `Reason selected by reporter: ${reason || "(none given)"}`,
    `Details from reporter: ${details || "(none given)"}`,
  ].join("\n");

  try {
    const { object } = await runModel(MODELS.moderation, (model) =>
      generateObject({
        model,
        schema: TriageSchema,
        instructions: INSTRUCTIONS,
        prompt: report,
      })
    );

    return { triage: object };
  } catch (error) {
    console.error("AI TRIAGE ERROR:", error?.message);
    return { error: "Could not triage this report. Please try again." };
  }
}
