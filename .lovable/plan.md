

# LinkedIn Post com Card Grande de Imagem

## Problema
O LinkedIn mostra apenas um thumbnail pequeno porque o site e um SPA (Single Page Application) e nao possui meta tags Open Graph dinamicas por blog post. O crawler do LinkedIn nao executa JavaScript, entao ele ve apenas as meta tags estaticas do `index.html` (que sao genericas do site).

## Solucao

Duas frentes de trabalho: uma no Lovable (meta tags OG) e outra no n8n (prompt + Code node).

---

### Parte 1: Edge Function para Meta Tags OG (Lovable)

Criar uma Edge Function `og-blog-meta` que:
- Recebe o slug do blog post como parametro
- Busca os dados do post no Supabase (titulo, excerpt, imagem de capa)
- Retorna uma pagina HTML minima com as meta tags OG corretas
- Inclui um redirect JavaScript para o SPA real

Essa URL sera usada como `originalUrl` no post do LinkedIn, garantindo que o crawler leia as meta tags corretas.

**Fluxo:**
1. LinkedIn crawler acessa: `https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/og-blog-meta?slug=meu-post`
2. Edge Function retorna HTML com meta tags OG (og:title, og:description, og:image com imagem grande, og:url)
3. O crawler renderiza o card grande com imagem de capa
4. Usuarios reais que clicarem sao redirecionados para `https://uaicodewebsite.lovable.app/blog/meu-post`

**Meta tags incluidas:**
- `og:title` - titulo do post
- `og:description` - excerpt do post
- `og:image` - URL da imagem de capa (full size)
- `og:image:width` / `og:image:height` - dimensoes para garantir card grande (1200x630)
- `og:url` - URL canonica do blog post
- `og:type` - "article"
- `twitter:card` - "summary_large_image"

---

### Parte 2: Ajustes no n8n (feitos por voce manualmente)

#### 2a. System Prompt do Gemini atualizado

```
You are a LinkedIn copywriter for Uaicode, a tech company that builds AI-powered MVPs and SaaS products.

Write a LinkedIn post based on the article provided. Follow these rules strictly:

1. Start with a bold, provocative hook (1 line max)
2. Write 2-3 short sentences that tease the key insight — do NOT summarize the full article
3. Create curiosity: make the reader feel they MUST click to learn more
4. Use 2-4 emojis spread naturally through the text
5. Add 3-5 relevant hashtags on the last line
6. Total length: 40-80 words max (excluding hashtags)
7. Tone: confident, direct, founder-to-founder
8. Do NOT use generic phrases like "In today's world" or "As we all know"
9. Do NOT use any markdown formatting — no **, no ##, no bullet points, no asterisks. Plain text only.
10. Write in the same language as the article title
11. Do NOT include the article link in the text — it will be attached separately as a link preview card
12. End the text BEFORE the hashtags with a short CTA like "Swipe up to read" or "Link below" or "Tap to read more" (in the same language as the article)
```

#### 2b. Code Node atualizado

A mudanca principal e usar a URL da Edge Function como `originalUrl` para que o LinkedIn scrape as meta tags corretas e mostre o card grande:

```javascript
const text = $('Generate Linkedin Text Post').first().json.content.parts[0].text;
const article = $('Insert Post on Supabase').first().json;
const sub = $('Get Linkedin User ID').first().json.sub;

// URL da Edge Function com meta tags OG para o crawler do LinkedIn
const ogUrl = `https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/og-blog-meta?slug=${article.slug}`;

return [{
  json: {
    author: `urn:li:person:${sub}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text: text },
        shareMediaCategory: "ARTICLE",
        media: [{
          status: "READY",
          originalUrl: ogUrl,
          title: { text: article.title },
          description: { text: article.excerpt }
        }]
      }
    },
    visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
  }
}];
```

---

### Detalhes Tecnicos da Edge Function

A Edge Function `og-blog-meta`:
- Consulta `tb_web_newsletter_posts` pelo slug
- Retorna HTML com meta tags OG + redirect automatico via `<meta http-equiv="refresh">` para a URL real do blog
- Garante que `og:image` aponte para a `cover_image_url` do post em tamanho completo
- Inclui `og:image:width=1200` e `og:image:height=630` para forcar o card grande no LinkedIn

