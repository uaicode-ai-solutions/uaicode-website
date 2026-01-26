

# Plano: Agente de IA para Geração de Nomes de SaaS com Popup de Confirmação

## Resumo

Criar um agente de IA especializado em branding que gera nomes memoráveis para SaaS. Assim como a melhoria de descrição, o nome sugerido será apresentado em um popup para o usuário aprovar antes de ser aplicado.

## Fluxo do Usuário

```text
[Usuário preenche descrição do SaaS]
         |
         v
[Clica "Suggest with AI" no campo Nome]
         |
         v
[Loading... IA analisa descrição]
         |
         v
[Popup abre com sugestão de nome]
    |           |
    v           v
[Aplicar]   [Cancelar]
    |           |
    v           v
[Nome        [Popup fecha,
aplicado]    campo vazio]
```

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/functions/pms-suggest-name/index.ts` | Criar (novo) |
| `supabase/config.toml` | Modificar (adicionar função) |
| `src/components/planningmysaas/wizard/StepYourIdea.tsx` | Modificar |

---

## 1. Edge Function: `pms-suggest-name`

**Arquivo:** `supabase/functions/pms-suggest-name/index.ts`

O agente será um especialista em branding com foco em:
- Nomes curtos e memoráveis (1 palavra ideal, 2 aceitável, 3 máximo)
- Fáceis de pronunciar e soletrar
- Modernos e profissionais
- Evitar nomes genéricos ou muito usados

**System Prompt:**
```text
You are an expert SaaS naming consultant with deep knowledge in:
- Brand strategy and positioning
- Tech startup naming conventions  
- Linguistic principles (phonetics, memorability)
- Marketing psychology

NAMING RULES (STRICT):
1. IDEAL: 1 word (e.g., Slack, Zoom, Stripe, Notion)
2. ACCEPTABLE: 2 words (e.g., DropBox, HubSpot, MailChimp)
3. MAXIMUM: 3 words only if absolutely necessary
4. NEVER exceed 3 words

PRINCIPLES:
- Easy to spell and pronounce
- Memorable and distinctive
- Evokes the product's value or benefit
- Modern and professional sound
- Avoid generic tech terms as standalone (Cloud, Hub, Pro)

Return ONLY the suggested name, nothing else.
```

**Input:**
```json
{
  "description": "A healthcare marketplace...",
  "saasType": "ecommerce",
  "industry": "healthcare"
}
```

**Output:**
```json
{
  "suggestedName": "MediFlow"
}
```

---

## 2. Atualizar config.toml

Adicionar:
```toml
[functions.pms-suggest-name]
verify_jwt = false
```

---

## 3. Atualizar Frontend: `StepYourIdea.tsx`

### Novos Estados

```typescript
const [showNameDialog, setShowNameDialog] = useState(false);
const [suggestedName, setSuggestedName] = useState("");
```

### Nova Função de Aplicar Nome

```typescript
const handleApplyName = () => {
  onChange("saasName", suggestedName);
  setShowNameDialog(false);
  setSuggestedName("");
  toast.success("Name applied!");
};
```

### Atualizar `handleSuggestName`

Substituir a lógica mock atual por chamada real à Edge Function:

```typescript
const handleSuggestName = async (retryCount = 0) => {
  if (!isDescriptionValid) {
    toast.error("Please fill in the description first (min 20 characters)");
    return;
  }
  
  setIsGeneratingName(true);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  
  try {
    const response = await fetch(
      'https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-suggest-name',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': '...'
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
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const result = await response.json();
    
    if (result?.suggestedName) {
      setSuggestedName(result.suggestedName);
      setShowNameDialog(true); // Abre o popup
    }
  } catch (error) {
    // Retry logic para cold starts
    if (retryCount < 2 && ...) {
      return handleSuggestName(retryCount + 1);
    }
    toast.error("Failed to suggest name. Please try again.");
  } finally {
    setIsGeneratingName(false);
  }
};
```

### Novo Dialog para Nome

```tsx
<AlertDialog open={showNameDialog} onOpenChange={setShowNameDialog}>
  <AlertDialogContent className="max-w-md">
    <AlertDialogHeader>
      <AlertDialogTitle className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-accent" />
        AI Name Suggestion
      </AlertDialogTitle>
      <AlertDialogDescription>
        Based on your description, here's a suggested name for your SaaS
      </AlertDialogDescription>
    </AlertDialogHeader>
    
    <div className="my-6 text-center">
      <div className="inline-block px-6 py-4 bg-accent/10 border border-accent/30 rounded-xl">
        <span className="text-2xl font-bold text-foreground">{suggestedName}</span>
      </div>
    </div>
    
    <AlertDialogFooter>
      <AlertDialogCancel>Try Another</AlertDialogCancel>
      <AlertDialogAction onClick={handleApplyName} className="bg-accent hover:bg-accent/90">
        Use This Name
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Design do Popup de Nome

O popup será mais simples que o de descrição:
- Foco total no nome sugerido (destaque grande e centralizado)
- Fundo com cor accent suave
- Botão "Use This Name" para aplicar
- Botão "Try Another" para gerar novo nome (fecha o popup e permite clicar novamente)

---

## Resultado Esperado

1. Usuário escreve descrição do SaaS (mínimo 20 caracteres)
2. Clica em "Suggest with AI" no campo de nome
3. Loading aparece enquanto IA processa
4. Popup abre mostrando o nome sugerido em destaque
5. Usuário escolhe:
   - "Use This Name" → Nome é aplicado no campo
   - "Try Another" → Popup fecha, pode clicar novamente para nova sugestão

