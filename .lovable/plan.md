

## Chamar webhook de leads ao criar novo registro em tb_pms_wizard

### Resumo
Adicionar um trigger AFTER INSERT na tabela `tb_pms_wizard` que chama uma nova Edge Function `pms-webhook-new-leads`, que envia `wizard_id`, `client_email` e `client_full_name` para o webhook `N8N_PMS_GENERATE_LEADS_WEBHOOK_ID`. Nenhum arquivo existente sera modificado.

### Arquivos criados (nenhum existente sera alterado)

#### 1. `supabase/functions/pms-webhook-new-leads/index.ts` (NOVO)

- Recebe `{ wizard_id }` do trigger via `net.http_post`
- Busca `client_email` e `client_full_name` na `tb_pms_wizard` usando service role
- Le a secret `N8N_PMS_GENERATE_LEADS_WEBHOOK_ID`
- Envia POST ao webhook com payload:

```text
{
  "event": "wizard.created",
  "wizard_id": "uuid",
  "client_email": "email@example.com",
  "client_full_name": "Nome Completo",
  "timestamp": "2026-02-12T..."
}
```

- Tratamento de erro sem impactar nenhum fluxo existente

#### 2. Migration SQL (NOVA)

Cria function + trigger no banco, seguindo o padrao identico de `notify_pms_user_created_webhook`:

```text
CREATE FUNCTION notify_pms_wizard_created_webhook()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public', 'extensions'
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-webhook-new-leads',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <ANON_KEY>'
    ),
    body := jsonb_build_object('wizard_id', NEW.id)
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to call edge function: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_pms_wizard_created
  AFTER INSERT ON tb_pms_wizard
  FOR EACH ROW
  EXECUTE FUNCTION notify_pms_wizard_created_webhook();
```

#### 3. `supabase/config.toml` (adicionar entrada)

Adicionar somente a nova entrada, sem alterar nenhuma existente:

```text
[functions.pms-webhook-new-leads]
verify_jwt = false
```

### O que NAO sera alterado
- `pms-webhook-new-user/index.ts` -- intacto
- `pms-webhook-new-report/index.ts` -- intacto
- `pms-orchestrate-report/index.ts` -- intacto
- `PmsWizard.tsx` -- intacto
- Nenhum hook, pagina, componente ou edge function existente

