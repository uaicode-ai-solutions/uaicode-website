

# LP /pms/lp-01 Conversion Improvements

Seven changes across the landing page, grouped by file.

---

## 1. Replace Badge with UaiCode Logo (`LpHero.tsx`)
- Remove the `<Sparkles>` badge ("AI-Powered SaaS Validation")
- Replace with the UaiCode logo (`uaicode-logo.png`) at ~32px height, centered above the headline
- Keep the same visual spacing (mb-8)

## 2. Add Mid-Page CTA After Solution Section (`LpSolution.tsx`)
- Add a centered CTA block below the deliverables grid:
  - Button: "Get My Free Report →" linking to `/pms/wizard`
  - Subtitle: "No credit card required. Results in ~10 minutes."

## 3. Adjust Testimonials Copy for LP Context (`SuccessCases.tsx`)
- Add a bridge line below the testimonials section subtitle when `showCTAs={false}`:
  - "Start with your free validation report — then let's talk about building it together."
- This contextualizes the "Uaicode as partner" testimonials for the free-report funnel

## 4. Split Problem Section Title (`LpProblem.tsx`)
- Break into two lines for consistency:
  - Line 1: "90% of Startups Fail."
  - Line 2: "Most Never Saw It Coming." (gold gradient)

## 5. Add Urgency Element (`LpHero.tsx`)
- Below the trust bar items, add a subtle line:
  - "Join 2,500+ founders who validated before building"
- Or incorporate into the existing trust bar as reinforcement

## 6. Add Minimal Footer (`new: LpFooter.tsx`)
- Copyright © 2025 Uaicode
- Links to `/privacy` and `/terms` (pages already exist)
- Minimal glass style, consistent with LP aesthetic

## 7. Add Meta Tags for LP Route (`PmsLandingPage01.tsx`)
- Use `useEffect` to set `document.title` and meta description/OG tags specific to the LP:
  - Title: "Free SaaS Validation Report | Uaicode.ai"
  - Description: "Turn your SaaS idea into a data-driven strategy in minutes. Get a free market validation report with competitive analysis, financial projections, and more."
  - OG image: reuse the existing social image

## 8. Wire Everything in Page (`PmsLandingPage01.tsx`)
- Import and add `LpFooter` at the bottom
- Order: Hero → Problem → Solution → SuccessCases → HowItWorks → Footer

---

### Files Changed
| File | Action |
|------|--------|
| `src/components/pms/lp01/LpHero.tsx` | Replace badge with logo, urgency element already in trust bar |
| `src/components/pms/lp01/LpSolution.tsx` | Add mid-page CTA below grid |
| `src/components/pms/lp01/LpProblem.tsx` | Split h2 into two lines |
| `src/components/SuccessCases.tsx` | Add bridge text when `showCTAs={false}` |
| `src/components/pms/lp01/LpFooter.tsx` | New — minimal footer |
| `src/pages/PmsLandingPage01.tsx` | Add footer, set meta tags |

