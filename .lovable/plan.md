

# Automatizar Finalizacao do Relatorio via Database Trigger

## Problema Atual
O n8n preenche todas as secoes do relatorio e atualiza o status para `step completed - call_get_mvp_business_plan`, mas ninguem chama o `pms-finalize-report` para marcar como `completed` e gerar os snapshots/share_token.

## Solucao
Criar um database trigger em `tb_pms_reports` que detecta quando o status muda para o padrao do ultimo step completado e automaticamente chama a Edge Function `pms-finalize-report`.

## Implementacao

### 1. Criar funcao de trigger no banco

Uma funcao PL/pgSQL que:
- Detecta UPDATE na coluna `status` de `tb_pms_reports`
- Verifica se o novo status contem `call_get_mvp_business_plan` e `completed` (case-insensitive)
- Usa `net.http_post` (extensao pg_net ja disponivel) para chamar `pms-finalize-report` com o `wizard_id`
- Inclui tratamento de erro para nao bloquear o UPDATE do n8n

### 2. Criar o trigger

Trigger AFTER UPDATE na tabela `tb_pms_reports` que dispara apenas quando a coluna `status` muda.

### Fluxo automatizado

```text
n8n atualiza status -> "step completed - call_get_mvp_business_plan"
  |
  +-> Trigger dispara automaticamente
  +-> Chama pms-finalize-report via HTTP
  +-> Edge Function marca status = "completed"
  +-> Gera share_token, snapshots, share_url
```

### Detalhes tecnicos

- Usa `net.http_post` (mesmo padrao ja usado em `notify_pms_user_created_webhook` e `notify_pms_wizard_created_webhook`)
- URL: `https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-finalize-report`
- Authorization: Bearer com anon key (mesmo padrao dos triggers existentes)
- Body: `{ "wizard_id": NEW.wizard_id }`
- Tratamento EXCEPTION para nao quebrar a transacao do n8n

### Nenhuma mudanca necessaria no n8n
O n8n continua fazendo exatamente o que ja faz. O trigger cuida do resto automaticamente.

