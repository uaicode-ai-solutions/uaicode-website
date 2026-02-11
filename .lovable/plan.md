

## Adicionar colunas de redes sociais na `tb_crm_leads`

### Contexto
O Apollo retorna URLs de redes sociais no objeto `person` (`twitter_url`, `github_url`, `facebook_url`). Atualmente esses dados sao ignorados. Vamos criar colunas dedicadas para armazena-los.

O Apollo **nao** retorna `instagram_url` no enriquecimento de pessoa -- apenas `twitter_url`, `facebook_url`, `github_url` e `linkedin_url` (que ja existe na tabela).

### Novas colunas

| Coluna | Tipo | Origem no Apollo |
|---|---|---|
| `twitter_url` | text | `person.twitter_url` |
| `facebook_url` | text | `person.facebook_url` |
| `github_url` | text | `person.github_url` |

### Alteracoes

**1. Migration SQL**

```text
ALTER TABLE public.tb_crm_leads
  ADD COLUMN twitter_url text,
  ADD COLUMN facebook_url text,
  ADD COLUMN github_url text;
```

**2. Atualizar `src/integrations/supabase/types.ts`**
- Adicionar `twitter_url`, `facebook_url` e `github_url` nos tipos Row, Insert e Update de `tb_crm_leads`

**3. Atualizar o Code Node no n8n (Format Lead Data)**
- Adicionar ao mapeamento existente:

```text
twitter_url   <- person.twitter_url || ''
facebook_url  <- person.facebook_url || ''
github_url    <- person.github_url || ''
```

### Observacoes
- Esses campos frequentemente vem `null` do Apollo -- isso e normal, as colunas aceitam null
- Nenhuma alteracao de RLS necessaria -- as policies existentes cobrem automaticamente
- O campo `linkedin_profile` ja existe e ja esta sendo mapeado
