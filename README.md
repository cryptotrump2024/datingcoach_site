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

| Variable | Where used | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | client | Supabase project URL (enables real accounts + cloud sync) |
| `VITE_SUPABASE_ANON_KEY` | client | Supabase publishable/anon key (safe to expose; RLS protects data) |
| `ANTHROPIC_API_KEY` | server only | Enables the live AI engine via `/api` functions |
| `ANTHROPIC_CHAT_MODEL` | server only | Optional override (default `claude-haiku-4-5`) |
| `ANTHROPIC_ANALYSIS_MODEL` | server only | Optional override (default `claude-sonnet-4-6`) |
| `SUPABASE_DB_URL` | local script only | Postgres connection string for `npm run apply-schema` |
| `SUPABASE_SECRET_KEY` | server only | Reserved for future server functions — never expose |

## Supabase setup (one-time)

1. Create a project at [supabase.com](https://supabase.com) and grab the URL + publishable key.
2. Apply the database schema: `cd app && npm run apply-schema` (uses `SUPABASE_DB_URL`), or paste
   `supabase/schema.sql` into the Supabase SQL editor.
3. Optional: enable the Google provider (Authentication → Providers) for one-tap sign-in.
4. **Security:** rotate your keys (Settings → API) if they were ever shared in plaintext.

## Deploy (Vercel)

- Project root: `app/` — framework preset **Vite**. `app/vercel.json` provides SPA rewrites that
  keep `/api/*` routed to the serverless functions.
- Set the environment variables above. Without `ANTHROPIC_API_KEY` the site still works using the
  offline practice engine; with it, conversations and profile analysis use live AI.

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
