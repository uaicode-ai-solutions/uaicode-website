

## Adicionar colunas de enriquecimento Apollo na `tb_crm_leads`

### Problema
Os dados enriquecidos do Apollo (title, company revenue, employees, city/state) estao sendo concatenados em um unico campo `notes`, dificultando filtragem, ordenacao e analise no CRM.

### Solucao
Adicionar colunas dedicadas na tabela `tb_crm_leads` para armazenar os dados do Apollo de forma estruturada.

### Novas colunas

| Coluna | Tipo | Descricao |
|---|---|---|
| `job_title` | text | Cargo atual (ex: "Chief Marketing Officer") |
| `company_name` | text | Nome da empresa (separado do `saas_name` que e o SaaS do wizard) |
| `company_revenue` | text | Receita da empresa (ex: "666.5M") |
| `company_size` | integer | Numero de funcionarios |
| `city` | text | Cidade do lead |
| `state` | text | Estado/regiao do lead |
| `country` | text | Pais do lead |

O campo `notes` continua existindo para anotacoes manuais do time comercial.

### Alteracoes

**1. Migration SQL**
- `ALTER TABLE` para adicionar as 7 novas colunas
- Sem indices adicionais (nenhum campo necessita de busca frequente neste momento)

**2. Atualizar `src/integrations/supabase/types.ts`**
- Adicionar os novos campos nos tipos Row, Insert e Update de `tb_crm_leads`

**3. Atualizar o Code Node no n8n (Format Lead Data)**
- Mapear os campos do Apollo para as novas colunas:

```text
job_title       <- person.title
company_name    <- org.name
company_revenue <- org.annual_revenue_printed
company_size    <- org.estimated_num_employees
city            <- person.city
state           <- person.state
country         <- person.country
```

- O campo `notes` fica vazio (disponivel para uso manual)
- O campo `saas_name` tambem fica vazio (reservado para dados do wizard/n8n report)

### Detalhes Tecnicos

A migration SQL sera:
```text
ALTER TABLE public.tb_crm_leads
  ADD COLUMN job_title text,
  ADD COLUMN company_name text,
  ADD COLUMN company_revenue text,
  ADD COLUMN company_size integer,
  ADD COLUMN city text,
  ADD COLUMN state text,
  ADD COLUMN country text;
```

Nenhuma alteracao de RLS ou indices necessaria -- as policies existentes ja cobrem as novas colunas automaticamente.

