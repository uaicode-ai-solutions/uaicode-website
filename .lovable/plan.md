

## Corrigir og-blog-meta para funcionar com LinkedIn Post Inspector

### Problema
O LinkedIn Post Inspector retorna 500 ao tentar acessar arquivos HTML no Supabase Storage. O crawler nao consegue ler do Storage.

### Solucao
Adicionar um handler GET na Edge Function `og-blog-meta` que serve o HTML diretamente, sem depender do Storage.

### Como vai funcionar

```text
LinkedIn Crawler (GET ?slug=xxx) --> Edge Function --> Query banco --> Retorna HTML direto
n8n (POST com JSON)              --> Edge Function --> Upload Storage --> Retorna URL
```

### URL para o LinkedIn
```text
https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/og-blog-meta?slug=SEU-SLUG
```

### Mudanca tecnica

**Arquivo:** `supabase/functions/og-blog-meta/index.ts`

- Manter o handler POST existente (para n8n fazer upload no Storage)
- Adicionar handler GET que:
  1. Le o `slug` da query string
  2. Busca o post na tabela `tb_web_newsletter_posts` (campos: title, excerpt, cover_image_url, meta_title, meta_description)
  3. Filtra por `slug` e `is_published = true`
  4. Gera o HTML com meta tags OG
  5. Retorna com `Content-Type: text/html; charset=utf-8` e cache de 1 hora
  6. Usa `SUPABASE_URL` + `SUPABASE_ANON_KEY` para leitura publica

### Nenhuma outra mudanca necessaria
- `config.toml` ja tem `verify_jwt = false`
- Secrets `SUPABASE_URL` e `SUPABASE_ANON_KEY` ja existem
- Funcao `escapeAttr` ja existe e sera reutilizada

### Depois de implementar
No n8n, a URL do post no LinkedIn deve ser:
```text
https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/og-blog-meta?slug={{ $json.slug }}
```

