

# Fix: hero-invite-user - Auth Validation Failing (401)

## Problem
The edge function analytics confirm every POST request returns **401 "Invalid token"**. The `adminClient.auth.getUser(token)` call fails because the service role client created with `createClient(URL, SERVICE_ROLE_KEY)` does not correctly validate user JWTs when passing a token parameter to `getUser()`.

The client-side error "Failed to send a request to the Edge Function" is the supabase-js wrapper for this 401 response.

## Root Cause
The admin client is initialized with the service role key as the API key. When calling `getUser(token)`, the library behavior with service role clients doesn't reliably resolve user tokens. This is a known pattern issue -- Supabase recommends creating a separate client with the user's token for auth validation.

## Solution

### File: `supabase/functions/hero-invite-user/index.ts`

Create a **user-scoped client** (with anon key + user's Authorization header) for JWT validation, and keep the admin client only for privileged operations:

```text
BEFORE (broken):
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: { user: callerUser }, error } = await adminClient.auth.getUser(token);

AFTER (fixed):
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } }
  });
  const { data: { user: callerUser }, error } = await userClient.auth.getUser();
```

Key changes:
- Add `SUPABASE_ANON_KEY` env var (available by default in all edge functions)
- Create `userClient` with anon key and user's Authorization header
- Call `getUser()` without parameter on the user client (uses the session token from headers)
- Keep `adminClient` for all admin operations (createUser, insert, generateLink, etc.)

## Technical Details

| Aspect | Detail |
|---|---|
| File changed | `supabase/functions/hero-invite-user/index.ts` |
| Root cause | `adminClient.auth.getUser(token)` not validating user JWTs correctly |
| Fix | Separate user-scoped client for JWT validation |
| Backend change only | No frontend changes needed |
| Redeploy | Yes, edge function will be redeployed automatically |

