

# Fix: Botao de reprocessar nao chama o n8n

## Problema
O `supabase.functions.invoke("pms-orchestrate-lp-report")` esta retornando "Failed to fetch" nos network logs. A edge function faz boot mas nao processa nenhum request. Isso indica que a chamada do cliente nao esta chegando corretamente na funcao.

## Causa raiz
O `supabase.functions.invoke` pode nao estar enviando corretamente os headers necessarios (Authorization, apikey) ou esta sendo bloqueado pelo contexto do iframe de preview. Os logs da edge function mostram apenas boot/shutdown sem nenhum request processado.

## Solucao

**Arquivo:** `src/components/hero/mock/PlanningMySaasOverview.tsx`

Substituir `supabase.functions.invoke` por um `fetch` direto com headers explicitos:

```typescript
// Antes (linha 126-128):
await supabase.functions.invoke("pms-orchestrate-lp-report", {
  body: { wizard_id: wizardId },
});

// Depois:
const SUPABASE_URL = "https://ccjnxselfgdoeyyuziwt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

try {
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/pms-orchestrate-lp-report`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ wizard_id: wizardId }),
    }
  );
  console.log("Edge function response:", res.status);
} catch (err) {
  console.error("Edge function call failed:", err);
}
```

Como a funcao tem `verify_jwt = false`, nao precisa de token do usuario — basta o anon key. As constantes SUPABASE_URL e SUPABASE_ANON_KEY ja existem em `src/integrations/supabase/client.ts` e podem ser importadas ou referenciadas diretamente.

Tambem adicionar um `toast` de erro caso o fetch falhe, para o admin saber que algo deu errado, e um toast de sucesso quando o polling detectar "completed".

