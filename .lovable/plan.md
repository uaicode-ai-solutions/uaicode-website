

# Plano: Corrigir Edge Function `pms-orchestrate-report`

## Problema Identificado

A Edge Function `pms-orchestrate-report` tem duas diferenças críticas em relação às funções que funcionam (`pms-webhook-new-report` e `pms-trigger-n8n-report`):

1. **CORS Headers incompletos**: Falta o header `x-session-id` que o cliente Supabase envia
2. **Estrutura do código**: A função existente precisa de pequenos ajustes para garantir compatibilidade

## Correções Necessárias

### Arquivo: `supabase/functions/pms-orchestrate-report/index.ts`

**Alteração 1 - Headers CORS (linha 5)**

De:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
```

Para:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
```

**Alteração 2 - Função getWebhookUrl (adicionar após corsHeaders)**

Adicionar helper function para tratar URL do webhook (copiado da função que funciona):

```typescript
const getWebhookUrl = (): string => {
  const webhookId = Deno.env.get("REPORT_NEWREPORT_WEBHOOK_ID");
  if (!webhookId) {
    throw new Error("REPORT_NEWREPORT_WEBHOOK_ID not configured");
  }
  // Se já é URL completa, retorna direto
  if (webhookId.startsWith("http")) {
    return webhookId;
  }
  // Caso contrário, monta a URL
  return `https://n8n.uaicode.dev/webhook/${webhookId}`;
};
```

**Alteração 3 - Usar getWebhookUrl() no lugar de Deno.env.get direto**

Substituir:
```typescript
const webhookUrl = Deno.env.get("REPORT_NEWREPORT_WEBHOOK_ID")!;
```

Por:
```typescript
const webhookUrl = getWebhookUrl();
```

**Alteração 4 - Remover verificação redundante**

Remover o bloco de verificação após `getWebhookUrl()` já que a função já lança erro se não estiver configurado.

## Código Final Corrigido

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Sequência de tools na ordem correta
const TOOLS_SEQUENCE = [
  { id: 0, tool_name: "Create_Report_Row", label: "Initialize Report", field: null },
  { id: 1, tool_name: "Call_Get_Investment_Tool_", label: "Investment Analysis", field: "section_investment" },
  // ... restante igual
];

const getWebhookUrl = (): string => {
  const webhookId = Deno.env.get("REPORT_NEWREPORT_WEBHOOK_ID");
  if (!webhookId) {
    throw new Error("REPORT_NEWREPORT_WEBHOOK_ID not configured");
  }
  if (webhookId.startsWith("http")) {
    return webhookId;
  }
  return `https://n8n.uaicode.dev/webhook/${webhookId}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const webhookUrl = getWebhookUrl();
    const { wizard_id } = await req.json();
    
    // ... resto do código igual
  }
});
```

## Resumo das Alterações

| Linha | Alteração | Motivo |
|-------|-----------|--------|
| 5 | Adicionar `x-session-id` ao CORS | Cliente Supabase envia este header |
| Nova | Adicionar `getWebhookUrl()` | Tratar URL completa ou apenas ID |
| 67 | Usar `getWebhookUrl()` | Consistência com outras funções |

## Após Implementação

1. A função será automaticamente redeployada
2. Testar clicando em "Regenerate" no dashboard
3. Verificar logs da Edge Function para confirmar execução
4. Confirmar que n8n recebe as chamadas POST

