

# Simplify Marketing Launch Plan Text in Pricing Cards

## Change
Remove the parenthetical description "(branding, brand manual, landing page, paid media plan & 8-12 ad creatives)" from the Marketing Launch Plan line item in all 3 pricing cards (Starter, Growth, Enterprise), keeping only "Marketing Launch Plan". The detailed explanation already exists in the FAQ section.

## Technical Details

### File: `src/components/PricingTransparency.tsx`

Three edits -- one per card accordion:

1. **Starter card** -- change:
   `Marketing Launch Plan (branding, brand manual, landing page, paid media plan & 8-12 ad creatives)`
   to: `Marketing Launch Plan`

2. **Growth card** -- same change

3. **Enterprise card** -- same change

No other files affected.

