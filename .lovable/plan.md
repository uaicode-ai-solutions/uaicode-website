

# Fix: Align LP copy with actual report deliverables

## Inaccuracies found

The shared report (`BusinessPlanTab`) delivers these 8 sections:
1. Executive Snapshot (KPIs)
2. Executive Narrative (AI-written summary)
3. Market Analysis (TAM/SAM/SOM)
4. Competitive Landscape (competitors)
5. Target Customer (ICP profile)
6. Business Model (pricing intelligence)
7. Financial Projections (revenue forecasts)
8. Strategic Verdict (viability score + recommendations)

**What the LP incorrectly promises:**
- Hero sub-headline: "branding assets" → does not exist
- LpSolution: "Brand Identity Kit" with "logo suggestions, color palettes" → does not exist
- LpHowItWorks step 02: "branding" → does not exist

## Changes

### 1. `src/components/pms/lp01/LpHero.tsx` (line 34)
Replace "branding assets" with "pricing strategy":
```
"...with market analysis, competitive landscape, pricing strategy, and financial projections."
```

### 2. `src/components/pms/lp01/LpSolution.tsx`
Replace "Brand Identity Kit" card with **"Target Customer Profile"**:
- Icon: `Users` (instead of `Palette`)
- Title: "Target Customer Profile"
- Desc: "Know exactly who your ideal customer is — their pain points, demographics, and buying behavior."

This matches the ICP Intelligence section that IS in the report.

### 3. `src/components/pms/lp01/LpHowItWorks.tsx` (line 16)
Replace "branding, financial modeling" with "pricing strategy, financial modeling":
```
"Market research, competitor analysis, pricing strategy, financial modeling — all generated automatically in minutes."
```

