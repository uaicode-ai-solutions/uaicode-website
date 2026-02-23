

# Pricing + FAQ Updates: Marketing Launch Plan, Support & Database Sync

## Overview
Update database pricing (+$7,000 per tier for rounded numbers), update hardcoded pricing cards to match, add Marketing Launch Plan line item, fix "priority support" wording, and update FAQ answers (without specific dollar values).

---

## 1. Database Update (tb_pms_mvp_tier)

Add $7,000 (700,000 cents) to both min and max price for all tiers:

| Tier | Current (cents) | New (cents) | Display |
|------|----------------|-------------|---------|
| Starter min | 1,000,000 | 1,700,000 | $17,000 |
| Starter max | 2,500,000 | 3,200,000 | $32,000 |
| Growth min | 2,500,000 | 3,200,000 | $32,000 |
| Growth max | 6,000,000 | 6,700,000 | $67,000 |
| Enterprise min | 6,000,000 | 6,700,000 | $67,000 |
| Enterprise max | 16,000,000 | 16,700,000 | $167,000 |

SQL:
```text
UPDATE tb_pms_mvp_tier SET min_price_cents = min_price_cents + 700000, max_price_cents = max_price_cents + 700000 WHERE is_active = true;
```

---

## 2. PricingTransparency.tsx -- Hardcoded Card Updates

### Price ranges (lines 51-53, 130-132, 212-214)
- Starter: `$10,000 - $25,000` -> `$17,000 - $32,000`
- Growth: `$25,000 - $60,000` -> `$32,000 - $67,000`
- Enterprise: `$60,000 - $160,000` -> `$67,000 - $167,000`

### New line item in each "What's Included" accordion
Add to all 3 cards:
- `Marketing Launch Plan (branding, brand manual, landing page, paid media plan & 8-12 ad creatives)`

### Support wording (lines 105, 192)
- Starter line 105: `45 days of support` -> `45 days of priority support`
- Growth line 192: `90 days of support` -> `90 days of priority support`
- Enterprise line 278: already says "120 days of priority support" -- no change

---

## 3. FAQ.tsx -- Answer Updates (no dollar values)

### Q3: "How much does an MVP typically cost?"
New answer (no specific prices):
"Our MVP packages vary depending on complexity, features, and timeline. Every package includes a Marketing Launch Plan (branding, brand manual, landing page, paid media strategy, and 8-12 ad creatives). The Starter MVP is perfect for basic concepts, the Growth MVP includes advanced features and AI automation, and the Enterprise MVP offers full-stack solutions with custom AI models. Check our pricing section for current ranges, or book a free strategy call for a personalized quote."

### Q7: "Do you offer post-launch support?"
New answer (no dollar values):
"Yes! All our packages include post-launch priority support: 45 days for Starter, 90 days for Growth, and 120 days for Enterprise. Priority support includes bug fixes, performance monitoring, feature enhancements, technical guidance, and monitoring of your marketing campaign metrics. After the included support period ends, you can extend your partnership on a monthly basis -- we continue evolving both your SaaS product and marketing strategy together, ensuring constant growth and success."

### New FAQ: "What is the Marketing Launch Plan?" (icon: Megaphone)
"Every package includes a complete Marketing Launch Plan to ensure your SaaS launches with a professional go-to-market strategy. This includes branding and brand identity, a brand manual, an optimized landing page, a paid media strategy, and 8 to 12 ad creatives ready for campaigns. This is included in all tiers -- Starter, Growth, and Enterprise."

### New FAQ: "Do I need to pay for ads separately?" (icon: BadgeDollarSign)
"Yes. The ads budget (the amount spent on platforms like Google Ads, Meta Ads, LinkedIn Ads, etc.) is always paid directly to the media platforms -- not to Uaicode. Our Marketing Launch Plan includes the strategy, creatives, and a recommended ads budget based on your market and goals, but the actual ad spend is your investment and is separate from our packages. We provide a recommendation, but the final budget is always your decision."

---

## Technical Details

### Files to modify:
1. **Database** -- UPDATE query on `tb_pms_mvp_tier` (+700,000 cents to min/max)
2. **`src/components/PricingTransparency.tsx`** -- update 3 price strings, add Marketing Launch Plan line to each accordion, fix support wording on Starter and Growth
3. **`src/components/FAQ.tsx`** -- update Q3 and Q7 answers (no values), add 2 new questions (import `Megaphone` and `BadgeDollarSign` from lucide-react)

