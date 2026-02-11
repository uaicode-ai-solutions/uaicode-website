

## Limpeza da tabela tb_crm_leads

### Objetivo
Remover colunas nao utilizadas e manter apenas os campos necessarios para o fluxo Apollo.

### Colunas a remover (12 colunas)

| Coluna | Motivo |
|---|---|
| user_id | Nao usado no fluxo Apollo |
| wizard_id | Nao usado no fluxo Apollo |
| score | Nao usado no fluxo Apollo |
| notes | Nao usado no fluxo Apollo |
| status | Nao usado no fluxo Apollo |
| saas_name | Nao usado no fluxo Apollo |
| budget | Nao usado no fluxo Apollo |
| timeline | Nao usado no fluxo Apollo |
| goal | Nao usado no fluxo Apollo |
| challenge | Nao usado no fluxo Apollo |
| description | Nao usado no fluxo Apollo |
| geographic_region | Nao usado no fluxo Apollo |

### Colunas que permanecem (22 colunas)

**Sistema:** id, created_at, updated_at

**Lead:** full_name, email (UNIQUE), phone, linkedin_profile, twitter_url, facebook_url, github_url, job_title

**Empresa:** company_name, company_revenue, company_size, company_website, industry

**Localizacao:** city, state, country

**Classificacao:** seniority, departments, source

### Aviso importante

Existem 4 registros no banco que possuem dados nos campos que serao removidos (user_id, wizard_id, budget, timeline, goal, challenge, description, geographic_region). Esses dados serao perdidos permanentemente.

### Sobre a ordem das colunas

PostgreSQL nao permite reordenar colunas sem recriar a tabela. Vou dropar as colunas desnecessarias -- a ordem logica pode ser controlada nas queries e na UI do admin.

### Detalhes tecnicos

**Migration SQL:**
```text
ALTER TABLE public.tb_crm_leads
  DROP COLUMN IF EXISTS user_id,
  DROP COLUMN IF EXISTS wizard_id,
  DROP COLUMN IF EXISTS score,
  DROP COLUMN IF EXISTS notes,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS saas_name,
  DROP COLUMN IF EXISTS budget,
  DROP COLUMN IF EXISTS timeline,
  DROP COLUMN IF EXISTS goal,
  DROP COLUMN IF EXISTS challenge,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS geographic_region;
```

**Apos a migration:** O arquivo `types.ts` sera atualizado automaticamente para refletir o novo schema.

