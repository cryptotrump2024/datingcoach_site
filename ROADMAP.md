# DatingCoach — Roadmap

What shipped in the v2 overhaul and what comes next. Strategy details live in
`docs/` (mobile plan, SEO strategy, marketing plan).

## ✅ Shipped in v2

- Light & trustworthy redesign (full retheme + new homepage with live demo)
- Real AI engine: Claude-powered conversations, coaching analysis, and vision
  profile analysis via `/api` serverless functions, with the offline practice
  engine as automatic fallback
- Supabase accounts + cloud sync (env-gated; local-first guest mode without it)
- 12 guided scenario drills with pass criteria
- Gamification: XP, 10 levels, daily streaks, 12 achievements
- Real analytics dashboard (score trend, skill radar, weakest-skill coaching)
- Voice practice mode (speech-to-text input, spoken persona replies)
- BrowserRouter + clean URLs, error boundary, 404, unit tests, README

## ✅ Now done (was: launch blockers)

- **Database schema applied** to the live Supabase project — verified: tables +
  signup trigger work (admin-creating a user auto-creates its profile row).
- **AI engine** — OpenRouter wired and verified live (`gpt-4o-mini`), Anthropic
  supported, configurable order + offline fallback.
- **Stripe payments** built (env-gated, test-mode ready) — checkout + webhook +
  Pricing wiring, with a demo upgrade fallback.
- **Pre-confirmed demo login** for testing cloud mode:
  `datingcoach.demo.1781320938@gmail.com` / `Sunset-Harbor-99`.

## 🔜 To go live

1. **Deploy** — import `cryptotrump2024/datingcoach_site` as a Vercel project
   with Root Directory = `app` (see README → Deploy). The existing `datingcoach`
   Vercel project is wired to a *different* repo (an Expo build) — don't reuse it
   without repointing its git connection + build settings.
2. **Add server-secret env vars in Vercel** — `OPENROUTER_API_KEY` (+
   `AI_PRIMARY=openrouter`) for live AI; `STRIPE_SECRET_KEY` +
   `STRIPE_WEBHOOK_SECRET` for real payments; `SUPABASE_SECRET_KEY` for webhook
   plan updates. The Vercel MCP can't set these — add them in the dashboard.
3. **Rotate exposed credentials** — the OpenRouter key, Supabase keys/DB
   password, and GitHub PAT were shared in chat. Rotate before serious launch
   (and update `app/.env.production` if the Supabase publishable key changes).
4. **Enable Google OAuth** and decide on **email confirmation** in Supabase
   (currently ON — turn off for frictionless signup testing).
5. **Register the Stripe webhook** → `https://<domain>/api/stripe-webhook` for
   `checkout.session.completed`.

## 💳 Payments — remaining

- Switch Stripe from test to live keys; create real Products/Prices (current
  build uses inline `price_data`, which is fine but per-session)
- Credit packs as one-time purchases
- Crypto checkout (the pricing UI advertises it) via Coinbase Commerce, or strike
  it from the copy
- RevenueCat once mobile apps exist (see `docs/DatingCoach_Mobile_App_Plan.md`)

## 📱 Mobile app

Capacitor wrapper first (4–6 weeks per the mobile plan): push notifications
(streak reminders are the obvious hook), camera roll for profile analysis,
biometric unlock. Flutter rebuild only if usage justifies it.

## 🧠 Product depth

- **Conversation memory**: persona remembers past sessions ("you mentioned
  salsa last time")
- **Custom scenarios**: users define their own drill (the Advanced-tier promise)
- **Real-date debriefs**: paste a real conversation, get the same coaching
- **Weekly recap email** (needs an email provider + Supabase edge function)
- **Opener trainer**: timed reps against rotating profiles, leaderboard-free
- Smarter fallback engine: archetype-specific analysis even without an API key

## 📈 Growth (research already done in docs/)

- Execute the SEO content plan (`docs/DatingCoach_SEO_Strategy.md`) — blog
  routes + 2 posts/week targeting long-tail keywords
- Real OG image (1200×630) — `public/og-image.html` exists as a template but
  `og-image.jpg` was never generated/committed
- Replace placeholder testimonials with real beta-user quotes (and remove the
  "lightly edited" disclaimer if unused)
- App-store-style screenshots for the landing page once real users exist

## 🧹 Engineering debt

- Split the remaining mega-pages (`ProfileAnalyzer.tsx` ~2k lines,
  `PersonaBuilder.tsx` ~1.3k)
- Remove `@ts-nocheck` from `Navbar.tsx` and type it properly
- E2E suite in CI (the Playwright scripts in `scripts/` are a starting point)
- Trim unused deps (gsap, lenis, embla, several Radix packages) to cut bundle
- Rate-limit the `/api` functions (per-IP) before paid launch
