# DatingCoach Round 5 Plan

## 1. Remove ALL "AI" / "AI-powered" text
Files to fix:
- `src/pages/Pricing.tsx` (2x) → "Generated persona images"
- `src/pages/PersonaBuilder.tsx` (1x) → "Our system will bring her to life"
- `src/pages/ProfileAnalyzer.tsx` (4x) → Remove AI references
- `src/pages/Home.tsx` (1x comment) → Just a comment, rename
- `src/pages/Privacy.tsx` (3x) → "simulated" / "generated" / "conversation models"
- `src/pages/Terms.tsx` (1x) → "simulated personas"

## 2. Share Button → Social Media Share Modal
- Add modal with share options: Copy Link, X/Twitter, Facebook, WhatsApp, Email
- Each generates appropriate share text with URL
- Opens social platforms in new tab with pre-filled text

## 3. Save Analysis to Project
- "Add to My Project" button on analysis results
- Saves to localStorage with a list of saved analyses
- Accessible from dashboard

## 4. Import Profile Analyzer into Persona Builder
- Step 1 of 3: Add "Import from Profile Analyzer" option
- Shows saved profile analyses as persona presets
- Clicking one pre-fills the persona configuration

## 5. How It Works Section Fix
- After cards slide out, show them stacked with spacing
- Fill the black space instead of leaving it empty

## 6. 12 Persona Cards with Horizontal Scroll
- Create 6 more personas (12 total)
- Show 2 rows of 3, with horizontal scroll arrows
- Scroll right reveals next 3 cards, scroll left goes back
