

## Corrigir URL do webhook n8n na edge function

### Problema

A edge function `pms-lp-wizard-submit` tem uma logica de fallback que usa o dominio antigo `https://n8n.uaicode.dev/webhook/` para construir a URL do webhook quando a secret `WEBHOOK_PMS_LP_WIZARD_GENERATE_REPORT` contem um JSON ou apenas o path. A URL correta e `https://uaicode-n8n.ax5vln.easypanel.host/webhook/...`.

### Solucao recomendada

A forma mais simples e segura de resolver e **atualizar a secret** `WEBHOOK_PMS_LP_WIZARD_GENERATE_REPORT` para conter a URL completa:

```
https://uaicode-n8n.ax5vln.easypanel.host/webhook/webhook-pms-lp-wizard-generate-report
```

Isso faz com que a condicao da linha 90 (`webhookSecret.startsWith("http")`) capture o valor diretamente, sem passar pelos fallbacks com dominio errado.

### Adicionalmente: corrigir o dominio hardcoded nas edge functions

Para evitar problemas futuros caso alguem use o formato JSON ou path, atualizar o dominio base nas duas edge functions afetadas:

**Arquivo 1:** `supabase/functions/pms-lp-wizard-submit/index.ts`
- Linha 106: trocar `https://n8n.uaicode.dev/webhook/` por `https://uaicode-n8n.ax5vln.easypanel.host/webhook/`
- Linha 116: mesma troca

**Arquivo 2:** `supabase/functions/pms-webhook-new-leads/index.ts`
- Linha com `https://n8n.uaicode.dev/webhook/`: mesma troca

### Tambem: melhorar logging do webhook

Adicionar log da resposta do webhook para facilitar debug futuro (em vez de fire-and-forget silencioso):

```typescript
// Antes (fire-and-forget)
fetch(webhookUrl, { ... }).catch((err) => console.error("Webhook failed:", err));

// Depois (com logging)
fetch(webhookUrl, { ... })
  .then((res) => console.log("Webhook response:", res.status, res.statusText))
  .catch((err) => console.error("Webhook failed:", err));
```

### Acao imediata do usuario

Verificar e atualizar a secret `WEBHOOK_PMS_LP_WIZARD_GENERATE_REPORT` no painel do Supabase para conter a URL completa correta. Isso resolve o problema independentemente das correcoes no codigo.
