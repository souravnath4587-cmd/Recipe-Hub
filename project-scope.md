# Recipe-Hub — Project Scope

How this website actually works, as built. Written from a read of the code on
2026-09-20, not from a design document — where the code and the intent disagree,
this file describes the code and flags the gap.

---

## 1. What the product is

Recipe-Hub is a recipe-sharing site with three layers of value:

1. **Public browsing** — anyone can see the landing page and the recipe list.
2. **Member publishing** — signed-in users publish their own recipes, favourite
   and vote on others, and report bad ones. How many they may publish depends on
   their subscription plan.
3. **Paid unlocks** — Pro and Premium members can purchase access to individual
   recipes, up to a per-plan cap.

Admins get a separate dashboard for moderating users, recipes and reports.

An AI layer sits on top: a recipe draft generator, a cooking chat assistant, and
an advisory triage tool for the admin moderation queue.

---

## 2. Architecture — two services, not one

This repository is **the Next.js front end plus its own auth, payments and AI
routes**. The recipe/report/payment data lives in a **separate Express + MongoDB
backend** that is not in this repo.

```
Browser
   │
   ▼
Next.js app (this repo)                    External Express API
├── /api/auth/[...all]  → better-auth      ├── /api/allRecipes
├── /api/ai/recipe      → Gemini           ├── /api/myRecipe/:id
├── /api/ai/chat        → Gemini           ├── /api/myRecipes?recipeCreatorId=
├── /api/checkout_sessions → Stripe        ├── /api/recipes            (POST)
│                                          ├── /api/recipes/:id/vote   (PATCH)
├── Server Components ─── fetch ──────────▶├── /api/recipes/:id/favourite (PATCH)
└── Server Actions ────── fetch ──────────▶├── /api/recipes/:id/feature (PATCH)
                                           ├── /api/myRecipes/:id  (PUT / DELETE)
                                           ├── /api/reports    (GET/POST/DELETE)
                                           ├── /api/users, /api/users/:id/status
                                           ├── /api/payments, /api/payments/checkout
                                           ├── /api/plans?plan_id=
                                           └── /api/subscriptions
```

**Two databases.** better-auth owns its own MongoDB database
(`RecipeHub-Auth`, via `MONGODB_AUTH_URI`) holding users, sessions and accounts.
Everything else — recipes, reports, payments, plans — lives in the Express
service's database. The link between them is the better-auth **user id**, which
is sent to the backend as `recipeCreatorId`, `userId`, etc.

**Stack**: Next.js 16 (App Router, React 19, React Compiler on), HeroUI v3,
Tailwind v4, framer-motion, react-toastify, better-auth, Stripe, AI SDK v7 with
`@ai-sdk/google` (Gemini).

---

## 3. How the app talks to the backend

Everything goes through four helpers in `src/app/lib/core/server.js`, all
pointed at `NEXT_PUBLIC_BASE_URL`:

| Helper | Auth header | Used for |
| --- | --- | --- |
| `serverFetch(path)` | none, `cache: "no-store"` | public reads (recipes, plans) |
| `protectedFetch(path)` | `Bearer <session token>` | users, reports, payments |
| `serverMutation(path, data, method)` | `Bearer <session token>` | create / update |
| `serverDelete(path, id)` | **none** | delete recipe, delete report |

Those helpers are wrapped by thin per-domain modules — `lib/api/*` for reads
(called from Server Components) and `lib/action/*` for writes (`"use server"`
Server Actions called from Client Components).

The bearer token is the better-auth **session token**, read server-side by
`getUserToken()`. The Express service is expected to validate it.

---

## 4. Authentication and roles

Configured in `src/app/lib/auth.js` (better-auth + MongoDB adapter).

- **Methods**: email + password, and Google OAuth.
- **Custom user fields**: `role` (default `"user"`), `status` (default
  `"active"`), `plan` (default `"user_free"`). These ride along on the session,
  so every page can read plan and role without an extra request.
- **Client side**: `authClient` (`lib/auth-client.js`) with no `baseURL` — auth
  lives on the same origin, so it works locally and on Vercel unchanged.
- **Server side**: `lib/core/session.js` gives `getUserSession()`,
  `getUserToken()` and `requireRole(role)`.

**Route protection** is done with segment layouts:

| Layout | Gate | Effect |
| --- | --- | --- |
| `dashboard/user/layout.jsx` | `requireRole("user")` | non-users → `/unauthorized` |
| `dashboard/admin/layout.jsx` | `requireRole("admin")` | non-admins → `/unauthorized` |
| `pricing/layout.jsx` | `requireRole("user")` | signed-out → `/signIn` |

Not signed in at all → redirect to `/signIn`.

**Route handlers and Server Actions are not covered by those layouts** — they are
separately addressable. So each AI surface re-gates itself with `requireAiUser()`,
and `triageReport()` re-checks `role === "admin"` itself.

**Hydration rule.** The server cannot see the client session, so any component
reading `authClient.useSession()` during render pairs it with `useHydrated()`
(`lib/useHydrated.js`) and renders the logged-out state until hydration
finishes. Navbar, dashboard layout, profile page and the cooking assistant all
follow this.

---

## 5. Route map

### Public / `(main)`
| Route | Renders |
| --- | --- |
| `/` | Hero, recipe strip (first 6), features, why-join, explore sections |
| `/recipes` | All recipes with a client-side search over name / category / cuisine |
| `/recipes/[id]` | Recipe detail — **requires sign-in**, redirects to `/signIn?redirect=…` |

### Auth `(auth)`
| Route | Notes |
| --- | --- |
| `/signIn` | email+password and Google; honours a `redirect` query param |
| `/signUp` | sets `role: "user"` and `plan: "user_free"` at sign-up |

### Pricing
| Route | Notes |
| --- | --- |
| `/pricing` | three plan cards, monthly/yearly toggle, posts to Stripe checkout |
| `/pricing/success` | verifies the Stripe session, then records the subscription |

### User dashboard (`/dashboard/user/...`)
`overView`, `addRecipe`, `myRecipes`, `myRecipes/[id]` (edit), `purchasedRecipes`,
`favorite`, `profile`.

### Admin dashboard (`/dashboard/admin/...`)
`adminMenu` (overview), `manageUsers`, `manageRecipes`, `manageRecipes/[id]`,
`reports`, `transactions` *(stub — placeholder text only)*.

### Support
`/unauthorized`, `not-found`, `loading`.

---

## 6. Plans, limits and payments

### Plan tiers
Plan definitions are served by the backend (`/api/plans?plan_id=`) and mirrored
for display in `pricing/PricingPlans.jsx`.

| Plan id | Price | Publish limit | Purchase cap (enforced in UI) |
| --- | --- | --- | --- |
| `user_free` | Free | 3 recipes | cannot purchase at all |
| `user_pro` | $9.99/mo | 10 recipes | 5 |
| `user_premium` | $24.99/mo | unlimited (marketing copy) | 10 in code, label says 20 |

Yearly billing shows a 20% discount and maps to the `annual_*` Stripe prices.

### Publish limit enforcement
`dashboard/user/addRecipe/page.jsx` fetches the plan and the user's recipes,
compares `recipes.length` against `plan.maxApplicationRecipePerMonth`, and either
renders `AddRecipeForm` or a lockout card. `RecipeLimitMeter` shows the usage bar.

### Subscription checkout (real Stripe)
1. Each plan card is a `<form action="/api/checkout_sessions" method="POST">`
   carrying `plan_id` and `billing_period`.
2. The route maps that to a price id from `PLAN_PRICE_ID` (`lib/stripe.js`),
   creates a Stripe **subscription** checkout session with the user's email, and
   303-redirects to Stripe.
3. Stripe returns to `/pricing/success?session_id=…`, which retrieves the session
   server-side, and on `status === "complete"` calls `createSubscription()` →
   backend `/api/subscriptions` with `{ email, planId }`. The backend is what
   actually upgrades the user's `plan`.
4. `status === "open"` → back to `/pricing`.

### Per-recipe purchase (currently mocked)
On the recipe detail page, the purchase button is disabled for free users and
for Pro/Premium users who hit their cap. When enabled, `handlePurchasePayment`
**generates a fake transaction id** (`"ch_" + random`) and posts
`{ userId, userEmail, recipeId, transactionId, userPlan }` to
`/api/payments/checkout`, then routes to the purchased-recipes page. No money
moves — Stripe is not in this path yet.

---

## 7. Core user flows

### Publishing a recipe
1. `/dashboard/user/addRecipe` checks the plan limit server-side.
2. Optionally: type an idea → **AI draft** (`POST /api/ai/recipe`) prefills the form.
3. An image file is uploaded client-side to **ImgBB**; the returned URL is stored.
4. Ingredients are typed one per line and split into an array on submit.
5. `createRecipe()` POSTs to `/api/recipes` with `status: "pending"`,
   `createdAt`, and `recipeCreatorId`.

> Note: recipes are written as `"pending"` but nothing in the app filters on that
> status or approves them — listings show everything. Either the backend flips it
> or the approval step is still missing.

### Interacting with a recipe
On `/recipes/[id]`: like / dislike (`PATCH /vote`), favourite
(`PATCH /favourite`), and report via a modal that POSTs
`{ recipeId, userId, reason, details }` to `/api/reports`. Counts come back from
the API and are merged into local state.

### Favourites
There is no dedicated favourites endpoint for reads — `/dashboard/user/favorite`
fetches **all** recipes and filters client-side for ones whose `favourite` array
contains the user id. The overview page computes its stats the same way.

### Admin moderation
- **Users**: block / unblock → `PATCH /api/users/:id/status` with
  `{ status: "block" | "active" }`. A blocked user is refused by the AI gate.
- **Recipes**: toggle `isFeatured` (`PATCH /feature`, surfaced on the home page's
  featured section), edit, delete.
- **Reports**: view the queue, run **AI triage** on a report, resolve, or delete.

---

## 8. The AI layer

Shared plumbing lives in `src/app/lib/ai/`:

- **`models.js`** — the single registry. `recipe` and `chat` use
  `gemini-3.8-flash`, `moderation` uses `gemini-3.5-flash-lite`, and `fallback`
  is `gemini-3.6-flash`. Swapping model or provider happens here only.
- **`run.js`** — `runModel(primary, fn)` retries once on the fallback model when
  the error looks transient (429/500/503, "high demand", "overloaded"). Real
  errors — bad key, bad schema, retired model — surface immediately.
- **`guard.js`** — `requireAiUser()`: must be signed in (401), must not be
  blocked (403), and is limited to 20 calls per hour (429). Called **before** any
  model call so unauthorized requests cost zero tokens.

### Three surfaces

| Feature | Entry point | Shape |
| --- | --- | --- |
| Recipe generator | `POST /api/ai/recipe` | `generateObject` against a Zod schema whose field names match what the form persists; `maxDuration = 60` because a full generation measured 30.4s |
| Cooking assistant | `POST /api/ai/chat` | `streamText` → UI message stream; `maxDuration = 30` |
| Report triage | `triageReport()` Server Action | `generateObject` → `{ severity, category, reasoning, recommendedAction }` |

The **cooking assistant** (`components/ai/CookingAssistant.jsx`) is mounted once
in the root layout and self-gates: it renders `null` unless a user is signed in,
so it never appears on the auth pages. It is keyed by user id, so signing out and
back in within the same tab starts a fresh conversation rather than leaking the
previous user's history into the model context.

The chat route deliberately does **not** use `runModel` — `streamText` resolves
before a capacity error arrives on the stream, so a try/catch would never fire.
The retry affordance is the client's `regenerate()` button instead.

Triage is **advisory only**. It changes nothing; the admin still acts.

---

## 9. Environment variables

| Variable | Used for |
| --- | --- |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | better-auth session signing and base URL |
| `MONGODB_AUTH_URI` | auth database (`RecipeHub-Auth`) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in |
| `NEXT_PUBLIC_BASE_URL` | the Express backend origin (defaults to `http://localhost:5000`) |
| `NEXT_PUBLIC_IMAGE_UPLOAD_API` | ImgBB key — **public, exposed in the browser** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` | Stripe |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini, read implicitly by `@ai-sdk/google` |

`next.config.mjs` enables the React Compiler and allows remote images from any
HTTPS host. Because recipe image fields are user-supplied and unvalidated,
`lib/imageSrc.js#isValidImageSrc` exists to stop `next/image` throwing on junk
values like `"Https"` — worth applying anywhere an image URL comes from the DB.

---

## 10. Known gaps and rough edges

Things the code does today that probably are not the intended final behaviour:

1. **Recipe purchases are mocked.** A random transaction id is generated
   client-side and trusted by the backend. No payment is taken, and a user could
   call the action directly.
2. **`serverDelete` sends no auth header**, so recipe and report deletion is
   unauthenticated at the transport layer.
3. **`/pricing` requires `role === "user"`**, so an admin visiting it is bounced
   to `/unauthorized`.
4. **The AI rate limit is per-process**, held in a `Map`. It resets on cold start
   and is not shared across Vercel instances — a cost speed-bump, not a quota.
   A durable limit belongs in a shared store or on the plans document.
5. **Purchase caps are enforced only in the UI** (button disabled state). The
   backend must enforce them independently.
6. **Premium cap mismatch**: the code checks `>= 10`, the label says `20/20`.
7. **`status: "pending"`** is written on new recipes but never used for filtering
   or approval.
8. **Favourites and stats fetch the whole recipe collection** and filter in JS —
   fine at demo size, not at scale.
9. **`/dashboard/admin/transactions` is a placeholder**, and
   `lib/action/admin.js` is empty. `lib/getMokAdminstats.js` holds mock admin
   data.
10. **Leftover scaffolding**: literal `4. Additional Sections` text on the home
    page, a large commented-out first draft at the top of `pricing/success/page.jsx`,
    commented recruiter/company helpers in `lib/api/recipes.js`, and several
    `console.log` calls in server pages.
11. **`handleStatusCode` in `core/server.js` is defined but never called** — the
    `// handle 401, 403` comments mark where it was meant to go, so non-OK
    responses from the backend currently fall through as parsed JSON.

---

## 11. Running it

```bash
npm run dev     # Next.js dev server
npm run build
npm run start
npm run lint
```

The Express backend must be running separately at `NEXT_PUBLIC_BASE_URL`
(default `http://localhost:5000`), or every recipe, report and payment page will
fail to load.
