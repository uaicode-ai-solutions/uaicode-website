

# Edge Function: `pms-send-newsletter-broadcast`

## Objetivo

Criar uma edge function que o n8n chamara apos gravar um artigo no banco. A funcao busca o post recem-publicado e envia um email de newsletter para todos os assinantes da tabela `tb_web_newsletter`.

## Como funciona

```text
n8n grava post no tb_web_newsletter_posts
          |
          v
n8n chama POST /pms-send-newsletter-broadcast
  Body: { "post_id": "uuid-do-post" }
          |
          v
Edge Function:
  1. Busca o post pelo ID (service role, bypassa RLS)
  2. Busca todos os emails de tb_web_newsletter (service role)
  3. Envia email via Resend em batches de 50
  4. Retorna quantidade de emails enviados
```

## O que sera criado

### 1. `supabase/functions/pms-send-newsletter-broadcast/index.ts`

- Recebe `{ post_id }` no body (POST)
- Usa `SUPABASE_SERVICE_ROLE_KEY` + `SUPABASE_URL` para criar client admin e buscar dados
- Busca o post completo de `tb_web_newsletter_posts` pelo ID
- Busca todos os emails de `tb_web_newsletter`
- Gera um email HTML no estilo visual UaiCode (dark + gold) contendo:
  - Titulo do artigo
  - Imagem de capa
  - Excerpt/resumo
  - Botao "Read Full Article" linkando para `https://uaicodewebsite.lovable.app/blog/{slug}`
  - Footer com links UaiCode
- Envia via Resend API em batches (Resend aceita array de ate 50 destinatarios por chamada)
- Retorna `{ success: true, total_subscribers, emails_sent }`

### 2. `supabase/config.toml`

- Adicionar entrada `[functions.pms-send-newsletter-broadcast]` com `verify_jwt = false`

## Configuracao no n8n

Apos o node que insere no Supabase, adicionar um node **HTTP Request**:

| Campo | Valor |
|-------|-------|
| Method | POST |
| URL | `https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-send-newsletter-broadcast` |
| Headers | `Authorization: Bearer {anon_key}`, `Content-Type: application/json` |
| Body | `{ "post_id": "{{ $json.id }}" }` |

## Secrets necessarias

Todas ja existem no projeto:
- `RESEND_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (ou `SUPABASE_URL`)

## Detalhes tecnicos

- Segue o mesmo padrao das edge functions existentes (imports, cors headers, error handling)
- Template HTML segue a identidade visual UaiCode (background #0A0A0A, gold #FACC15) igual ao `pms-send-report-ready`
- Batch de 50 emails por chamada Resend para evitar rate limits
- Logs detalhados para debug no Supabase dashboard

