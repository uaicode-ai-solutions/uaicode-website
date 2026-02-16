

## Plano: Salvar Artigos Classificados na tb_media_trends

### Visao Geral

Adicionar colunas na `tb_media_trends` para armazenar os dados da classificacao SPICED, e configurar o no Supabase no n8n para salvar os 9 artigos filtrados.

---

### Passo 1: Migration - Novas colunas na tb_media_trends

Adicionar 3 colunas:

```sql
ALTER TABLE public.tb_media_trends
ADD COLUMN summary text,
ADD COLUMN spiced jsonb DEFAULT '{}'::jsonb,
ADD COLUMN relevance_score integer,
ADD COLUMN source text;
```

| Coluna | Tipo | Descricao |
|---|---|---|
| `summary` | `text` | Resumo de 2-3 frases gerado pela IA |
| `spiced` | `jsonb` | Objeto com situation, problem, impact, critical_event, decision |
| `relevance_score` | `integer` | Score 1-10 de relevancia para SaaS founders |
| `source` | `text` | Nome do RSS de origem (TechCrunch, Hacker News, Product Hunt) |

Nenhuma alteracao de RLS necessaria -- as policies existentes (Admin only) ja cobrem todas as operacoes.

---

### Passo 2: Configurar no Supabase no n8n

Adicionar um no **Supabase** (Insert Row) apos o no OpenAI com o seguinte mapeamento:

| Campo tb_media_trends | Valor n8n |
|---|---|
| `title` | `{{ $('Firecrawl Scrape').item.json.title }}` |
| `source_url` | `{{ $('Firecrawl Scrape').item.json.url }}` |
| `pillar` | `{{ $json.output[0].content[0].text.pillar }}` |
| `summary` | `{{ $json.output[0].content[0].text.summary }}` |
| `spiced` | `{{ JSON.stringify($json.output[0].content[0].text.spiced) }}` |
| `relevance_score` | `{{ $json.output[0].content[0].text.relevance_score }}` |
| `source` | `{{ $('RSS Read TechCrunch').item.json.title ? 'techcrunch' : 'unknown' }}` -- ajustar por branch |
| `hook_suggestion` | `{{ $json.output[0].content[0].text.spiced.decision }}` |
| `status` | `pending` |

**Nota sobre o campo `source`:** Como cada RSS feed tem seu proprio branch no workflow, a forma mais simples e usar um **Set node** antes do Firecrawl em cada branch para definir `source = 'techcrunch'`, `source = 'hackernews'`, ou `source = 'producthunt'`.

---

### Passo 3: Fluxo completo no n8n

```text
RSS Read (TechCrunch) --\
RSS Read (Hacker News) --> Merge --> Firecrawl Scrape --> IF (success) --> IF (relevance >= 7) --> Supabase Insert (tb_media_trends)
RSS Read (Product Hunt) --/                                                                              |
                                                                                                   OpenAI (SPICED)
```

A ordem exata depende de como os RSS feeds estao conectados hoje, mas o importante e que o **Supabase Insert** e o ultimo no da chain.

---

### Detalhes tecnicos

- O campo `hook_suggestion` sera preenchido com o `decision` do SPICED (ja serve como sugestao de hook para o post)
- O `status` comeca como `pending` -- quando o content for gerado depois, muda para `processed`
- Nenhuma alteracao de codigo no frontend e necessaria
- A RLS existente (Admin only) ja cobre INSERT na tabela

