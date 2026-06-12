# Fix Plan - Round 2

## Issue 1: Footer hover color not showing rose-400
**File**: `src/components/Footer.tsx`
**Problem**: Hover color not visible on footer links
**Fix**: Ensure `hover:text-rose-400` class is properly applied, check if inline style is overriding

## Issue 2: Remove scroll indicator (Image 10)
**File**: `src/pages/Home.tsx`
**Problem**: White line + "Scroll to explore" text visible
**Fix**: Remove the entire scroll indicator motion.div section

## Issue 3: Mobile black empty space after HowItWorks (Images 11, 12)
**File**: `src/pages/Home.tsx`
**Problem**: Large black gap between HowItWorks "Get Started Now" and "12 Unique Personalities"
**Fix**: The desktop scroll-driven HowItWorks section's spacer/blank area shows on mobile. Remove/hide the desktop-only scroll container on mobile.

## Issue 4: Remove red sparkle icon from persona card hover (Image 13)
**File**: `src/pages/Home.tsx`
**Problem**: Red sparkle/star icon above "Practice with Sophia" on hover
**Fix**: Remove the sparkle icon from the hover overlay

## Issue 5: Add 2 female testimonials
**File**: `src/pages/Home.tsx`
**Problem**: All 6 testimonials are from men
**Fix**: Replace 2 testimonials with female names and content

## Issue 6: Mobile bottom tab bar hover color (Image 14)
**File**: `src/components/Navbar.tsx`
**Problem**: Bottom tab icons have no hover effect
**Fix**: Add hover color to tab icons and labels
