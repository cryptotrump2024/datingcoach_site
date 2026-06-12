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

## 🔜 Next up (launch blockers)

1. **Apply the database schema** — `cd app && npm run apply-schema` (or paste
   `supabase/schema.sql` into the Supabase SQL editor). Until then the app
   runs local-first.
2. **Set production env vars in Vercel** — `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`.
3. **Rotate exposed credentials** — the Supabase keys/DB password and the
   GitHub PAT were shared in chat during development; rotate both before
   serious launch.
4. **Enable Google OAuth** in Supabase (Authentication → Providers) so the
   "Continue with Google" button works in production.
5. **Email confirmation flow** — decide whether to require it (Supabase
   default: on). The UI already surfaces the "check your email" state.

## 💳 Payments (next major feature)

- Stripe Checkout for Pro/Advanced (monthly + annual), webhook → update
  `profiles.plan` and `credits`
- Credit packs as one-time purchases
- Crypto checkout (the pricing UI already advertises it) via Coinbase Commerce
  or strike it from the copy
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
