

## Create Booking Landing Page (`/booking`)

A dedicated capture page that reuses the Schedule component from the homepage, so any updates to the homepage calendar automatically reflect here.

### What will be done

1. **New page: `src/pages/Booking.tsx`**
   - Minimal page with dark background, no Header/Footer (pure capture page)
   - Imports and renders the existing `<Schedule />` component directly
   - This ensures the headline ("Validated Your Idea? Let's Talk Strategy"), subtitle, and Cal.com embed stay in sync with the homepage

2. **New route in `src/App.tsx`**
   - Add `/booking` as a public route pointing to the new `Booking` page

3. **Update blog post links**
   - In the `BlogPost.tsx` markdown renderer, intercept links pointing to the consultation CTA and redirect them to `/booking` opening in a new tab (`target="_blank"`)
   - Alternatively, if the link is in the database content, update the `<a>` component renderer to detect `/booking` or consultation-related URLs and add `target="_blank"` + `rel="noopener noreferrer"`

### Technical Details

**`src/pages/Booking.tsx`** (new file):
```tsx
import Schedule from "@/components/Schedule";

const Booking = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center">
    <Schedule />
  </div>
);

export default Booking;
```

**`src/App.tsx`** -- add route:
```tsx
<Route path="/booking" element={<Booking />} />
```

**`src/pages/BlogPost.tsx`** -- update the `<a>` renderer to open `/booking` links in a new tab:
```tsx
a: ({ children, href, ...props }) => {
  const isBooking = href?.includes('/booking');
  return (
    <a
      href={href}
      {...props}
      target={isBooking ? "_blank" : undefined}
      rel={isBooking ? "noopener noreferrer" : undefined}
      className="text-accent underline ..."
    >
      {children}
    </a>
  );
},
```

### Key decisions
- The Schedule component is reused as-is (not duplicated), so updates to the homepage calendar propagate automatically
- The page has no navigation chrome -- it's a pure capture/landing page
- Blog post links to `/booking` will open in a new tab to preserve the reader's context
