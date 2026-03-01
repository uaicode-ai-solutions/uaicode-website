

## Trigger n8n Report apos submissao do Lead Wizard

Apos o usuario submeter o formulario do Lead Wizard, o backend chamara automaticamente o webhook do n8n (secret `WEBHOOK_PMS_LP_WIZARD_GENERATE_REPORT`) passando o `wizard_id` e o step name.

### Arquitetura

```text
User submits form
    |
    v
pms-lp-wizard-submit (Edge Function)
    |-- Insere na tb_pms_lp_wizard
    |-- Recebe o wizard_id
    |-- Fire-and-forget: chama webhook n8n
    |   com { wizard_id, tool_name: "call_new_report_requested" }
    v
Retorna sucesso ao frontend
```

### Alteracoes

**1. Edge Function: `supabase/functions/pms-lp-wizard-submit/index.ts`**

Apos o insert bem-sucedido na `tb_pms_lp_wizard`, adicionar uma chamada fire-and-forget ao webhook do n8n. Seguira o padrao do `pms-webhook-new-leads` para parsear a secret (suporte a URL direta, JSON do n8n, ou webhook ID simples).

- Ler a secret `WEBHOOK_PMS_LP_WIZARD_GENERATE_REPORT`
- Parsear usando a mesma logica robusta de `getWebhookUrl()` (suporte a URL, JSON export, ou path simples)
- Chamar o webhook com payload: `{ wizard_id, tool_name: "call_new_report_requested", timestamp }`
- Fire-and-forget: nao bloqueia a resposta ao usuario
- Erros no webhook sao logados mas nao impedem o sucesso da submissao

**2. Config: `supabase/config.toml`**

Nenhuma alteracao necessaria - `pms-lp-wizard-submit` ja tem `verify_jwt = false`.

### Detalhes tecnicos

A funcao `getWebhookUrl` sera adicionada inline no `pms-lp-wizard-submit/index.ts`, lendo de `WEBHOOK_PMS_LP_WIZARD_GENERATE_REPORT` e seguindo o mesmo padrao de robustez do `pms-webhook-new-leads`:

1. Se comeca com `http` -> usa direto como URL
2. Se comeca com `{` -> tenta parsear JSON e extrair URL
3. Caso contrario -> monta URL como `https://n8n.uaicode.dev/webhook/{value}`

O payload enviado ao n8n sera:
```json
{
  "wizard_id": "uuid-do-registro",
  "tool_name": "call_new_report_requested",
  "timestamp": "2026-03-01T..."
}
```
