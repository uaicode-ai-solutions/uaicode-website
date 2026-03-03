

# Remove CTA Buttons from SuccessCases on LP01

Add a `showCTAs` prop (default `true`) to the `SuccessCases` component, then pass `showCTAs={false}` from `PmsLandingPage01.tsx`.

## Changes

### `src/components/SuccessCases.tsx`
- Change signature to `({ showCTAs = true }: { showCTAs?: boolean })` 
- Wrap the CTAs div (lines 188-207) with `{showCTAs && (...)}`

### `src/pages/PmsLandingPage01.tsx`
- Change `<SuccessCases />` to `<SuccessCases showCTAs={false} />`

