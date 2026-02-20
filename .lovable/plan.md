

# Fix: Screen Auto-Refresh + Emails Going to Spam

## Issue 1: Screen keeps refreshing by itself

**Root cause**: The `useHeroAuth` hook (line 36 in `useHeroAuth.ts`) has `[user, authLoading]` as its `useEffect` dependencies. Supabase's `onAuthStateChange` fires periodically for `TOKEN_REFRESHED` events, which creates a **new `user` object reference** each time. This triggers the effect, which sets `loading: true`, showing the loading spinner briefly -- appearing as a "screen refresh."

**Fix**: Change the dependency from `user` (object reference) to `user?.id` (stable string). This way the effect only re-runs when the user actually changes (login/logout), not on every token refresh.

### File: `src/hooks/useHeroAuth.ts`

- Line 36: change `[user, authLoading]` to `[user?.id, authLoading]`
- This stabilizes the dependency and prevents unnecessary re-fetches on token refresh events

---

## Issue 2: Emails arriving as spam

**Root cause**: This is a **DNS/email authentication** issue, not a code issue. For emails sent from `noreply@uaicode.ai` via Resend to land in the inbox reliably, the domain `uaicode.ai` needs proper email authentication records configured.

**What needs to be done (outside of code)**:

1. Log into the **Resend dashboard** at [resend.com/domains](https://resend.com/domains)
2. Verify that the domain `uaicode.ai` has all 3 DNS records properly configured:
   - **SPF** record -- authorizes Resend to send emails on behalf of your domain
   - **DKIM** record -- digitally signs emails to prove authenticity
   - **DMARC** record -- tells email providers how to handle unauthenticated emails
3. Resend provides these exact DNS values when you add/verify a domain. All 3 must show a green checkmark.

**Code-level improvement** (optional, helps reduce spam score):

Add a `List-Unsubscribe` header to transactional emails. This signals to email providers like Gmail that the sender follows best practices. I'll update the invite email function as an example.

### File: `supabase/functions/hero-invite-user/index.ts`

- Add `headers` with `List-Unsubscribe` to the Resend API call body

### File: `supabase/functions/pms-send-welcome-email/index.ts`

- Add `headers` with `List-Unsubscribe` to the Resend API call body

---

## Summary of code changes

| File | Change |
|---|---|
| `src/hooks/useHeroAuth.ts` | Change `useEffect` dependency from `[user, authLoading]` to `[user?.id, authLoading]` |
| `supabase/functions/hero-invite-user/index.ts` | Add `List-Unsubscribe` header to Resend API call |
| `supabase/functions/pms-send-welcome-email/index.ts` | Add `List-Unsubscribe` header to Resend API call |

## Action required from you (for email spam)

The most impactful fix is verifying DNS records in the Resend dashboard. Without proper SPF, DKIM, and DMARC, emails will continue going to spam regardless of code changes. Go to **resend.com/domains** and check the status of `uaicode.ai`.

