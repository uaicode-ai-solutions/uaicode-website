

# Landing Page `/pms/lp-01` — High-Converting Design

## Research Findings (US Best Practices 2025-2026)

Top converting SaaS LPs follow this sequence:
1. **Stop the scroll** — specific headline + hero with trust signal above fold
2. **Earn trust** — social proof (customer count, logos, stats)
3. **Explain the value** — benefits, not features
4. **Remove doubt** — address objections
5. **Make the ask** — single CTA, repeated throughout

Key rules: single CTA per page, specific headline naming WHO + OUTCOME, above-fold proof, mobile-first.

## Content (plain language for founders/CEOs/CTOs)

### HERO SECTION
- **Headline**: "Turn Your SaaS Idea Into a Data-Driven Strategy — In Minutes"
- **Sub-headline**: "Answer a few questions about your idea and get a complete validation report with market analysis, competitive landscape, branding assets, and financial projections. 100% free."
- **CTA**: "Get My Free Report" → `/pms/wizard`
- **Trust Bar**: "2,500+ Ideas Validated" · "Ready in 5 Minutes" · "100% Free"

### THE PROBLEM — "The Valley of Death"
- **Headline**: "90% of Startups Fail. Most Never Saw It Coming."
- **Body**: 4 stat cards — "90% fail rate", "$29B wasted yearly on ideas that don't work", "6+ months spent on manual research", "73% of founders say they launched without proper validation"
- Emotional close: "What if you could see the road ahead before you start driving?"

### THE SOLUTION
- **Headline**: "Everything You Need to Launch With Confidence"
- **Body**: Grid of 4 deliverables — Market Validation, Competitive Intelligence, Brand Identity Kit, Financial Projections
- Each card: icon, title, 1-line description

### HOW IT WORKS — The Wizard
- **Headline**: "From Idea to Strategy in 3 Simple Steps"
- **Steps**:
  1. "Tell Us About Your Idea" — Answer a few simple questions about your SaaS concept
  2. "Our AI Does the Heavy Lifting" — Market research, competitor analysis, branding — all generated automatically
  3. "Get Your Complete Report" — A ready-to-use strategy document you can share with investors or your team
- **Final CTA**: "Start Now — It's Free" → `/pms/wizard`

## Files

### New: `src/pages/PmsLandingPage01.tsx`
Page component composing all 4 sections. Standalone (no header/footer) for maximum conversion focus. Pure black background with gold accents.

### New: `src/components/pms/lp01/LpHero.tsx`
Liquid glass hero with floating orbs, headline, sub-headline, CTA button, trust badges. Uses existing `glass-premium`, `mesh-gradient`, `text-gradient-gold`, `glow-white`, `animate-float` utilities.

### New: `src/components/pms/lp01/LpProblem.tsx`
"Valley of Death" section with 4 glass stat cards. Red/destructive accent for urgency. Transition arrow to solution.

### New: `src/components/pms/lp01/LpSolution.tsx`
4-card grid showing deliverables. Glass cards with gold accent icons. Hover lift effects.

### New: `src/components/pms/lp01/LpHowItWorks.tsx`
3 numbered steps with connecting vertical line. Glass cards with step numbers. Final CTA at bottom.

### Modify: `src/App.tsx`
Add route: `<Route path="/pms/lp-01" element={<PmsLandingPage01 />} />`

## Design System
- Background: pure black (`bg-background`)
- Cards: `glass-premium` / `glass-card` with `hover-lift`
- Gold accents via `text-gradient-gold`, `accent` color
- Floating gradient orbs as bg decoration
- `stagger-fade-in` for card groups
- Single CTA color: `bg-accent text-background` with `glow-white`
- All existing CSS utilities — no new CSS needed

