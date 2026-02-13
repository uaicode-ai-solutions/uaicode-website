

## Corrigir preview do LinkedIn mostrando imagem/titulo generico

### Problema
O LinkedIn lê o `og:url` da edge function, que aponta para o SPA (`uaicodewebsite.lovable.app/blog/...`). O LinkedIn então re-faz scrape nessa URL e encontra o `index.html` generico com titulo e imagem do site principal, ignorando as meta tags do artigo.

### Solucao

**Arquivo:** `supabase/functions/og-blog-meta/index.ts`

1. Mudar o `og:url` para apontar para a propria edge function no custom domain em vez do SPA:
   - De: `https://uaicodewebsite.lovable.app/blog/${slug}`
   - Para: `https://api.uaicode.ai/functions/v1/og-blog-meta?slug=${slug}`

2. Manter o redirect (`meta refresh` e `window.location`) apontando para o SPA normalmente — isso so afeta usuarios reais (browsers), nao crawlers.

### Por que funciona

- Crawlers (LinkedIn, Twitter) leem o HTML raw e nao executam JavaScript nem seguem `meta refresh`
- Mas o LinkedIn re-faz scrape na URL definida em `og:url` — se essa URL aponta para o SPA, ele pega os meta tags genericos
- Apontando `og:url` para a propria edge function, o LinkedIn sempre encontra as meta tags corretas do artigo

### Detalhes tecnicos

Mudanca na funcao `buildHtml`:
- O parametro `canonicalUrl` passa a ser a URL da edge function (para `og:url`)
- Um novo parametro `redirectUrl` e adicionado para o redirect de usuarios reais

```text
og:url     -> https://api.uaicode.ai/functions/v1/og-blog-meta?slug=SLUG  (crawlers ficam aqui)
meta refresh -> https://uaicodewebsite.lovable.app/blog/SLUG               (usuarios sao redirecionados)
```

