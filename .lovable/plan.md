
# Simplificar Orchestrador LP: Chamada Unica ao n8n

## Contexto

O orchestrador atual (`pms-orchestrate-lp-report`) faz 15 chamadas sequenciais ao webhook do n8n, uma para cada step. A nova abordagem delega todo o controle de fluxo ao n8n -- o Edge Function faz apenas **uma unica chamada** passando o `wizard_id`.

## Alteracoes

### Arquivo: `supabase/functions/pms-orchestrate-lp-report/index.ts`

Reescrever para:

1. **Remover** toda a logica de loop sequencial (`TOOLS_SEQUENCE`, `processReportSteps`, delays, shutdown listener)
2. **Manter** o `getWebhookUrl()` para resolver a URL do webhook
3. **Manter** CORS headers
4. **Nova logica**: Uma unica chamada POST ao webhook com `{ wizard_id }`, fire-and-forget via `EdgeRuntime.waitUntil()`
5. **Manter** tratamento de erro basico: se o fetch falhar, logar o erro (o n8n agora e responsavel por atualizar status no banco)
6. **Remover** toda a logica de snapshots/share token pos-completacao (o n8n tambem vai controlar isso, ou podemos manter como um segundo webhook call -- mas pela sua instrucao, tudo fica no n8n)

### Resultado final

O Edge Function fica com ~60 linhas:
- Recebe `wizard_id` do frontend
- Faz um unico POST ao webhook n8n com `{ wizard_id }`
- Retorna 202 imediatamente
- O n8n controla todo o fluxo internamente (steps, status updates, snapshots, share token)

### Consideracao

Os snapshots (`wizard_snapshot`, `marketing_snapshot`, `share_token`) que eram gerados no Edge Function apos todos os steps -- voce vai gerar isso no n8n tambem? Se sim, removo completamente. Se nao, posso manter uma segunda chamada pos-webhook para gerar os snapshots.

**Assumindo que o n8n vai controlar tudo**, vou remover toda a logica de snapshots do Edge Function.
