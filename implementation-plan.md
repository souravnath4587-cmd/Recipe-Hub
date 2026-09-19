# Implementation Plan — AI features for recipe-hub

Execution companion to [`ai-install.md`](./ai-install.md). That document holds the
**design** (what goes where and why). This one holds the **sequence**: what to build
in what order, what must pass before moving on, and where to stop and commit.

**Build order rationale:** the recipe generator ships first even though the chatbot is
the flashier feature. The generator is non-streaming and proves the entire chain —
session -> route handler -> Gemini -> structured output — with the fewest moving
parts. The chatbot goes second because `useChat` is the highest-risk API in the stack.
Moderation goes last because it is admin-only and lowest risk.

**Standing rule:** where the bundled docs in `node_modules/ai/docs/` contradict a code
sketch in `ai-install.md`, the docs win. Update `ai-install.md` to match rather than
forcing the sketch to work.

---

## Provider: Google AI Studio (Gemini)

The build talks to Gemini **directly** through `@ai-sdk/google` — not through the
Vercel AI Gateway. The gateway was the original plan but refuses to serve any request
without a credit card on file (`customer_verification_required`), so it was dropped.

### Install

```bash
npm i ai @ai-sdk/react @ai-sdk/google zod
```

### Key

Get a key from [Google AI Studio](https://aistudio.google.com/apikey) and put it in
`.env` as:

```
GOOGLE_GENERATIVE_AI_API_KEY=...
```

That exact name is what `@ai-sdk/google` reads from the environment — no explicit
wiring, no `createGoogleGenerativeAI({ apiKey })` call needed. Server-side only;
never prefix it with `NEXT_PUBLIC_`. `.gitignore:34` (`.env*`) already covers it.

The key is currently **local only**. It must be added to the Vercel project before
deploying (step 5.4) or every AI route 500s in preview.

### Usage

```js
import { google } from "@ai-sdk/google";

const result = await generateText({
  model: google("gemini-3.8-flash"),
  prompt: "...",
});
```

Note the shape: `google("<model-id>")`, not a bare `"provider/model"` string. Plain
strings are gateway syntax and will not resolve here.

### Models (each smoke-tested against this key on 2026-09-19)

| Model | Role | Verified |
|---|---|---|
| `gemini-3.8-flash` | recipe generation + chat | text + `generateObject` |
| `gemini-3.5-flash-lite` | moderation triage | text |
| `gemini-3.6-flash` | fallback on capacity errors | text + `generateObject` |

**`gemini-2.5-flash` is retired** — the API returns *"no longer available to new
users"* and points at `gemini-3.6-flash`. Do not copy it in from an older tutorial.

### The gotcha that will cost you an afternoon

Gemini intermittently returns:

> This model is currently experiencing high demand. Spikes in demand are usually
> temporary. Please try again later.

This happened repeatedly during smoke testing on `gemini-3.8-flash` and
`gemini-flash-latest` — **after** the SDK's own three internal retries — and then
succeeded moments later on the same input. It is a capacity condition on Google's
side, not a bug in your prompt, schema, or key.

Consequences for this build, all of them non-optional:

- `models.js` exposes a `fallback` model (step 1.1)
- every model call goes through `runModel()` so the fallback is automatic (step 1.3)
- every AI surface shows a retry affordance rather than a dead end
- a single failed call is never evidence that your code is wrong — retry first

---

## Phase 0 — Foundation (blocking gate)

Nothing else starts until this phase is green. The goal is to prove the transport
works before a single line of UI exists.

> **Status (2026-09-19): PHASE 0 COMPLETE. Phase 1 is clear to start.**
>
> **Provider changed mid-phase.** The Vercel AI Gateway refused to serve requests
> without a credit card on file (`customer_verification_required`), so the build
> moved to **Google AI Studio (Gemini) direct** via `@ai-sdk/google` and
> `GOOGLE_GENERATIVE_AI_API_KEY`. The gateway key that was created is now unused.
>
> Smoke test results: `gemini-3.8-flash` PASS (text + structured output),
> `gemini-3.5-flash-lite` PASS, `gemini-3.6-flash` PASS (fallback).
> `gemini-2.5-flash` is **rejected for new users** — do not use it.
>
> **Carry into every phase:** Gemini intermittently returns *"This model is
> currently experiencing high demand"* even after the SDK's own 3 retries, then
> succeeds moments later. Every AI call needs a visible retry affordance and a
> fallback model. Do not treat a single failure as a bug in your code.

- [x] **0.1 Install dependencies**
  ```bash
  npm i ai @ai-sdk/react @ai-sdk/google zod
  ```
  `zod` is currently transitive only (v4.4.3 via better-auth); this promotes it to a
  direct dependency so a future better-auth bump cannot silently remove it.

- [x] **0.2 Read the real API surface.** Grep `node_modules/ai/docs/` and
  `node_modules/ai/src/` for the current signatures of `generateObject`, `streamText`,
  the UI-message stream response helper, and `useChat`. Write the four real signatures
  into the "Verified API surface" section at the bottom of this file. Do not skip this
  because the calls "look familiar" — `useChat` in particular has moved.
  **Done:** results recorded below.

- [x] **0.3 Provision the key.** `GOOGLE_GENERATIVE_AI_API_KEY` is set in `.env`
  (the exact name `@ai-sdk/google` reads). `.gitignore:34` (`.env*`) covers it.
  **Not yet added to Vercel** — that is step 5.4 and is required before deploying.

- [x] **0.4 Transport smoke test.** PASSED. `generateText` and `generateObject`
  both returned valid output against a real key, isolating key/model/network from
  application bugs before any UI existed. This step is what caught the gateway
  billing block and the retired `gemini-2.5-flash`.

**Gate:** PASSED — Phase 1 may begin.

---

## Phase 1 — Shared module

- [x] **1.1** Create `src/app/lib/ai/models.js` — the three model ids, one export.
- [x] **1.2** Create `src/app/lib/ai/guard.js` — `requireAiUser()`, wrapping the
      existing `getUserSession()` from `src/app/lib/core/session.js:5`. Returns
      `{ user }` or `{ error, status }`; handles 401 (no session), 403 (blocked
      account) and 429 (rate limit).
- [x] **1.3** Create `src/app/lib/ai/run.js` — `runModel(fn)`, which calls `fn` with
      `MODELS.<primary>` and, on a capacity/5xx error, retries once with
      `MODELS.fallback`. Added because Gemini capacity errors are confirmed real
      (see the provider section). Every route and action in Phases 2-4 calls through
      this rather than invoking a model directly, so the fallback is never forgotten.

**Done when:** `npx eslint src/app/lib/ai/` is clean. Nothing is callable yet.

> **Status: PHASE 1 COMPLETE (2026-09-19).** All three files written, eslint clean.
> `runModel()` was unit-tested against its real source across five cases: success
> path, capacity-message fallback, 503 fallback, a 400 that must rethrow rather than
> be masked by a retry, and the primary-is-fallback case that must not double-call.
> 5/5 passed.
>
> Note on `import "server-only"`: the package is not installed, but Next aliases it
> to `next/dist/compiled/server-only` (see `create-compiler-aliases.js`), which is
> why `src/app/lib/stripe.js:1` already works. Consequence: these modules only run
> through the Next bundler, never via plain `node`.

---

## Phase 2 — Recipe generator

- [ ] **2.1** Create `src/app/api/ai/recipe/route.js`. Mirror the existing style in
      `src/app/api/checkout_sessions/route.js` (plain `export async function POST`,
      `NextResponse.json`, try/catch + `console.error`) but read
      `await request.json()`. Call `requireAiUser()` first, before any model call —
      an unauthenticated request must cost zero tokens.
- [ ] **2.2 Auth gate test (do this before building UI):**
      ```bash
      curl -i -X POST http://localhost:3000/api/ai/recipe \
        -H 'content-type: application/json' -d '{"idea":"pad thai"}'
      ```
      Expect **401**. If this returns a recipe, stop and fix the guard.
- [ ] **2.3** Signed-in test via the browser devtools console (so the session cookie
      is attached) — confirm valid JSON matching the zod schema comes back.
- [ ] **2.4** Add the "Generate with AI" panel to
      `src/app/dashboard/user/addRecipe/AddRecipeForm.jsx`, above the existing
      `Fieldset.Group` inside the non-blocked branch. HeroUI `Button` with `onPress`
      and `isLoading` — this codebase does not use `onClick`.
- [ ] **2.5** Wire the two field-shape conversions, which are easy to miss:
      `prepTime` <- `preparationTime`, and `ingredients.join("\n")` for the textarea.
- [ ] **2.6** End-to-end: generate, review, submit, confirm the recipe persists
      through the untouched `createRecipe` path and appears in My Recipes.

**Done when:** a real recipe created via AI prefill is visible in the app.
**Commit point.**

---

## Phase 3 — Cooking assistant chatbot

Highest-risk phase. If something breaks, it is almost certainly the `useChat` wiring,
not the route — so verify the route by itself first.

- [ ] **3.1** Create `src/app/api/ai/chat/route.js` — `requireAiUser()`, then
      `streamText({ model: MODELS.chat, instructions, messages })` scoping the bot to
      cooking and declining unrelated topics. **`instructions`, not `system`** — the
      v7 rename. Return via `createUIMessageStreamResponse` + `toUIMessageStream`
      (exact shape recorded in "Verified API surface" below).
      Also `export const maxDuration = 30`.
- [ ] **3.2 Route-only tests, before any component exists:**
      - unauthenticated `curl` -> **401**
      - authenticated `curl -N` -> tokens arrive incrementally, not in one block
- [ ] **3.3** Create `src/app/components/ai/CookingAssistant.jsx` (`"use client"`):
      floating launcher + panel, `useChat` from `@ai-sdk/react`, self-gating via
      `authClient.useSession()` returning `null` when logged out — the same pattern
      already used at `src/app/dashboard/layout.jsx:7`.
- [ ] **3.4** Mount once in `src/app/layout.js` beside the existing `<ToastContainer />`.
- [ ] **3.5** Verify: absent when logged out (including on `/signIn`), present and
      streaming when signed in, panel survives client-side navigation between routes.

**Done when:** a signed-in user can hold a multi-turn cooking conversation.
**Commit point.**

---

## Phase 4 — Admin moderation triage

- [ ] **4.1** Create `src/app/lib/action/moderation.js` (`"use server"`) with
      `triageReport()`. **It must re-check `user.role !== "admin"` and throw** —
      the `requireRole("admin")` in `dashboard/admin/layout.jsx:4` protects the page,
      not the action. Use `MODELS.moderation` (the cheap model) here.
- [ ] **4.2** Add a per-row "Triage with AI" button to
      `src/app/dashboard/admin/reports/ReportDashboard.jsx`; render severity as a
      colour-coded HeroUI `Chip` plus one line of reasoning.
- [ ] **4.3** Verify: works as admin; the reports page fires **no** AI call on load
      (watch the network tab); a non-admin session invoking the action is rejected.

**Done when:** triage returns advisory output and changes no data.
**Commit point.**

---

## Phase 5 — Hardening and deploy

- [ ] **5.1** `npx eslint src/` clean, `npm run build` succeeds.
- [ ] **5.2** Key containment:
      `grep -r "GOOGLE_GENERATIVE_AI" .next/static/ || echo clean`. Must print `clean`.
- [ ] **5.3** Rate limit: hit `/api/ai/recipe` 21x signed in; the 21st returns 429.
- [ ] **5.4** Add `GOOGLE_GENERATIVE_AI_API_KEY` to the Vercel project env (all
      environments you deploy to) — it is currently local-only. Missing this is the
      most common cause of "works locally, 500s in preview".
- [ ] **5.5** Deploy a preview, re-run the auth-gate curl against the preview URL,
      and confirm one live generation and one live chat.

---

## Risks and how each shows up

| Risk | Symptom | Response |
|---|---|---|
| `useChat` API differs from the sketch | Type/runtime error in the component, or messages never render | Re-read `node_modules/ai/docs/`; the docs are authoritative. Phase 3.2 proves the route is fine, so the bug is client-side. |
| Stream helper renamed | Chat route throws on return | Same — grep the docs for the current export name. |
| `generateObject` rejects the zod v4 schema | 500 from `/api/ai/recipe` | Unlikely — the full 7-field recipe schema was smoke-tested PASS on `gemini-3.8-flash`. Suspect a capacity error first; check the real message before touching the schema. |
| Model id copied from an old tutorial | "no longer available to new users" | `gemini-2.5-flash` and older are retired. Use only the three ids in the provider table. |
| Plain `"provider/model"` string used as the model | Model fails to resolve | That is gateway syntax. Direct Google needs `google("gemini-3.8-flash")`. |
| Rate limiter resets constantly in dev | 429 never triggers | Expected — it is in-memory and per-instance. Do not "fix" it; it is a documented v1 limitation. |
| Gemini capacity error | "This model is currently experiencing high demand" after 3 SDK retries | Confirmed real during smoke testing. Retry, or fall back to `gemini-3.6-flash`. Not a code bug. |
| HeroUI v3 compound components differ | Chat panel renders unstyled or broken | Copy the `Modal.Backdrop > Modal.Container > Modal.Dialog` structure from `RecipeDetailsClient.jsx:417-489` rather than inventing markup. |

## Explicitly not in this build

Semantic search / embeddings, persisting AI output to the external Express API,
plan-based AI quotas, and streaming the recipe generator. Each is a clean follow-up
once these three features are live.

---

## Verified API surface (step 0.2 — completed)

Installed: **`ai@7.0.107`**, **`@ai-sdk/react@4.0.110`**, **`@ai-sdk/google@4.0.76`**,
**`zod@4.6.5`**.
Source: `node_modules/ai/docs/` + `node_modules/ai/dist/index.d.ts`. This is AI SDK
**v7**, which differs substantially from v4/v5 patterns. Everything below is confirmed
against the installed package, not recalled.

### The rename that breaks most v5-era code

`system` is now **`instructions`** (`index.d.ts:680-699` — `system` still exists but is
marked `@deprecated`). There is a codemod: `npx @ai-sdk/codemod v7/rename-system-to-instructions src/`.

Other v7 renames worth knowing: `fullStream` -> `stream`, `onFinish` -> `onEnd`,
`stepCountIs` -> `isStepCount`, `experimental_telemetry` -> `telemetry`.

### `generateObject` — Phase 2 (smoke-tested PASS)

Still exported and supported (it lost its reference page in the bundled docs, but
`typeof generateObject === "function"` and the v7 migration guide still covers it).

```js
import { google } from "@ai-sdk/google";

const { object } = await generateObject({
  model: google("gemini-3.8-flash"),
  schema: RecipeSchema,   // zod schema
  instructions: "...",    // NOT `system`
  prompt: userIdea,
});
```

Result field is **`.object`** (`index.d.ts:7659-7663`). Optional `schemaName` /
`schemaDescription` give the model extra guidance.

### Chat route — Phase 3

```js
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

const result = streamText({
  model: google("gemini-3.8-flash"),
  instructions: "...",
  messages: await convertToModelMessages(messages), // note: awaited
});

return createUIMessageStreamResponse({
  stream: toUIMessageStream({ stream: result.stream }),
});
```

There is **no** `toDataStreamResponse()` / `toAIStreamResponse()` in v7 — that is the
v4/v5 API and will not exist.

### `useChat` — Phase 3

```js
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const { messages, sendMessage, status, error, regenerate } = useChat({
  transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
});
```

Two things that invalidate the older mental model:

1. **`useChat` no longer manages the input.** There is no `input`,
   `handleInputChange` or `handleSubmit`. Keep input in your own `useState` and call
   `sendMessage({ text: input })`.
2. **Render `message.parts`, not `message.content`.** Each part is a tagged union;
   for now render `part.type === "text" ? part.text : null`.

`status` is one of `submitted` | `streaming` | `ready` | `error`. Gate the send button
on `status !== "ready"`.
