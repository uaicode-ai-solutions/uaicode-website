
# Plan: AI Agent to Improve SaaS Descriptions

## Objective

Create a specialized AI agent that analyzes user descriptions and suggests an improved, more complete and structured version, ensuring all necessary information for market analysis is present.

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        StepYourIdea.tsx                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Textarea (user description)                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  "Improve with AI" Button → calls Edge Function           │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────│───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│            Edge Function: pms-improve-description               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Specialized SaaS prompt                                  │  │
│  │  → Identifies gaps in description                         │  │
│  │  → Suggests improved version (max ~400 characters)        │  │
│  │  → Uses wizard context (SaaS type, industry)              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│               Lovable AI (Gemini Flash)                          │
└─────────────────────────────────────────────────────────────────┘
```

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/pms-improve-description/index.ts` | Create | New edge function with specialized agent |
| `supabase/config.toml` | Modify | Add new function configuration |
| `src/components/planningmysaas/wizard/StepYourIdea.tsx` | Modify | Integrate button with edge function |

## 1. Edge Function: pms-improve-description

### System Prompt (English)

```typescript
const SYSTEM_PROMPT = `You are an expert in SaaS product definition and market analysis preparation.

Your task is to improve user-submitted SaaS idea descriptions to make them more suitable for comprehensive market analysis.

CRITICAL REQUIREMENTS:
- Keep the improved description under 400 characters (hard limit)
- Maintain the original idea's essence - DO NOT invent features not mentioned
- Be concise and objective
- Write in English

IDENTIFY AND ADD (if missing):
1. Core problem being solved
2. Specific target audience
3. Competitive advantage/differentiator
4. Clear value proposition

OUTPUT FORMAT:
Return ONLY valid JSON with this structure:
{
  "improvedDescription": "The enhanced description here (max 400 chars)",
  "improvements": ["List of improvements made"]
}

DO NOT include any text outside the JSON object.`;
```

### Edge Function Structure

- Receives: `description`, `saasType`, `industry`
- Returns: `{ improvedDescription: string, improvements: string[] }`
- Model: `google/gemini-3-flash-preview`
- Uses tool calling for structured output

## 2. StepYourIdea.tsx Modifications

### New State and Handler

```typescript
const [isImprovingDescription, setIsImprovingDescription] = useState(false);

const handleImproveDescription = async () => {
  if (data.description.length < 10) {
    toast.error("Please write at least 10 characters before improving");
    return;
  }
  
  setIsImprovingDescription(true);
  try {
    const { data: result, error } = await supabase.functions.invoke('pms-improve-description', {
      body: {
        description: data.description,
        saasType: data.saasType,
        industry: data.industry
      }
    });
    
    if (error) throw error;
    
    if (result?.improvedDescription) {
      onChange("description", result.improvedDescription);
      toast.success("Description improved successfully!");
    }
  } catch (error) {
    console.error("Error improving description:", error);
    toast.error("Failed to improve description. Please try again.");
  } finally {
    setIsImprovingDescription(false);
  }
};
```

### Updated Button

```typescript
<Button
  type="button"
  variant="outline"
  onClick={handleImproveDescription}
  disabled={data.description.length < 10 || isImprovingDescription}
  className="border-accent text-accent hover:bg-accent/10 hover:text-accent
             disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isImprovingDescription ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Improving...
    </>
  ) : (
    <>
      <Sparkles className="w-4 h-4 mr-2" />
      Improve with AI
    </>
  )}
</Button>
```

## 3. Config.toml Addition

```toml
[functions.pms-improve-description]
verify_jwt = false
```

## User Flow

1. User writes a basic description (e.g., "App to manage tasks")
2. Clicks "Improve with AI"
3. Button shows loading state
4. AI analyzes and returns improved version
5. Text is automatically replaced in the field
6. Success toast appears

## Transformation Example

**Before (user writes):**
> "I want to make an app to help people organize their daily tasks"

**After (AI improves):**
> "Productivity platform helping freelance professionals organize daily tasks with smart prioritization. Solves task overload and missed deadline issues. Differentiator: calendar integration and context-aware location-based reminders."

## Technical Details

- **Model**: google/gemini-3-flash-preview (fast and cost-effective)
- **Character limit**: 400 max for improved description
- **Minimum requirement**: 10 characters to enable button
- **Additional context**: uses saasType and industry for better understanding
- **Error handling**: Rate limit (429) and payment (402) errors properly surfaced
