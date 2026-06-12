# Plan: Header Transparency + Liquid-Glass Section Transitions

## Task 1: Navbar Transparency
**File**: `src/components/Navbar.tsx`
- Change scroll threshold from 100px to ~10px for immediate response
- Initial state: fully transparent (no background, no blur, no border)
- Scrolled state: glass background with blur
- Keep the transition smooth (duration-300)

## Task 2: Liquid-Glass Section Transitions
**File**: `src/pages/Home.tsx`
- Create reusable `<LiquidTransition />` component with:
  - 200px tall, full width
  - backdrop-filter: blur(40px)
  - Radial gradient highlights with low opacity (0.02-0.08)
  - Transparent edges fading to transparent
  - Soft organic clip-path or large border-radius
  - No borders, no sharp cutoffs
  - Negative margin (-100px) to create overlap between sections
- Insert between major sections:
  1. Hero → TrustBar
  2. TrustBar → HowItWorks
  3. HowItWorks → PersonaShowcase
  4. PersonaShowcase → AnalysisPreview
  5. AnalysisPreview → Testimonials
  6. Testimonials → Pricing
  7. Pricing → FinalCTA
- Remove hard border lines from section backgrounds where they exist

## Task 3: Build + Deploy
- Copy persona images to dist
- Deploy

## Approach
Two parallel subagents:
1. **Header_Agent**: Fixes Navbar.tsx transparency
2. **Transition_Agent**: Creates LiquidTransition component + integrates into Home.tsx
