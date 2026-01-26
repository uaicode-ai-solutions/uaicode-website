
# Plano: Simplificar Fluxo de Geração de Relatório para n8n

## Contexto do Problema

O sistema atual tem um fluxo duplicado e conflitante:
- O **Frontend** chama diretamente `pms-generate-report`
- O **Database Trigger** chama `pms-webhook-new-report` que também chama `pms-generate-report`
- O **n8n** deveria ser o único responsável por toda a geração

A secret `REPORT_NEWREPORT_WEBHOOK_ID` não está configurada, o que impede o webhook do n8n de funcionar.

## Fluxo Correto Desejado

```text
┌──────────────────────────────────────────────────────────────────┐
│  WIZARD SUBMIT                                                   │
│  ┌─────────────────┐                                             │
│  │ PmsWizard.tsx   │                                             │
│  │ handleSubmit()  │                                             │
│  └────────┬────────┘                                             │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                             │
│  │ INSERT INTO     │                                             │
│  │ tb_pms_wizard   │                                             │
│  └────────┬────────┘                                             │
│           │                                                      │
│           ▼ (Database Trigger)                                   │
│  ┌─────────────────────────────────────────┐                     │
│  │ notify_pms_wizard_created_webhook()     │                     │
│  │ -> POST to pms-webhook-new-report       │                     │
│  └────────┬────────────────────────────────┘                     │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────────────────────────────┐                     │
│  │ pms-webhook-new-report                  │                     │
│  │ -> POST to n8n webhook                  │                     │
│  │    (REPORT_NEWREPORT_WEBHOOK_ID)        │                     │
│  └────────┬────────────────────────────────┘                     │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────────────────────────────┐                     │
│  │ n8n WORKFLOW                            │                     │
│  │ - Busca dados wizard/user               │                     │
│  │ - Pesquisa Perplexity                   │                     │
│  │ - Gera seções do relatório              │                     │
│  │ - CREATE em tb_pms_reports              │                     │
│  │ - UPDATE status para "Created"          │                     │
│  └─────────────────────────────────────────┘                     │
└──────────────────────────────────────────────────────────────────┘
```

## Alterações Necessárias

### 1. Adicionar Secret do Webhook n8n

Adicionar a secret `REPORT_NEWREPORT_WEBHOOK_ID` com a URL completa do webhook do n8n.

### 2. Frontend: Remover Chamada Direta

**Arquivo**: `src/pages/PmsWizard.tsx`

Remover as linhas 314-324 que chamam `pms-generate-report` diretamente. O database trigger já vai cuidar disso automaticamente.

**Código a remover**:
```typescript
// 3. Trigger AI report generation (async - don't wait)
console.log("Triggering AI report generation...");
supabase.functions.invoke('pms-generate-report', {
  body: { reportId }
}).then(({ error }) => {
  if (error) {
    console.error("AI report generation error:", error);
  } else {
    console.log("AI report generation started successfully");
  }
}).catch((err) => {
  console.error("Failed to trigger AI report generation:", err);
});
```

### 3. Edge Function: Simplificar pms-webhook-new-report

**Arquivo**: `supabase/functions/pms-webhook-new-report/index.ts`

Remover a chamada a `pms-generate-report` (linhas 206-217). A função deve apenas:
1. Receber o `wizard_id` do database trigger
2. Buscar dados do wizard e user
3. Enviar para o webhook do n8n
4. Retornar sucesso imediatamente

**Código a remover** (linhas 206-217):
```typescript
// 2. Report Generation (main process) - must run regardless of webhook
(async () => {
  try {
    console.log("Starting report generation for wizard:", wizardId);
    await callInternalFunction("pms-generate-report", { wizardId: wizardId });
    console.log("Report generation started successfully for wizard:", wizardId);
    return { success: true };
  } catch (error) {
    console.error("Report generation call failed:", error);
    throw error;
  }
})()
```

### 4. (Opcional) Deprecar/Remover pms-generate-report

**Arquivo**: `supabase/functions/pms-generate-report/index.ts`

Se o n8n é responsável por toda a geração, esta função de 700+ linhas pode ser:
- Removida completamente, ou
- Simplificada para ser apenas um fallback

**Recomendação**: Manter temporariamente como fallback mas não chamá-la diretamente.

## Resumo das Mudanças

| Item | Ação | Prioridade |
|------|------|------------|
| Secret `REPORT_NEWREPORT_WEBHOOK_ID` | Adicionar | Alta |
| `PmsWizard.tsx` linhas 312-324 | Remover chamada a `pms-generate-report` | Alta |
| `pms-webhook-new-report` linhas 206-217 | Remover chamada a `pms-generate-report` | Alta |
| `pms-generate-report` | Manter como fallback (não chamar) | Baixa |

## Seção Técnica

### Mudança no pms-webhook-new-report

O `Promise.allSettled` atual (linhas 141-218) executa duas operações em paralelo:
1. Webhook n8n (correto)
2. Chamada a `pms-generate-report` (incorreto)

A mudança simplifica para executar apenas o webhook do n8n:

```typescript
const handler = async (req: Request): Promise<Response> => {
  // ... validação e fetch de dados ...
  
  try {
    // Enviar apenas para n8n
    const webhookUrl = getWebhookUrl();
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook failed: ${webhookResponse.status}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Report generation triggered" }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: corsHeaders }
    );
  }
};
```

### Dependência de Secret

A função `getWebhookUrl()` (linhas 64-73) já está correta, mas requer que `REPORT_NEWREPORT_WEBHOOK_ID` esteja configurada nas secrets do Supabase.
