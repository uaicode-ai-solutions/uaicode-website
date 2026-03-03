

# Merge Founder into "How It Works" as Step 4

## Concept

Instead of a separate `LpFounder` section, the founder becomes the natural Step 4 in the flow:

1. Tell Us About Your Idea
2. Our AI Does the Heavy Lifting
3. Get Your Complete Report
4. **Talk Strategy With an Expert** ← NEW

The heading updates from "3 Simple Steps" to "4 Simple Steps".

## Changes

### 1. `src/components/pms/lp01/LpHowItWorks.tsx`

- Add Step 04 to the `steps` array with a `CalendarCheck` icon, title "Talk Strategy With an Expert", and desc mentioning the 1-on-1 call with Rafael Luz (ex-Microsoft AI Solutions Architect) — available after the report
- Update heading from "3 Simple Steps" to "4 Simple Steps"
- Make Step 04 card special: include the founder photo (`founder-rafael-luz.webp`) and credential badge inline within the step card to differentiate it visually from the other steps

### 2. `src/pages/PmsLandingPage01.tsx`

- Remove `<LpFounder />` import and usage (no longer needed as separate section)

### 3. `src/components/pms/lp01/LpFounder.tsx`

- Delete file (content merged into LpHowItWorks)

