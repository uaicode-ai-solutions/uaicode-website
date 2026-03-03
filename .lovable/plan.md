

# Fix Sub-headline to Single Line on Desktop/Tablet

The text "Answer a few questions. Get a complete market validation report, it's free!" is breaking into two lines because of the `max-w-2xl` constraint on the `<p>` tag.

## Change

### `src/components/pms/lp01/LpHero.tsx` (line 34)
- Replace `max-w-2xl` with `max-w-4xl` so the text fits in one line on desktop and tablet, while still wrapping naturally on mobile.

