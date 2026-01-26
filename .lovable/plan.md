

# Plano: Adicionar Justificativa de Branding ao Popup de Nome

## Resumo

Modificar o agente de IA e o popup para incluir uma breve justificativa de marketing/branding explicando o porquê do nome sugerido. A justificativa será uma única frase curta que aparecerá abaixo do nome no popup.

## Fluxo Visual

```text
┌─────────────────────────────────────────────┐
│  ✨ AI Name Suggestion                      │
│                                             │
│  Based on your description, here's a        │
│  suggested name for your SaaS               │
│                                             │
│         ┌──────────────────────┐            │
│         │     MediFlow         │            │
│         └──────────────────────┘            │
│                                             │
│  "Combines 'Medi' (medical) with 'Flow'     │
│   to convey seamless healthcare delivery"   │
│                                             │
│         [Try Another]  [Use This Name]      │
└─────────────────────────────────────────────┘
```

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/functions/pms-suggest-name/index.ts` | Modificar (adicionar tool calling para retornar nome + justificativa) |
| `src/components/planningmysaas/wizard/StepYourIdea.tsx` | Modificar (adicionar estado para razão e exibir no popup) |

---

## 1. Modificar Edge Function: `pms-suggest-name`

### Mudanças no System Prompt

Adicionar instrução para retornar também uma justificativa curta:

```text
RESPONSE FORMAT:
Return the name AND a brief branding rationale (one sentence, max 15 words).
The rationale should explain the strategic thinking behind the name choice.
```

### Usar Tool Calling

Ao invés de retornar texto puro, usar tool calling para estruturar a resposta:

```typescript
body: JSON.stringify({
  model: "google/gemini-2.5-flash",
  messages: [...],
  tools: [
    {
      type: "function",
      function: {
        name: "suggest_name",
        description: "Return the suggested SaaS name with branding rationale",
        parameters: {
          type: "object",
          properties: {
            suggestedName: {
              type: "string",
              description: "The suggested name (1-3 words max)"
            },
            rationale: {
              type: "string", 
              description: "Brief branding rationale explaining the name (max 15 words)"
            }
          },
          required: ["suggestedName", "rationale"],
          additionalProperties: false
        }
      }
    }
  ],
  tool_choice: { type: "function", function: { name: "suggest_name" } }
})
```

### Output Atualizado

```json
{
  "suggestedName": "MediFlow",
  "rationale": "Combines 'Medi' (medical) with 'Flow' to convey seamless healthcare delivery"
}
```

---

## 2. Modificar Frontend: `StepYourIdea.tsx`

### Novo Estado

Adicionar estado para armazenar a justificativa:

```typescript
const [suggestedNameRationale, setSuggestedNameRationale] = useState("");
```

### Atualizar `handleSuggestName`

Ao receber a resposta, guardar também a justificativa:

```typescript
if (result?.suggestedName) {
  setSuggestedName(result.suggestedName);
  setSuggestedNameRationale(result.rationale || "");
  setShowNameDialog(true);
}
```

### Atualizar `handleApplyName`

Limpar também a justificativa ao aplicar:

```typescript
const handleApplyName = () => {
  onChange("saasName", suggestedName);
  setShowNameDialog(false);
  setSuggestedName("");
  setSuggestedNameRationale("");
  toast.success("Name applied!");
};
```

### Atualizar o Dialog

Adicionar a justificativa abaixo do nome:

```tsx
<div className="my-6 text-center">
  <div className="inline-block px-6 py-4 bg-accent/10 border border-accent/30 rounded-xl">
    <span className="text-2xl font-bold text-foreground">{suggestedName}</span>
  </div>
  
  {/* Justificativa de branding */}
  {suggestedNameRationale && (
    <p className="mt-4 text-sm text-muted-foreground italic max-w-sm mx-auto">
      "{suggestedNameRationale}"
    </p>
  )}
</div>
```

---

## Resultado Esperado

1. Usuário clica em "Suggest with AI"
2. IA gera nome + justificativa curta
3. Popup exibe:
   - Nome em destaque (grande, centralizado)
   - Justificativa de branding em itálico abaixo (frase curta explicando o porquê)
4. Usuário decide aplicar ou tentar outro

