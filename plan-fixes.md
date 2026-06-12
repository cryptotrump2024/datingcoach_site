# Fix Plan - 7 Issues from Screenshots

## Issue 1: Strange Oval (Image 1)
**File**: `src/pages/Home.tsx` - `LiquidTransition` component
**Problem**: `borderRadius: '50%'` creates an oval shape visible on mobile
**Fix**: Replace `LiquidTransition` with the simpler `SectionDivider` component. Remove `borderRadius: '50%'`.

## Issue 2: Old Stats Text (Image 2)
**File**: `src/pages/Home.tsx` - TrustBarSection
**Problem**: Shows "8.5K+" and "180K+" 
**Fix**: Change to "1.5K+" and "15K+"

## Issue 3: HowItWorks Cards Not Showing (Image 3)
**File**: `src/pages/Home.tsx` - HowItWorksSection
**Problem**: Cards use absolute positioning. Only first card visible on mobile.
**Fix**: On mobile, show all 3 cards stacked vertically with static positioning. Keep scroll-driven animation for desktop only.

## Issue 4: Persona Cards - One Card + Broken Images (Image 4)
**File**: `src/pages/Home.tsx` - PersonaShowcaseSection
**Problem**: Multiple cards visible at once, Isabella image broken
**Fix**: Mobile: use `w-[85vw]` for cards with `scrollSnapAlign: 'center'` to show one card at a time. Check image paths.

## Issue 5: Analysis Preview Broken on Mobile (Image 5)
**File**: `src/pages/Home.tsx` - AnalysisPreviewSection
**Problem**: 250vh sticky section with scroll animations doesn't work on mobile. Panels get squished.
**Fix**: On mobile, render as a simple static stacked layout (no sticky, no scroll animations). Desktop keeps existing behavior.

## Issue 6: Old CTA Text (Image 6)
**File**: `src/pages/Home.tsx` - FinalCTASection
**Problem**: "Join 8,500+ guys who are practicing smarter, not harder."
**Fix**: "Join 1,500+ guys/girls who are practicing smarter, not harder."

## Issue 7: Footer Hover Color
**File**: `src/components/Footer.tsx`
**Problem**: Footer links have no visible hover state
**Fix**: Add `hover:text-rose-400` or similar visible hover color to all footer links
