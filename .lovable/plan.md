

# Fix: Post-Password-Reset Redirect, User Status, and Infinite Refresh

## Problems Identified

1. **Wrong redirect after password change**: `HeroResetPassword.tsx` line 201 sends the user to `/hero/home` instead of a profile completion page.
2. **User status stays "Invited"**: Status is derived from `full_name` being non-empty (in `useHeroUsers.ts`). There is **no Hero profile page** where invited users can fill in their name -- so it stays empty forever.
3. **Screen keeps refreshing**: After `updatePassword()` is called, Supabase fires `USER_UPDATED` and `SIGNED_IN` auth events. The `onAuthStateChange` listener in `useAuth.ts` triggers `fetchPmsUserData` + `sendWelcomeEmailIfNew` on every `SIGNED_IN` event. The `useHeroAuth` hook re-runs its `useEffect` whenever `user` changes, causing cascading re-renders. Additionally, the `HeroResetPassword` page has its own `onAuthStateChange` listener that also reacts to `SIGNED_IN`, potentially conflicting.

## Solution

### 1. Create a Hero Profile Page (`src/pages/hero/HeroProfile.tsx`)

A new page where Hero users can view and edit their profile (full name, avatar). This is the missing piece -- invited users currently have no way to fill in their `full_name`.

- Form fields: Full Name (required), Avatar upload (optional)
- On save: updates `tb_hero_users` table via Supabase client (RLS allows `hero_users_update_own`)
- Styled consistently with the Hero Ecosystem dark theme
- Accessible at `/hero/profile`

### 2. Add Route and Navigation

- **`src/App.tsx`**: Add route `/hero/profile` wrapped in `<HeroRoute>`
- **`src/components/hero/HeroHeader.tsx`**: Add "Profile" menu item in the dropdown (between Home and Sign Out)

### 3. Fix Redirect After Password Reset

- **`src/pages/hero/HeroResetPassword.tsx`**: Change the success state redirect from `/hero/home` to `/hero/profile` so users complete their profile after setting their password

### 4. Fix Infinite Refresh Loop

- **`src/pages/hero/HeroResetPassword.tsx`**: After successful password update, unsubscribe from `onAuthStateChange` and set a flag to prevent re-processing auth events. The current listener reacts to `SIGNED_IN` events that fire after `updateUser()`, causing state oscillation.
- **`src/hooks/useHeroAuth.ts`**: Add a `ref` guard to prevent concurrent `fetchHeroData` calls from overlapping when auth state changes rapidly.

## Technical Details

| File | Change |
|---|---|
| `src/pages/hero/HeroProfile.tsx` | New file -- Hero user profile editor |
| `src/App.tsx` | Add `/hero/profile` route |
| `src/components/hero/HeroHeader.tsx` | Add "Profile" link to dropdown menu |
| `src/pages/hero/HeroResetPassword.tsx` | Change redirect to `/hero/profile`; fix auth listener to prevent re-render loops |
| `src/hooks/useHeroAuth.ts` | Add fetch guard to prevent concurrent/overlapping data fetches |

### How "Approved" Status Works

No backend change is needed. Status is already derived in `useHeroUsers.ts`:
```text
status = user.full_name.trim() ? 'approved' : 'invited'
```
Once the user fills in their name on the new profile page, their status automatically becomes "Approved" in the admin User Management view.

