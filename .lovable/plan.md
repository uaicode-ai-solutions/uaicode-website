
# Criar Edge Function "pms-finalize-report"

## Problema

O n8n preencheu todas as 12 secoes do relatorio com sucesso, mas nao executou o passo final de finalizacao. O registro ficou com:
- Status: `step completed - call_get_mvp_business_plan` (deveria ser `completed`)
- Sem `share_token`, `share_url`, `wizard_snapshot`, `marketing_snapshot`

Anteriormente essa logica vivia dentro do orchestrator, mas foi removida quando simplificamos para "fire-and-forget".

## Solucao

Criar uma nova Edge Function `pms-finalize-report` que o n8n chamara como ultimo passo do workflow. Essa funcao:

1. Recebe `{ wizard_id }` via POST
2. Busca o wizard data de `tb_pms_lp_wizard` para gerar o `wizard_snapshot`
3. Busca os dados de marketing de `tb_pms_mkt_tier` para calcular o `marketing_snapshot`
4. Gera um `share_token` criptograficamente seguro (32 hex chars)
5. Atualiza `tb_pms_reports` com:
   - `status = "completed"`
   - `share_token`
   - `share_url` (usando dominio de producao)
   - `share_enabled = true`
   - `share_created_at`
   - `wizard_snapshot`
   - `marketing_snapshot`
6. Retorna 200 com o share_url

## Arquivo novo

### `supabase/functions/pms-finalize-report/index.ts`

Logica principal:

```text
POST { wizard_id }
  |
  +-> Fetch tb_pms_lp_wizard (id, saas_name, market_type, industry, description)
  +-> Fetch tb_pms_mkt_tier (active services, prices)
  +-> Calculate marketing totals (uaicode vs traditional, savings)
  +-> Generate share_token (crypto.getRandomValues)
  +-> UPDATE tb_pms_reports SET status='completed', share_token, share_url, snapshots
  |
  <- 200 { success, share_url }
```

## Configuracao

- Adicionar `[functions.pms-finalize-report]` com `verify_jwt = false` no `supabase/config.toml` (pois sera chamado pelo n8n com service role)
- Usar `SUPABASE_SERVICE_ROLE_KEY` (ja existe nos secrets)
- URL de producao: `https://uaicodewebsite.lovable.app`

## Integracao com n8n

Apos o deploy, o n8n deve adicionar um ultimo step no workflow:

```text
POST https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-finalize-report
Headers:
  Authorization: Bearer <SUPABASE_ANON_KEY>
  Content-Type: application/json
Body: { "wizard_id": "..." }
```

## Correcao do registro atual

Alem de criar a funcao, vou chamar a funcao via curl para corrigir o registro existente do wizard `6f0f25c9-f93d-461b-9956-06da723599ad`.
