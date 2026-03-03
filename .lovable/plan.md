

# LP01 Visual Upgrade: Video Mockup, Copy Reduction, Social Proof

Three changes to align the LP with high-converting US SaaS benchmarks.

---

## 1. Hero — Add Video Embed Below CTA

Reuse the same `YouTubeEmbed` component and `hero-video-thumbnail.webp` from the home page Hero. Add it below the trust bar in `LpHero.tsx`, wrapped in a glow container identical to the home Hero pattern.

**File**: `src/components/pms/lp01/LpHero.tsx`
- Import `YouTubeEmbed` and `heroThumbnail`
- Add video block after trust bar with the accent glow wrapper and `max-w-4xl`

---

## 2. Copy Reduction (~40%) Across All Sections

**`LpHero.tsx`** — Shorten sub-headline from 3 lines to 1 line:
- Current: "Answer a few questions about your idea and get a complete validation report with market analysis, competitive landscape, pricing strategy, and financial projections. 100% free."
- New: "Answer a few questions. Get a complete market validation report — free."

**`LpProblem.tsx`** — Shorten sub-headline and remove emotional close quote:
- Sub-headline: "Building without validation is like driving blindfolded." (one line)
- Remove the italic quote at the bottom (lines 64-67)

**`LpSolution.tsx`** — Tighten sub-headline and card descriptions:
- Sub-headline: "One report. Four powerful insights. Everything before you write code."
- Shorten each card `desc` to ~10-12 words max

**`LpHowItWorks.tsx`** — Tighten step descriptions and sub-headline:
- Sub-headline: "No spreadsheets. No consultants. Just answer and receive."
- Shorten each step `desc` to ~15 words max

---

## 3. Social Proof Section — Reuse SuccessCases

Import the existing `SuccessCases` component (testimonial carousel with avatars, country flags, results) directly into the LP page. It already has the glass card style, accent colors, and CTA pattern that matches the LP aesthetic.

**File**: `src/pages/PmsLandingPage01.tsx`
- Import `SuccessCases` from `@/components/SuccessCases`
- Place `<SuccessCases />` after `<LpSolution />` and before `<LpHowItWorks />`

Flow becomes: Hero → Problem → Solution → **Social Proof** → How It Works

---

## Summary of Files

| File | Action |
|------|--------|
| `src/components/pms/lp01/LpHero.tsx` | Add video embed, shorten copy |
| `src/components/pms/lp01/LpProblem.tsx` | Shorten copy, remove quote |
| `src/components/pms/lp01/LpSolution.tsx` | Shorten copy |
| `src/components/pms/lp01/LpHowItWorks.tsx` | Shorten copy |
| `src/pages/PmsLandingPage01.tsx` | Add SuccessCases import |

