

# Fix LP01 Background Gradient — Match Home Page Hero Style

The LP currently uses the `.mesh-gradient` class which applies multiple gold (`hsla(45, 100%, 55%)`) radial gradients. At low opacity on black, these read as olive/brown. The home page Hero uses a cleaner vertical gradient: `bg-gradient-to-b from-background via-card/50 to-background`.

## Changes

### `src/pages/PmsLandingPage01.tsx`
Replace the `mesh-gradient` div with the same gradient pattern used in the home Hero:

- Remove: `<div className="absolute inset-0 mesh-gradient pointer-events-none" />`
- Replace with: `<div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background pointer-events-none" />`

This gives the LP a clean, neutral dark gradient that matches the home page feel — no olive/brown tint.

### `src/components/pms/lp01/LpHero.tsx`
The Hero section has its own floating orbs using `bg-accent/10` and `bg-accent/5`. These are fine since they're localized blurs, but if the olive tint persists, we can also reduce their opacity slightly (e.g., `bg-accent/5` and `bg-accent/[0.03]`).

