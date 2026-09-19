# AI Integration Plan — recipe-hub

## Context

recipe-hub is a Next.js 16.2.9 App Router site (JS, React 19, HeroUI v3 + Tailwind v4)
for sharing recipes. It has better-auth (email + Google), Stripe plans
(`user_free` / `user_pro` / `user_premium`), a user dashboard, and an admin area.
Recipe data itself lives in an **external Express API** at `NEXT_PUBLIC_BASE_URL`,
not in this repo — only auth lives in the local Mongo (`RecipeHub-Auth`).

There is currently **no AI code anywhere** in `src/`. This is a greenfield install.

Three features, all available to **any signed-in user** (admin moderation
additionally requires the admin role):

1. **Recipe generator** in the Add Recipe form
2. **Cooking assistant chatbot** (site-wide, streaming)
3. **AI moderation triage** for admin reports

Provider access is via **Vercel AI Gateway** with `AI_GATEWAY_API_KEY` in `.env`.
The project is already Vercel-linked (`.vercel/project.json`, project `recipe-hub`).

## Critical constraint — verify the SDK API before writing code

The `ai` package is **not installed**. Its API has changed substantially from what
is in LLM training data (`useChat` especially). So:

1. `npm i ai @ai-sdk/react zod`
   - `zod` is currently only a _transitive_ dep (v4.4.3 via better-auth). Promote it
     to a direct dependency rather than relying on hoisting.
2. **Then read `node_modules/ai/docs/`** and `node_modules/ai/src/` to confirm the
   real signatures for `generateObject`, `streamText`, the stream response helper,
   and `useChat` before writing any of the files below.
3. Likewise re-check
   `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`
   (AGENTS.md mandates this; route handlers there are plain
   `export async function POST(request)` with no `runtime`/`dynamic` export needed).

The code sketches below show **intent and wiring**, not verified API calls.
Treat any signature mismatch found in the bundled docs as authoritative over this file.

## Models (verified live against the gateway on 2026-09-19)

| Use               | Model                                                                    |
| ----------------- | ------------------------------------------------------------------------ |
| Recipe generation | `anthropic/claude-sonnet-5`                                              |
| Chat assistant    | `anthropic/claude-sonnet-5`                                              |
| Report moderation | `anthropic/claude-haiku-4.5` (cheap, high volume, simple classification) |

Centralize these in one file so swapping is a one-line change.

## Step 0 — Environment

Add to `.env` (server-only; **no** `NEXT_PUBLIC_` prefix — that would ship the key
to the browser):

```
AI_GATEWAY_API_KEY=...
```

Get the key from the Vercel dashboard under AI Gateway -> API Keys. Also add it to
the Vercel project for deploys. `.gitignore` already covers `.env`.

## Step 1 — Shared AI module

**New: `src/app/lib/ai/models.js`**

```js
import "server-only";

export const MODELS = {
  recipe: "anthropic/claude-sonnet-5",
  chat: "anthropic/claude-sonnet-5",
  moderation: "anthropic/claude-haiku-4.5",
};
```

**New: `src/app/lib/ai/guard.js`** — shared gate + rate limit, reusing the existing
`getUserSession()` from `src/app/lib/core/session.js:5`.

```js
import "server-only";
import { getUserSession } from "@/app/lib/core/session";

const hits = new Map(); // userId -> { count, resetAt }
const LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

export async function requireAiUser() {
  const user = await getUserSession();
  if (!user)
    return { error: "Please sign in to use AI features.", status: 401 };
  if (user.status === "block")
    return { error: "Your account is blocked.", status: 403 };

  const now = Date.now();
  const rec = hits.get(user.id);
  if (!rec || now > rec.resetAt)
    hits.set(user.id, { count: 1, resetAt: now + WINDOW_MS });
  else if (rec.count >= LIMIT)
    return { error: "Rate limit reached. Try again later.", status: 429 };
  else rec.count++;

  return { user };
}
```

**Known limitation, stated deliberately:** this counter is in-memory and per-instance.
It resets on cold start and does not coordinate across Vercel function instances, so
it is a cost speed-bump, not a real quota. Acceptable for v1. For a real quota, use a
shared store (Upstash Redis via the Vercel Marketplace) or add an
`aiGenerationsPerMonth` field to the plans document served by `/api/plans?plan_id=`,
reusing the meter/lockout pattern already in
`src/app/dashboard/user/addRecipe/page.jsx:9-18`.

**Security note that matters:** `requireRole()` in the segment layouts
(`dashboard/admin/layout.jsx:4`) does **not** protect route handlers or server
actions — those are separately addressable endpoints. Every AI route and action below
must do its own session/role check. This is why `requireAiUser()` exists.

## Step 2 — Feature 1: Recipe generator (Add Recipe)

**New: `src/app/api/ai/recipe/route.js`** — modeled on the existing
`src/app/api/checkout_sessions/route.js` style (plain `POST`, `NextResponse.json`,
try/catch + `console.error`), but reading `await request.json()`.

Use `generateObject` with a zod schema matching the **exact persisted field names**
from `AddRecipeForm.jsx:92-106`:

```js
const RecipeSchema = z.object({
  recipeName: z.string(),
  category: z.string(),
  cuisineType: z.string(),
  difficultyLevel: z.enum(["Easy", "Medium", "Hard"]),
  preparationTime: z.string(), // e.g. "45 Mins"
  ingredients: z.array(z.string()),
  instructions: z.string(), // one blob, not an array — matches current shape
});
```

**Edit: `src/app/dashboard/user/addRecipe/AddRecipeForm.jsx`**

Add a "Generate with AI" panel above the existing `Fieldset.Group` (inside the
non-blocked branch). One `Input` for the dish idea plus a HeroUI `Button`
(`onPress`, `isLoading` — this codebase uses `onPress`, not `onClick`).
On success, merge into the existing `formData` state:

```js
setFormData((p) => ({
  ...p,
  ...data,
  prepTime: data.preparationTime, // form key is prepTime, payload key is preparationTime
  ingredients: data.ingredients.join("\n"), // textarea is newline-delimited
}));
```

Two shape mismatches are deliberate and must not be skipped:

- the form state key is `prepTime` but the persisted key is `preparationTime`
  (`AddRecipeForm.jsx:40` vs `:98`)
- `ingredients` is a newline string in the form, `string[]` when persisted — the
  array->newline direction already exists in `UpdateRecipeForm.jsx:44-46`, mirror it.

The user still reviews and submits; AI only prefills. The image is untouched (it
uploads separately to ImgBB).

## Step 3 — Feature 2: Cooking assistant chatbot

**New: `src/app/api/ai/chat/route.js`** — `POST`, calls `requireAiUser()`, then
`streamText` with `MODELS.chat` and a system prompt scoping it to cooking (recipes,
substitutions, scaling, technique, food safety) and telling it to decline unrelated
topics. Return the SDK's UI-message stream response helper — **look up the current
helper name in `node_modules/ai/docs/`**, it has been renamed across versions.

**New: `src/app/components/ai/CookingAssistant.jsx`** — `"use client"`, floating
bottom-right launcher + panel, `useChat` from `@ai-sdk/react`.

Self-gating so it needs only one mount point:

```js
const { data: session } = authClient.useSession();
if (!session?.user) return null;
```

This reuses the exact pattern already at `src/app/dashboard/layout.jsx:7`, and matches
the "signed-in users only" decision — logged-out visitors simply never see it.

**Edit: `src/app/layout.js`** — mount `<CookingAssistant />` next to the existing
`<ToastContainer />`. Because the component self-gates, mounting once at the root is
correct and it will not appear on the sign-in/sign-up pages.

Styling: HeroUI semantic tokens (`bg-content1`, `border-divider`, `text-default-500`)
with the site's amber/orange accent — follow the newer files, not the hardcoded hexes
in `AddRecipeForm.jsx`.

## Step 4 — Feature 3: AI moderation for admin reports

**New: `src/app/lib/action/moderation.js`** — `"use server"`, matching the existing
action files in `src/app/lib/action/`.

```js
export async function triageReport({ reason, details, recipeName }) {
  const user = await getUserSession();
  if (user?.role !== "admin") throw new Error("Forbidden"); // layout guard does NOT cover actions
  // generateObject with MODELS.moderation ->
  // { severity: "low"|"medium"|"high", category, reasoning, recommendedAction }
}
```

**Edit: `src/app/dashboard/admin/reports/ReportDashboard.jsx`** — add a "Triage with AI"
`Button` per report row; render the result as a HeroUI `Chip` colour-coded by severity
plus the one-line reasoning. Keep it **on-demand**, not on page render, so opening the
reports page never silently spends tokens.

Result is advisory only — it does not auto-delete anything. The admin still clicks
through to the existing delete/action flow.

## Files touched

**New**

- `ai-install.md` (this document)
- `src/app/lib/ai/models.js`, `src/app/lib/ai/guard.js`
- `src/app/api/ai/recipe/route.js`, `src/app/api/ai/chat/route.js`
- `src/app/lib/action/moderation.js`
- `src/app/components/ai/CookingAssistant.jsx`

**Edited**

- `package.json` (+ `ai`, `@ai-sdk/react`, `zod`)
- `.env` (+ `AI_GATEWAY_API_KEY`)
- `src/app/layout.js` (mount assistant)
- `src/app/dashboard/user/addRecipe/AddRecipeForm.jsx` (generate panel)
- `src/app/dashboard/admin/reports/ReportDashboard.jsx` (triage button)

Nothing in `src/app/lib/core/server.js` changes — no AI output is persisted to the
external API in this phase.

## Verification

1. `npm run dev`, then `npx eslint src/` — must be clean.
2. **Generator:** sign in -> `/dashboard/user/addRecipe` -> type "spicy thai green curry"
   -> Generate. Confirm every field populates, ingredients render one-per-line, and the
   difficulty value is a valid enum member. Submit and confirm the recipe saves through
   the existing `createRecipe` path unchanged.
3. **Chat:** confirm the launcher is **absent** when logged out, appears when signed in,
   and that replies stream token-by-token rather than arriving in one block.
4. **Moderation:** sign in as an admin -> `/dashboard/admin/reports` -> Triage on a report
   -> severity chip + reasoning appear. Confirm the page makes **no** AI call on load.
5. **Auth gates** (the part most likely to be wrong — test directly, not through the UI):

   ```bash
   curl -i -X POST http://localhost:3000/api/ai/chat \
     -H 'content-type: application/json' \
     -d '{"messages":[{"role":"user","content":"hi"}]}'
   ```

   Expect **401**, not a streamed reply. Repeat for `/api/ai/recipe`.

6. **Rate limit:** fire the recipe route 21x while signed in; the 21st should return 429.
7. Confirm the key never reaches the browser:
   `grep -r "AI_GATEWAY" .next/static/ || echo clean`

## Out of scope for this phase

Semantic search / embeddings (needs an embedding store in the external Express API),
persisting AI output back to the backend, plan-based AI quotas, and streaming the
recipe generator. All are natural follow-ups once the three features above are live.
