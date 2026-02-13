

# Converter Edge Function `og-blog-meta` para Upload no Storage

## Resumo

Vamos reaproveitar a Edge Function `og-blog-meta` que ja existe mas nao esta sendo usada. Em vez de retornar HTML diretamente (que era bloqueado pelo Cloudflare), ela vai receber os dados do post via JSON (POST do n8n), gerar o HTML internamente e fazer upload para o bucket `og-meta` no Supabase Storage.

## Como vai funcionar

O n8n envia um POST simples com JSON para a Edge Function. A funcao gera o HTML com as meta tags OG e faz upload direto para o Storage usando a `service_role_key`. Sem escaping, sem problemas de encoding.

```text
n8n (POST JSON) --> og-blog-meta (gera HTML + upload Storage) --> retorna URL publica
```

## O que muda no n8n

No lugar dos 3 nos atuais (Code Node + Convert to File + Upload HTTP Request), voce usa apenas **1 no HTTP Request**:

- **Method:** POST
- **URL:** `https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/og-blog-meta`
- **Body (JSON):**

```text
{
  "slug": "{{ slug }}",
  "title": "{{ title }}",
  "description": "{{ description }}",
  "image_url": "{{ cover_image_url }}",
  "meta_title": "{{ meta_title }}",
  "meta_description": "{{ meta_description }}"
}
```

- **Resposta:** JSON com `{ "url": "https://...supabase.co/storage/v1/object/public/og-meta/slug.html" }`

## Detalhes Tecnicos

### Alteracao na Edge Function `og-blog-meta`

A funcao sera reescrita para:

1. Aceitar **POST** com JSON contendo `slug`, `title`, `description`, `image_url` (e opcionais `meta_title`, `meta_description`)
2. Gerar o HTML com as meta tags OG internamente (sem escaping nos atributos de tags HTML -- apenas nos valores de texto)
3. Usar `SUPABASE_SERVICE_ROLE_KEY` para fazer upload do HTML como arquivo no bucket `og-meta`
4. Retornar a URL publica do arquivo

### Campos do JSON de entrada

| Campo | Obrigatorio | Descricao |
|-------|-------------|-----------|
| `slug` | Sim | Slug do post (usado como nome do arquivo) |
| `title` | Sim | Titulo do post |
| `description` | Nao | Descricao/excerpt |
| `image_url` | Nao | URL da imagem de capa |
| `meta_title` | Nao | Titulo SEO (fallback para title) |
| `meta_description` | Nao | Descricao SEO (fallback para description) |

### Logica interna

- Monta o HTML com as meta tags OG usando string template (sem escaping de `<` e `>`)
- Usa `escapeAttr()` apenas nos **valores** dentro dos atributos `content="..."` para seguranca
- Faz upload via Supabase client (`supabase.storage.from('og-meta').upload(...)`) com upsert
- Retorna JSON com a URL publica

### Config

O `verify_jwt = false` ja esta configurado no `config.toml` para esta funcao, entao nao precisa mudar nada.

### Secret necessaria

A funcao vai usar `SUPABASE_SERVICE_ROLE_KEY` que ja existe nos secrets do projeto.

