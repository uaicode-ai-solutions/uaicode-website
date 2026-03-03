

# Add "Meet the Founder" Section to LP — Funnel-Aligned

## Strategy

The marketing team's idea is strong, but the CTA must align with the funnel:

1. User sees LP → runs wizard (lead captured)
2. User receives report (email + dashboard)
3. Report and email contain the "Book a Call" CTA

So on the LP, the founder section builds **desire** for the call but the CTA pushes to **get the report first** — not to book directly. This qualifies the lead and forces wizard completion.

## Content

- **Headline**: "Got Questions After Your Report? Talk Strategy With an Expert"
- **Body**: "After receiving your free report, you'll have the option to book a 1-on-1 strategy session with Rafael Luz — former Microsoft AI Solutions Architect who has helped 100+ founders turn validated ideas into launched products. No pitch. Just real, actionable advice for your specific idea."
- **Subtle note**: "Available exclusively after you receive your report"
- **CTA**: "Get My Free Report First" → `/pms/wizard` (same CTA as rest of LP, maintaining single-CTA principle)

## Files

### New: `src/components/pms/lp01/LpFounder.tsx`
Glass card with two-column layout:
- Left/top: Founder photo (`founder-rafael-luz.webp`), name, "Founder & CEO at Uaicode.ai", credential badge "Ex-Microsoft AI Solutions Architect"
- Right/bottom: Benefit-focused copy (what the user gets from a call, not a bio), note about exclusivity after report, CTA → `/pms/wizard`

### Modify: `src/pages/PmsLandingPage01.tsx`
Add `<LpFounder />` after `<LpHowItWorks />`

