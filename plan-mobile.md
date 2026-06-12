# Mobile App-Like Redesign Plan

## Goal
Redesign all mobile views to feel like a native app. Desktop stays unchanged.

## Design Principles
- Bottom tab bar navigation (native app feel)
- Full-width cards, single column layout
- Touch targets minimum 48px
- Swipe carousels for persona cards and testimonials
- Stacked vertical layouts (no side-by-side on mobile)
- Simplified text, larger readable fonts
- Hidden desktop nav items, visible mobile ones (Tailwind responsive)
- No horizontal overflow

## Agent Breakdown

### Agent 1: Mobile_Navbar
**File**: `src/components/Navbar.tsx`
- Top bar: Logo + hamburger icon only (mobile)
- Bottom tab bar: Home, Science, Pricing, Profile (mobile)
- Hamburger opens full-screen menu overlay
- Desktop nav stays exactly as-is
- Add `useState` for menu open/close
- Bottom tab uses fixed positioning, glass effect

### Agent 2: Mobile_Home_Top  
**File**: `src/pages/Home.tsx` (Hero, TrustBar, HowItWorks)
- Hero: Reduce headline (text-4xl md:text-7xl), stack buttons vertically, reduce padding
- TrustBar: Horizontal scroll for logos, 2x2 grid for stats, smaller text
- HowItWorks: Stack cards vertically (flex-col), full-width, simplify text
- Use `md:` and `lg:` prefixes for responsive classes

### Agent 3: Mobile_Home_Bottom
**File**: `src/pages/Home.tsx` (Personas, Analysis, Testimonials, Pricing, FinalCTA)
- Personas: Horizontal scroll-snap carousel, 1.5 cards visible (peek), full-height cards
- Analysis: Stack vertically, full-width, simplify
- Testimonials: Horizontal scroll-snap carousel, one card at a time
- Pricing: Stack cards vertically (flex-col), featured card on top, full-width
- FinalCTA: Full-width button, smaller padding, centered text

### Global
- `src/components/Layout.tsx`: Add bottom padding for mobile bottom tab bar
- `src/index.css`: Ensure `body { overflow-x: hidden; }` for mobile
- `index.html`: Viewport meta tag check (touch-friendly)
