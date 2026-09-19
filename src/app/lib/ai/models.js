import "server-only";
import { google } from "@ai-sdk/google";

// Central model registry. Swapping a model - or the whole provider - happens here
// and nowhere else.
//
// Model ids are NOT interchangeable with gateway-style "provider/model" strings.
// Direct Google access needs google("<id>").
//
// Every id below was smoke-tested against a real key on 2026-09-19.
// Do not use gemini-2.5-flash or older: the API rejects them for new users.
export const MODELS = {
  // Structured recipe generation (generateObject) + the cooking assistant.
  recipe: google("gemini-3.8-flash"),
  chat: google("gemini-3.8-flash"),

  // Report triage is simple classification at volume, so it runs on the cheap model.
  moderation: google("gemini-3.5-flash-lite"),

  // Used by runModel() when the primary returns a capacity error. Gemini returns
  // "this model is currently experiencing high demand" intermittently, even after
  // the SDK's own internal retries.
  fallback: google("gemini-3.6-flash"),
};
