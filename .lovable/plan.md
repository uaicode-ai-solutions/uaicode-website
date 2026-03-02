

# Fix: Dominio incorreto no fallback do webhook URL

## Problema

O `pms-orchestrate-lp-report` usa o dominio `uaicode-n8n.ax5vln.easypanel.host` como fallback para montar a URL do webhook. Esse dominio e interno do Easypanel e nao resolve DNS externamente (a partir do Supabase Edge Functions).

O orchestrator original (`pms-orchestrate-report`) usa corretamente `n8n.uaicode.dev`.

**URL gerada (errada):**
`https://uaicode-n8n.ax5vln.easypanel.host/webhook/...`

**URL correta:**
`https://n8n.uaicode.dev/webhook/...`

## Alteracao

### Arquivo: `supabase/functions/pms-orchestrate-lp-report/index.ts`

Trocar todas as ocorrencias de `uaicode-n8n.ax5vln.easypanel.host` por `n8n.uaicode.dev`:

1. **Linha 40** (dentro do parser JSON, fallback para nodes):
   - De: `https://uaicode-n8n.ax5vln.easypanel.host/webhook/${node.parameters.path}`
   - Para: `https://n8n.uaicode.dev/webhook/${node.parameters.path}`

2. **Linha 52** (fallback para plain path ID):
   - De: `https://uaicode-n8n.ax5vln.easypanel.host/webhook/${webhookSecret}`
   - Para: `https://n8n.uaicode.dev/webhook/${webhookSecret}`

Alem disso, adicionar o **delay de 3 segundos entre steps** conforme aprovado no plano anterior, e o logging do response body para diagnostico.

## Resumo

| Alteracao | Detalhe |
|-----------|---------|
| Dominio webhook | `uaicode-n8n.ax5vln.easypanel.host` -> `n8n.uaicode.dev` |
| Delay entre steps | 3 segundos (novo) |
| Response logging | Primeiros 200 chars do body (novo) |
| Arquivo | `supabase/functions/pms-orchestrate-lp-report/index.ts` |

