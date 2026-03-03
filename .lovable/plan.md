

# Fix: Reprocessamento falha silenciosamente por causa de RLS

## Problema identificado

Analisando os network logs e edge function logs em detalhe:

1. O botao ESTA chamando o n8n com sucesso (edge function retorna 202, n8n responde 200)
2. Porem, o `PATCH tb_pms_reports SET status = 'processing'` **falha silenciosamente** por causa das politicas RLS

A politica de UPDATE na tabela `tb_pms_reports` so permite update para usuarios que possuem o wizard via `tb_pms_wizard` (tabela do sistema de usuarios logados). Como o hero admin nao e dono do wizard (e o wizard_id referencia `tb_pms_lp_wizard`, nao `tb_pms_wizard`), o update retorna 204 mas com 0 rows afetadas. O status nunca muda para "processing" no banco.

Resultado: o polling na primeira checagem (5s depois) encontra status = "failed" (o antigo), detecta `st.includes("fail")`, e para imediatamente. O icone para de girar e o report volta a "failed" antes do n8n terminar.

## Solucao

Duas alteracoes:

### 1. Mover o reset de status para dentro da edge function `pms-orchestrate-lp-report`

A edge function ja roda com service role, entao nao tem restricao de RLS. Adicionar o reset de status la dentro, antes de chamar o n8n:

**Arquivo:** `supabase/functions/pms-orchestrate-lp-report/index.ts`

- Receber `report_id` alem de `wizard_id` no body
- Usar o service role client para `UPDATE tb_pms_reports SET status = 'processing' WHERE id = report_id`

### 2. Remover o update do banco no frontend e passar report_id

**Arquivo:** `src/components/hero/mock/PlanningMySaasOverview.tsx`

- Remover o `supabase.from("tb_pms_reports").update({status: "processing"})` do frontend (que falha por RLS)
- Passar `report_id` junto com `wizard_id` no body do fetch para a edge function
- Adicionar um delay inicial no polling (aguardar 10s antes do primeiro poll) para dar tempo da edge function resetar o status e do n8n comecar

### 3. Adicionar delay no primeiro poll

Para evitar que o polling detecte o status "failed" antigo antes da edge function atualizar, o primeiro poll deve aguardar pelo menos 10 segundos apos o trigger.

## Detalhes tecnicos

Na edge function, antes do `EdgeRuntime.waitUntil(fetch(webhookUrl...))`:

```typescript
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
await supabaseAdmin
  .from("tb_pms_reports")
  .update({ status: "processing" })
  .eq("id", report_id);
```

No frontend, o fetch passa `{ wizard_id, report_id }` e o polling comeca com `setTimeout` de 10s antes do primeiro `setInterval`.

