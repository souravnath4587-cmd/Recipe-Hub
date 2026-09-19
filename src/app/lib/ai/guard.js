import "server-only";
import { getUserSession } from "@/app/lib/core/session";

// Per-user call budget.
//
// NOTE: this Map lives in the process, so it resets on cold start and is not shared
// between Vercel function instances. It is a cost speed-bump, not a real quota.
// A durable quota belongs in a shared store, or as a field on the plans document
// served by /api/plans?plan_id= (see the meter pattern in
// src/app/dashboard/user/addRecipe/page.jsx).
const hits = new Map();
const LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

/**
 * Gate for every AI route handler and server action.
 *
 * Segment layouts like dashboard/admin/layout.jsx call requireRole(), but that only
 * protects the *page*. Route handlers and server actions are separately addressable
 * and reach none of that, so each one must gate itself by calling this first -
 * before any model call, so an unauthorized request costs zero tokens.
 *
 * Returns { user } on success, or { error, status } to hand straight back to the
 * caller. It deliberately does not redirect: these are API surfaces, not pages.
 */
export async function requireAiUser() {
  const user = await getUserSession();

  if (!user) {
    return { error: "Please sign in to use AI features.", status: 401 };
  }

  if (user.status === "block") {
    return { error: "Your account is blocked. Please contact support.", status: 403 };
  }

  const now = Date.now();
  const record = hits.get(user.id);

  if (!record || now > record.resetAt) {
    hits.set(user.id, { count: 1, resetAt: now + WINDOW_MS });
  } else if (record.count >= LIMIT) {
    const minutes = Math.ceil((record.resetAt - now) / 60000);
    return {
      error: `You have reached the AI limit. Try again in ${minutes} minutes.`,
      status: 429,
    };
  } else {
    record.count += 1;
  }

  return { user };
}
