

# Fix: Invite User Edge Function Crash

## Problem
The `hero-invite-user` edge function crashes because it calls `anonClient.auth.getClaims(token)`, which does not exist in supabase-js v2. The request fails with "Failed to fetch" (the function crashes before returning a response).

## Root Cause
`getClaims()` is not a method on the Supabase Auth client. The function needs to use `getUser()` instead to extract the caller's identity from the JWT.

## Fix

### File: `supabase/functions/hero-invite-user/index.ts`

Replace the authentication block that uses `getClaims` with `adminClient.auth.getUser(token)`:

```text
BEFORE (broken):
  const anonClient = createClient(SUPABASE_URL, ANON_KEY, ...);
  const { data: claimsData, error } = await anonClient.auth.getClaims(token);
  const callerAuthId = claimsData.claims.sub;

AFTER (fixed):
  const { data: { user }, error } = await adminClient.auth.getUser(token);
  const callerAuthId = user.id;
```

This removes the unnecessary `anonClient` entirely and uses the already-created `adminClient` to validate the token and get the user ID.

## Technical Details

- Single file change: `supabase/functions/hero-invite-user/index.ts`
- No database migration needed
- No frontend changes needed
- The `adminClient` (service role) can call `getUser(token)` to validate any JWT and extract user info
