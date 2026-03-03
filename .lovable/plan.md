

# Fix SuccessCases Background Color

The `SuccessCases` component has a hardcoded `bg-black` on line 83. Since the LP already has a full-page gradient background, this section should be transparent to inherit the parent gradient.

## Change

### `src/components/SuccessCases.tsx` (line 83)
- Replace `bg-black` with `bg-transparent` so it inherits the LP's gradient when used there, while still looking fine on the home page (which also has a dark background).

