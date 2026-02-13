

# Gerar OG HTML no n8n e Publicar no Supabase Storage

## Resumo

Em vez de usar a Edge Function, o proprio n8n gera o arquivo HTML com as meta tags OG e faz upload para um bucket publico do Supabase Storage. O LinkedIn acessa o arquivo estatico diretamente, sem passar pelo Cloudflare Bot Management.

## O que precisa ser feito no Lovable

Apenas uma coisa: **criar o bucket publico `og-meta` no Supabase Storage**.

Isso sera feito via migracao SQL:

```text
INSERT INTO storage.buckets (id, name, public) VALUES ('og-meta', 'og-meta', true);

CREATE POLICY "Allow public read og-meta"
ON storage.objects FOR SELECT
USING (bucket_id = 'og-meta');
```

## O que voce faz no n8n (manual)

### Novo no: Code Node para gerar o HTML

Antes do no que posta no LinkedIn, adicionar um Code Node que:

1. Monta o HTML com as meta tags OG (titulo, descricao, imagem, URL canonica)
2. Faz upload via API REST do Supabase Storage
3. Retorna a URL publica do arquivo

Exemplo do codigo para o Code Node:

```text
const article = $('Insert Post on Supabase').first().json;

const ogTitle = article.meta_title || article.title;
const ogDesc = article.meta_description || article.excerpt;
const ogImage = article.cover_image_url;
const canonicalUrl = `https://uaicodewebsite.lovable.app/blog/${article.slug}`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${ogTitle}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDesc}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="UaiCode" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${ogDesc}" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta http-equiv="refresh" content="0;url=${canonicalUrl}" />
</head>
<body>
  <p>Redirecting...</p>
  <script>window.location.href="${canonicalUrl}";</script>
</body>
</html>`;

// Upload para Supabase Storage
const supabaseUrl = 'https://ccjnxselfgdoeyyuziwt.supabase.co';
const serviceKey = 'SUA_SERVICE_ROLE_KEY'; // usar credencial do n8n

const response = await fetch(
  `${supabaseUrl}/storage/v1/object/og-meta/${article.slug}.html`,
  {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'text/html',
      'x-upsert': 'true',
    },
    body: html,
  }
);

return [{
  json: {
    ogUrl: `${supabaseUrl}/storage/v1/object/public/og-meta/${article.slug}.html`,
    uploadStatus: response.status,
  }
}];
```

### Atualizar o Code Node do LinkedIn Post

Trocar o `originalUrl` para usar a URL do Storage:

```text
const ogUrl = $('Upload OG HTML').first().json.ogUrl;
// usar ogUrl como originalUrl no payload do LinkedIn
```

## Fluxo Final

```text
Artigo publicado
      |
  n8n gera HTML com meta tags OG
      |
  n8n faz upload para Storage (og-meta/slug.html)
      |
  n8n posta no LinkedIn com originalUrl = URL do Storage
      |
  LinkedIn crawler le arquivo estatico (sem bot protection)
      |
  Card grande com imagem aparece
```

## Vantagens

- Sem dependencia de Edge Function
- Sem Cloudflare Bot Management bloqueando crawlers
- Content-Type `text/html` automatico para arquivos `.html`
- Tudo controlado dentro do n8n

## Detalhes Tecnicos

- O bucket precisa ser publico para o crawler do LinkedIn acessar
- O `x-upsert: true` no header permite sobrescrever se o arquivo ja existir
- A `service_role_key` do Supabase e necessaria no n8n para fazer upload (a anon key nao tem permissao de escrita no Storage)

