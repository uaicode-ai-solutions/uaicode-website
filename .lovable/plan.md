

## Recriar tb_crm_leads com todos os campos do payload

### Objetivo
Dropar e recriar a tabela `tb_crm_leads` com todas as colunas do payload flat validado, na mesma ordem do JSON.

### Migration SQL

A migration vai:
1. Dropar a tabela existente (CASCADE para remover policies e triggers)
2. Recriar com todas as colunas na ordem exata do JSON
3. Recriar o trigger de `updated_at`
4. Habilitar RLS e recriar as 4 policies originais
5. Adicionar UNIQUE constraint no email

### Ordem das colunas (espelhando o JSON)

```text
-- Colunas de sistema (sempre primeiro)
id                     uuid         PK, default gen_random_uuid()
created_at             timestamptz  NOT NULL, default now()
updated_at             timestamptz  NOT NULL, default now()

-- Dados do Lead (pessoais)
full_name              text
first_name             text
last_name              text
email                  text         UNIQUE
phone                  text
job_title              text
seniority              text
departments            text
headline               text
photo_url              text
years_of_experience    integer
city                   text
state                  text
country                text
linkedin_profile       text
facebook_url           text
twitter_url            text
github_url             text
instagram_url          text

-- Dados da Empresa
company_name           text
company_website        text
industry               text
company_size           integer
company_revenue        text
company_description    text
company_logo_url       text
company_founded_year   integer
company_city           text
company_state          text
company_country        text
company_linkedin_url   text
company_facebook_url   text
company_instagram_url  text
company_youtube_url    text
company_tiktok_url     text
company_phone_enriched text
company_email_enriched text
company_keywords       jsonb        default '[]'
company_tech_stack     jsonb        default '[]'

-- Metadados
source                 text         default 'n8n_workflow'
employment_history     jsonb        default '[]'
```

### RLS Policies (recriadas identicas)

| Policy | Command | Expression |
|--------|---------|------------|
| Admins can view leads | SELECT | `has_role(get_pms_user_id(), 'admin')` |
| Admins can update leads | UPDATE | `has_role(get_pms_user_id(), 'admin')` |
| Admins can delete leads | DELETE | `has_role(get_pms_user_id(), 'admin')` |
| Service role can insert leads | INSERT | `auth.role() = 'service_role'` |

### Atualizar LeadManagement.tsx

Atualizar o componente para exibir os novos campos no dialog de detalhes:
- Foto do lead como avatar
- Headline abaixo do nome
- Seção de redes sociais pessoais (incluindo Instagram)
- Seção de empresa com logo, description, socials da empresa
- Employment history como lista
- CSV export com os novos campos

### Arquivos modificados

1. **Migration SQL** -- nova migration para DROP + CREATE da tabela
2. **`src/components/hero/mock/LeadManagement.tsx`** -- exibir novos campos no dialog e tabela

