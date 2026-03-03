

# Adjust "How It Works" Heading Layout

### `src/components/pms/lp01/LpHowItWorks.tsx` (lines 50-53)

Break the heading into two lines using `<br />`:
- Line 1: "From Idea to Strategy in"
- Line 2: "4 Simple Steps" (gold gradient)

```tsx
<h2 className="text-foreground mb-4">
  From Idea to Strategy in<br />
  <span className="text-gradient-gold">4 Simple Steps</span>
</h2>
```

