
# Plan: Create Dedicated "Email Kyle" Components for Sales Team

## Overview
Create completely separate components for the "Email Kyle" form to isolate sales-specific functionality without touching the existing `EmailContactDialog` or `send-email-contact` edge function.

## New Files to Create

### 1. New Edge Function: `supabase/functions/pms-email-kyle/index.ts`

A dedicated edge function that **ONLY** sends emails to `sales@uaicode.ai`:

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface EmailKyleFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  reportId?: string;
  projectName?: string;
}

serve(async (req) => {
  // CORS handling
  // Validate input
  // Send confirmation email to client
  // Send notification to sales@uaicode.ai
  // Return success/error response
});
```

**Key differences from existing function:**
- Hardcoded destination: `sales@uaicode.ai` (no source routing logic)
- Includes report context (reportId, projectName) for better sales context
- Separate email templates branded for Kyle/Sales team

### 2. New Dialog Component: `src/components/planningmysaas/dashboard/EmailKyleDialog.tsx`

A dedicated dialog component for the "Email Kyle" form:

```typescript
// Completely separate from EmailContactDialog
// Uses pms-email-kyle edge function
// Includes report context (projectName from ReportContext)
// Kyle-branded UI (avatar, messaging)
```

**Structure:**
- Zod validation schema (same validation rules)
- Form with: Name, Email, Phone, Message
- Calls `pms-email-kyle` edge function
- Success/error handling with toast notifications
- Kyle avatar and sales-focused copy

## Files to Modify

### 3. Update: `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx`

Replace `EmailContactDialog` import and usage with new `EmailKyleDialog`:

**Changes:**
- Line 41: Change import from `EmailContactDialog` to `EmailKyleDialog`
- Lines 832-836: Replace `<EmailContactDialog ... />` with `<EmailKyleDialog ... />`

## Implementation Summary

| Component | Purpose | Destination |
|-----------|---------|-------------|
| `EmailContactDialog` (existing) | General website contact | `hello@uaicode.ai` or `sales@uaicode.ai` based on source |
| `EmailKyleDialog` (new) | Kyle/Sales contact from Report | Always `sales@uaicode.ai` |

| Edge Function | Purpose |
|---------------|---------|
| `send-email-contact` (existing) | General contact with source routing |
| `pms-email-kyle` (new) | Dedicated sales contact |

## What Stays Unchanged
- `EmailContactDialog.tsx` - completely untouched
- `send-email-contact/index.ts` - completely untouched
- All other usages of `EmailContactDialog` elsewhere
- All other NextStepsSection functionality

## Technical Details

### New Files
1. `supabase/functions/pms-email-kyle/index.ts` (~100 lines)
2. `src/components/planningmysaas/dashboard/EmailKyleDialog.tsx` (~250 lines)

### Modified Files
1. `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx` (2 line changes)

### Dependencies Used
- Existing: zod, react-hook-form, Resend API, supabase client
- No new dependencies required
