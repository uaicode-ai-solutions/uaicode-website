

## Criar tabela `tb_crm_lead_prospects`

Criar apenas a tabela no banco de dados, sem alteracoes no frontend.

### Migration SQL

Uma unica migration que cria a tabela com todas as colunas do payload flat, trigger de `updated_at`, RLS habilitado e policies.

**Detalhes:**
- `stage` e `source` terao default vazio (`''`) em vez de valores pre-definidos
- UNIQUE constraint no campo `email`
- Reutiliza a funcao `update_tb_crm_leads_updated_at()` existente para o trigger
- 5 RLS policies identicas ao padrao de `tb_crm_leads`

### Colunas

```text
id, created_at, updated_at,
full_name, first_name, last_name, email (UNIQUE), phone,
job_title, seniority, departments, headline, photo_url,
years_of_experience, city, state, country,
linkedin_profile, facebook_url, twitter_url, github_url, instagram_url,
company_name, company_website, industry, company_size, company_revenue,
company_description, company_logo_url, company_founded_year,
company_city, company_state, company_country,
company_linkedin_url, company_facebook_url, company_instagram_url,
company_youtube_url, company_tiktok_url,
company_phone_enriched, company_email_enriched,
company_keywords (jsonb), company_tech_stack (jsonb),
source (default ''), stage (default ''),
employment_history (jsonb)
```

### RLS Policies

| Policy | Command | Expression |
|--------|---------|------------|
| Admins can view prospects | SELECT | `has_role(get_pms_user_id(), 'admin')` |
| Admins can update prospects | UPDATE | `has_role(get_pms_user_id(), 'admin')` |
| Admins can delete prospects | DELETE | `has_role(get_pms_user_id(), 'admin')` |
| Service role can insert prospects | INSERT | `auth.role() = 'service_role'` |
| hero_users can view prospects | SELECT | `get_hero_user_id() IS NOT NULL` |

### Arquivo modificado

Apenas uma nova migration SQL. Nenhum codigo frontend alterado.

