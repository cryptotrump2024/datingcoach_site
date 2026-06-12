# VibeChat V2 — Enhancement Plan

## New Features to Build

### 1. Authentication System
- Signup page (email, password, username)
- Login page (email, password)
- Password reset flow
- Guest mode (free tier without login)
- Session management via localStorage + context
- Protected routes (dashboard, review history)

### 2. Profile Image Analyzer
- Upload a dating profile screenshot (Tinder, Bumble, Hinge, etc.)
- AI-powered analysis of what the profile communicates
- Detailed breakdown: red flags, green flags, bio analysis, photo quality
- Suggestions for improvement
- Social proof indicators analysis

### 3. 3-Tier Pricing Model
- **Free Tier**: No login required, limited credits (3 conversations), basic analysis, no save history
- **Pro ($9.95/mo)**: 50 conversations/mo, full analysis, save history, profile analyzer, priority support
- **Advanced ($29.95/mo)**: Unlimited everything, custom personas, advanced coaching, AI girlfriend generator, relationship advisor, early access to new features
- Pricing page with comparison table
- Stripe + Crypto payment UI (USDT, USDC, BTC)

### 4. Credit System
- Free users get 3 credits on signup
- Each conversation = 1 credit
- Each profile analysis = 1 credit
- Credit display in navbar
- Upgrade prompts when credits run out

### 5. Marketing Deliverables
- App one-liner/tagline
- Comprehensive marketing plan (TikTok, Instagram, influencers, demo videos, paid ads, SEO, content strategy)
- Research-backed strategy with timelines and budgets

## Execution Stages

### Stage 1: Research & Marketing Plan
- Deploy deep-research-swarm for dating app marketing strategies
- Write marketing plan report

### Stage 2: Design
- Designer creates designs for new pages (auth, pricing, profile analyzer)
- Update existing pages with credit system, auth state

### Stage 3: Implementation
- Scaffold: Auth system + credit system integration
- Parallel: Pricing page + Profile analyzer page
- Merge, build, deploy

### Stage 4: Marketing Plan Delivery
- Finalize and deliver marketing plan document
