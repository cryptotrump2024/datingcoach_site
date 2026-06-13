# DatingCoach

**Practice makes confident.** DatingCoach is a dating-skills training platform: build a realistic
persona, practice texting conversations, get per-message coaching feedback, run guided scenario
drills, analyze your dating profile, and track your improvement over time.

Positioning: a **practice simulator that builds real skill** — not a reply generator. Users learn
to be naturally confident, not artificially witty.

## Tech stack

- **Frontend:** Vite + React 19 + TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Zustand, Recharts
- **AI engine:** Vercel serverless functions (`app/api/`) calling the Claude API — persona
  conversations, per-message coaching analysis, and vision-based profile analysis. Falls back to a
  built-in offline practice engine when no API key is configured, so the app always works.
- **Auth & sync:** Supabase (email/password + OAuth, Postgres with row-level security). Env-gated —
  without Supabase keys the app runs in local-first mode (data stays in the browser).
- **Voice practice:** Web Speech API (speech-to-text input, spoken persona replies)

## Local development

```bash
cd app
npm install
npm run dev        # http://localhost:3000
npm run build      # type-check + production build
npm test           # unit tests (vitest)
```

The app runs fully without any environment variables (offline practice engine + local-first data).

## Environment variables

Copy `app/.env.example` to `app/.env.local` and fill in what you have. Mirror the same values in
**Vercel → Project → Settings → Environment Variables** for production.

The public `VITE_SUPABASE_*` values are committed in `app/.env.production` so cloud auth works on
the deployed build without any dashboard config. All **server secrets** below must be set in the
Vercel project settings (Environment Variables) — they are never committed.

| Variable | Where used | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | client (committed) | Supabase project URL — real accounts + cloud sync |
| `VITE_SUPABASE_ANON_KEY` | client (committed) | Supabase publishable key (safe to expose; RLS protects data) |
| `ANTHROPIC_API_KEY` | **Vercel** | Live AI via Anthropic |
| `OPENROUTER_API_KEY` | **Vercel** | Live AI via OpenRouter (any model — GPT, Gemini, Llama, Claude…) |
| `AI_PRIMARY` | **Vercel** | Which provider to try first: `anthropic` or `openrouter` (the other is the backup) |
| `OPENROUTER_CHAT_MODEL` | **Vercel** | Optional (default `openai/gpt-4o-mini`) |
| `OPENROUTER_ANALYSIS_MODEL` | **Vercel** | Optional vision model (default `openai/gpt-4o-mini`) |
| `ANTHROPIC_CHAT_MODEL` / `ANTHROPIC_ANALYSIS_MODEL` | **Vercel** | Optional (defaults `claude-haiku-4-5` / `claude-sonnet-4-6`) |
| `STRIPE_SECRET_KEY` | **Vercel** | Enables real Stripe Checkout (test or live key) |
| `STRIPE_WEBHOOK_SECRET` | **Vercel** | Verifies Stripe webhooks → upgrades the user's plan |
| `SUPABASE_SECRET_KEY` | **Vercel** | Server-only; the Stripe webhook uses it to update plans (bypasses RLS) |
| `SUPABASE_DB_URL` | local only | Postgres string for `npm run apply-schema` (never in Vercel) |

The AI engine tries providers in `AI_PRIMARY` order, falling through to the other on failure, then
to the built-in offline practice engine. Configure either Anthropic or OpenRouter (or both).

## Supabase setup

The schema is **already applied** to the configured project (`profiles`, `conversations`,
`profile_analyses`, `user_progress`, all with owner-only RLS + a signup trigger). To re-apply or set
up a fresh project: `cd app && npm run apply-schema` (uses `SUPABASE_DB_URL`), or paste
`supabase/schema.sql` into the Supabase SQL editor ("Success. No rows returned" = applied).

- **Email confirmation** is currently ON, so new signups must confirm by email before logging in.
  Turn it off for frictionless testing: Supabase → Authentication → Providers → Email → disable
  "Confirm email".
- **Google sign-in:** enable the Google provider (Authentication → Providers) for the button to work.
- **Security:** rotate keys (Settings → API) — they were shared in plaintext during setup.

## Deploy (Vercel)

This repo's app lives in `app/`. To deploy a fresh test URL:

1. Vercel → **Add New Project** → import `cryptotrump2024/datingcoach_site`.
2. Set **Root Directory = `app`**, Framework preset **Vite**. `app/vercel.json` provides the SPA
   rewrites that keep `/api/*` routed to the serverless functions.
3. Add the server-secret env vars from the table above (at minimum `OPENROUTER_API_KEY` +
   `AI_PRIMARY=openrouter` for live AI). Redeploy.

Without any AI key the deployed site still works fully on the offline practice engine; without
Stripe keys the Pricing page uses a demo upgrade. Cloud auth + sync work out of the box (public
Supabase keys are baked into the build).

## Repository layout

```
app/            the web application (deploy root)
app/api/        Vercel serverless functions (Claude API proxy)
supabase/       database schema (schema.sql)
scripts/        operational scripts (apply-schema.mjs)
docs/           product, marketing, SEO and mobile strategy documents
docs/archive/   historical iteration plans
ROADMAP.md      what's next (payments, mobile app, content engine)
```
