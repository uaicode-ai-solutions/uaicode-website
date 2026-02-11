

## Adicionar `seniority`, `departments` e `company_website` na `tb_crm_leads`

### Novas colunas

| Coluna | Tipo | Origem no Apollo |
|---|---|---|
| `seniority` | text | `person.seniority` |
| `departments` | text | `person.departments` (array joined) |
| `company_website` | text | `org.website_url` |

### Alteracoes

**1. Migration SQL**

```text
ALTER TABLE public.tb_crm_leads
  ADD COLUMN seniority text,
  ADD COLUMN departments text,
  ADD COLUMN company_website text;
```

**2. Atualizar `src/integrations/supabase/types.ts`**

Adicionar `seniority`, `departments` e `company_website` nos tipos Row, Insert e Update de `tb_crm_leads`.

**3. Code Node atualizado (Format Lead Data)**

```javascript
const person = $input.first().json.person;
const org = person.organization || {};

return [{
  json: {
    full_name: person.name || '',
    email: person.email || '',
    phone: org.phone || '',
    linkedin_profile: person.linkedin_url || '',
    twitter_url: person.twitter_url || '',
    facebook_url: person.facebook_url || '',
    github_url: person.github_url || '',
    job_title: person.title || '',
    company_name: org.name || '',
    company_revenue: org.annual_revenue_printed || '',
    company_size: org.estimated_num_employees || null,
    city: person.city || '',
    state: person.state || '',
    country: person.country || '',
    industry: org.industry || '',
    seniority: person.seniority || '',
    departments: Array.isArray(person.departments) ? person.departments.join(', ') : (person.departments || ''),
    company_website: org.website_url || '',
    source: 'apollo_prospecting',
    status: 'new',
    notes: ''
  }
}];
```

**Observacao sobre `departments`:** O Apollo retorna esse campo como array (ex: `["marketing", "sales"]`). O codigo usa `join(', ')` para salvar como texto separado por virgula.

### Supabase Insert Node

Lembre de adicionar as 3 novas colunas no mapeamento do no Supabase: `seniority`, `departments`, `company_website`.
