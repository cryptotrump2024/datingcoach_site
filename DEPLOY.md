# Deploying DatingCoach

The app is in `app/`. Cloud auth/sync work out of the box (public Supabase keys
are baked into the build). Live AI and real payments need server secrets added
in Vercel. Without them the site still works fully (offline practice engine +
demo upgrade flow).

## 1. Create the Vercel project (one time)

1. [vercel.com](https://vercel.com) → **Add New… → Project**.
2. Import the Git repo **`cryptotrump2024/datingcoach_site`**.
   - Do **not** reuse the existing `datingcoach` project — it's connected to a
     different repo (an Expo build) with incompatible settings.
3. Configure:
   - **Root Directory:** `app`
   - **Framework Preset:** Vite (auto-detected)
   - Build/Output: defaults (`npm run build` → `dist`)
4. **Deploy.** You get a URL like `https://datingcoach-site-xxxx.vercel.app`.

After this, every push to the repo auto-deploys (Vercel git integration).

## 2. Add environment variables (Project → Settings → Environment Variables)

Minimum for **live AI**:

| Name | Value |
| --- | --- |
| `OPENROUTER_API_KEY` | your OpenRouter key |
| `AI_PRIMARY` | `openrouter` |

Optional — model choice (cheaper/different models):

| Name | Example |
| --- | --- |
| `OPENROUTER_CHAT_MODEL` | `openai/gpt-4o-mini` |
| `OPENROUTER_ANALYSIS_MODEL` | `openai/gpt-4o-mini` |

Optional — Anthropic instead of / alongside OpenRouter: `ANTHROPIC_API_KEY`
(set `AI_PRIMARY=anthropic` to prefer it).

Optional — **real payments** (Stripe test or live):

| Name | Value |
| --- | --- |
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (from step 4) |
| `SUPABASE_SECRET_KEY` | your Supabase secret key (lets the webhook upgrade plans) |

Re-deploy after adding vars (Deployments → ⋯ → Redeploy).

## 3. Supabase auth settings (optional, ~1 min)

- **Frictionless testing:** Authentication → Providers → Email → turn **off**
  "Confirm email" so signups log in immediately.
- **Google button:** Authentication → Providers → enable Google (add OAuth
  client + secret).

A pre-confirmed demo login already exists for testing cloud mode — see the
chat handoff.

## 4. Stripe webhook (only if using real payments)

1. Stripe Dashboard (test mode) → Developers → Webhooks → Add endpoint.
2. URL: `https://<your-vercel-domain>/api/stripe-webhook`
3. Event: `checkout.session.completed`
4. Copy the signing secret → set `STRIPE_WEBHOOK_SECRET` in Vercel → redeploy.

## 5. Security — rotate shared secrets

The OpenRouter key, Supabase keys/DB password, and GitHub token were shared in
plaintext during setup. Rotate them (OpenRouter dashboard; Supabase → Settings →
API; GitHub → Developer settings). If the Supabase **publishable** key changes,
update `app/.env.production`.
