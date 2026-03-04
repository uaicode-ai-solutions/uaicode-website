

# LP Adjustments

## 1. Remove urgency line (`LpHero.tsx`, lines 59-63)
Delete the "Join 2,500+ founders who validated before building" paragraph and the `Users` icon import.

## 2. Increase logo size (`LpHero.tsx`, line 23)
Change `h-8` to `h-14 md:h-16` for a proportional, aesthetically balanced logo in the hero.

## 3. Footer: dynamic year + open links in new tab (`LpFooter.tsx`)
- Replace hardcoded `© 2025` with `{new Date().getFullYear()}`
- Change `<Link>` to `<a href="..." target="_blank" rel="noopener noreferrer">` so Privacy/Terms open in a new tab without losing the lead

### Files Changed
| File | Change |
|------|--------|
| `LpHero.tsx` | Remove urgency paragraph, enlarge logo |
| `LpFooter.tsx` | Dynamic year, links open in new tab |

