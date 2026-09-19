import "server-only";
import { MODELS } from "./models";

// Gemini intermittently rejects a request with "this model is currently experiencing
// high demand" - after the AI SDK has already retried internally - and then succeeds
// on the same input moments later. Treat that class of failure as transient.
//
// Anything else (bad key, invalid schema, retired model id) is a real error and must
// surface immediately rather than being masked by a second attempt.
function isTransient(error) {
  const status = error?.statusCode ?? error?.status;
  if (status === 429 || status === 500 || status === 503) return true;

  const message = `${error?.message ?? ""} ${error?.data?.error?.message ?? ""}`;
  return /high demand|overloaded|unavailable|temporarily|try again/i.test(message);
}

/**
 * Run a model call with automatic fallback.
 *
 * Every AI route and action goes through this rather than calling a model directly,
 * so the fallback cannot be wired up in one place and forgotten in another.
 *
 *   const { object } = await runModel(MODELS.recipe, (model) =>
 *     generateObject({ model, schema, prompt })
 *   );
 *
 * On a transient failure it retries once on MODELS.fallback. If the primary already
 * is the fallback, the original error is rethrown instead of retrying the same model.
 */
export async function runModel(primary, fn) {
  try {
    return await fn(primary);
  } catch (error) {
    if (!isTransient(error) || primary === MODELS.fallback) throw error;

    console.warn("[ai] primary model failed, retrying on fallback:", error?.message);
    return await fn(MODELS.fallback);
  }
}
