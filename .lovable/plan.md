

# Remover Database Trigger de Auto-Finalizacao

## O que sera feito

Criar uma migration SQL para remover o trigger e a funcao que foram criados anteriormente, ja que a finalizacao sera chamada diretamente pelo n8n.

## SQL da migration

```sql
DROP TRIGGER IF EXISTS trg_pms_report_auto_finalize ON public.tb_pms_reports;
DROP FUNCTION IF EXISTS public.notify_pms_report_finalize();
```

## Configuracao no n8n

Adicionar um node **HTTP Request** como ultimo step do workflow:

- **Method**: POST
- **URL**: `https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-finalize-report`
- **Headers**:
  - `Authorization`: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg`
  - `Content-Type`: `application/json`
- **Body (JSON)**: `{ "wizard_id": "{{ $json.wizard_id }}" }`

Ajuste o caminho da variavel `wizard_id` conforme o seu workflow (pode ser `{{ $('Set Variables').item.json.wizard_id }}` ou similar).

