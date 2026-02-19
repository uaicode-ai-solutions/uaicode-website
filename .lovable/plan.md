

# Fix: FAQs, ContactUs Copy, and CTA Links to Booking

## 1. FAQ Copy Updates (FAQ.tsx)

Update 3 FAQ answers that still reference "Planning My SaaS tool":

| Line | Current | New |
|------|---------|-----|
| 45 (FAQ 1) | "That's exactly what our free Planning My SaaS tool is for! It gives you instant AI-powered market analysis, competitor insights, and a viability score. In just 5 minutes, you'll know if your idea has real potential..." | "That is exactly what the free strategy call is for. In 45 minutes, our founder runs a live AI-powered market analysis of your idea -- viability score, competitor landscape, financial projections. It replaces the $5K-$15K you would normally spend on market research consultants." |
| 55 (FAQ 3) | "...We recommend starting with our free validation tool to ensure your idea is ready for development." | "...We recommend starting with a free strategy call to ensure your idea is ready for development." |
| 65 (FAQ 5) | "...1) Validate with AI - start with our free Planning My SaaS tool for market analysis, 2) Design & Develop..." | "...1) Free Strategy Call - book a 45-minute session with our founder for live AI validation, 2) Design & Develop..." |

## 2. ContactUs Copy Update (ContactUs.tsx)

| Line | Current | New |
|------|---------|-----|
| 222-223 | "Tell us about your Planning My SaaS report or validated idea. We'll create a personalized development roadmap for you." | "Tell us about your strategy call results or your idea. We'll reply within 24 hours with an honest assessment and transparent quote." |

## 3. Link All CTA Buttons to uaicode.ai/booking (new tab)

Replace every `navigate("/planningmysaas")` with `window.open("https://uaicode.ai/booking", "_blank")` in the following files:

| File | Line(s) |
|------|---------|
| Hero.tsx | 32 |
| Challenges.tsx | 71 |
| HowItWorks.tsx | 89 |
| Deliveries.tsx | 89 |
| SuccessCases.tsx | 192 |
| PMSShowcase.tsx | 186, 195 |
| About.tsx | 40 |
| PricingTransparency.tsx | 113, 200, 290 |
| FAQ.tsx | 200 |
| MeetEve.tsx | 73 |
| Header.tsx | 87, 127 |
| Footer.tsx | 186 |

Also fix the `<a href>` link in PricingTransparency.tsx line 42:
- Current: `<a href="/planningmysaas" ...>Book your free call</a>`
- New: `<a href="https://uaicode.ai/booking" target="_blank" rel="noopener noreferrer" ...>Book your free call</a>`

## 4. Booking Page Copy (Schedule.tsx)

Already updated in the previous round -- copy matches the strategy call messaging. No changes needed.

## Summary

- **3 FAQ answers** updated to remove "Planning My SaaS" references
- **1 ContactUs** paragraph updated
- **15 click handlers** across 11 files changed from `navigate("/planningmysaas")` to `window.open("https://uaicode.ai/booking", "_blank")`
- **1 anchor link** in PricingTransparency updated to external URL with `target="_blank"`
- No icon, layout, or structural changes

