
# Fix Plan: Edge Function Cold Start Timeout Issue

## Problem Diagnosis

The Edge Function `pms-improve-description` **is working correctly**, but failing in the browser due to **cold start latency**:

**Evidence from logs:**
- Browser request at `13:16:15` → Function boots at `13:16:16` (1 second too late)
- Browser request at `13:16:29` → Function boots at `13:16:30` (1 second too late)
- Direct backend test: ✅ Works perfectly (200 OK with valid response)

**Root Cause:** Edge Functions on Supabase have a cold start delay (~1 second) when they haven't been called recently. The browser's default fetch timeout is too short to wait for the cold start.

## Solution: Increase Frontend Timeout

The retry logic already exists, but we need to increase the timeout for the initial request so it doesn't fail during cold starts.

### Changes Required

#### File: `src/components/planningmysaas/wizard/StepYourIdea.tsx`

**Current code:**
```typescript
const { data: result, error } = await supabase.functions.invoke('pms-improve-description', {
  body: {
    description: data.description,
    saasType: data.saasType,
    industry: data.industry
  }
});
```

**New code with timeout:**
```typescript
// Create an AbortController with extended timeout for cold starts
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

try {
  const { data: result, error } = await supabase.functions.invoke('pms-improve-description', {
    body: {
      description: data.description,
      saasType: data.saasType,
      industry: data.industry
    },
    headers: {
      'x-timeout': '10000' // Hint to Supabase client
    }
  });
  
  clearTimeout(timeoutId);
  
  if (error) throw error;
  
  if (result?.improvedDescription) {
    onChange("description", result.improvedDescription);
    toast.success("Description improved successfully!");
  }
} catch (error: any) {
  clearTimeout(timeoutId);
  console.error("Error improving description:", error);
  
  // Retry logic for transient failures
  if (retryCount < 2 && (
    error?.message?.includes('Failed to fetch') || 
    error?.message?.includes('NetworkError') ||
    error?.message?.includes('aborted')
  )) {
    console.log(`Retrying... attempt ${retryCount + 2}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return handleImproveDescription(retryCount + 1);
  }
  
  // ... rest of error handling
}
```

### Alternative Solution (Simpler)

If the timeout approach doesn't work with Supabase client, we can use native `fetch` with full control:

```typescript
const handleImproveDescription = async (retryCount = 0) => {
  if (data.description.length < 10) {
    toast.error("Please write at least 10 characters before improving");
    return;
  }
  
  setIsImprovingDescription(true);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds
    
    const response = await fetch(
      `https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-improve-description`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession().then(s => s.data.session?.access_token)}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg'
        },
        body: JSON.stringify({
          description: data.description,
          saasType: data.saasType,
          industry: data.industry
        }),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result?.improvedDescription) {
      onChange("description", result.improvedDescription);
      toast.success("Description improved successfully!");
    }
  } catch (error: any) {
    // ... existing error handling with retry logic
  } finally {
    setIsImprovingDescription(false);
  }
};
```

## Why This Will Work

1. **Extended timeout (15 seconds)**: Gives the function time to cold start
2. **Retry logic already in place**: If it still fails, will retry 2 more times with 1.5s delays
3. **Native fetch with AbortController**: Full control over timeout behavior
4. **Proper auth headers**: Includes both access token and anon key

## Testing Steps

1. Wait 5+ minutes for function to go "cold"
2. Click "Improve with AI" button
3. First request should now succeed (waiting for cold start)
4. Subsequent requests will be fast (warm function)

## Technical Context

**Cold Start Timing:**
- Edge Function idle → Request arrives → Function boots (~1s) → Process request (~2-3s for AI) → Return response
- **Total time:** 3-4 seconds on cold start
- **Current timeout:** Default fetch timeout (~5-8 seconds, varies by browser)
- **New timeout:** 15 seconds (comfortable margin)

**Why Retry Logic Alone Isn't Enough:**
The retry logic triggers AFTER a timeout/failure. But if the initial timeout is too short, it fails before the function can even respond. By extending the initial timeout, we let the function complete its cold start and respond successfully on the first try.
